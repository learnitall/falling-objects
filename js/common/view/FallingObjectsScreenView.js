// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var ControlButtonsNode = require( 'FALLING_OBJECTS/common/view/ControlButtonsNode' );
  var ControlPanelNode = require( 'FALLING_OBJECTS/common/view/ControlPanelNode' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var FallingObjectNode = require( 'FALLING_OBJECTS/common/view/FallingObjectNode' );
  var FallingObjectSelectorNode = require( 'FALLING_OBJECTS/common/view/FallingObjectSelectorNode' );
  var FallingObjectViewFactory = require( 'FALLING_OBJECTS/common/view/FallingObjectViewFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {FallingObjectsModel} fallingObjectsModel
   * @constructor
   */
  function FallingObjectsScreenView( fallingObjectsModel ) {

    // Hold onto a reference of the model
    this.fallingObjectsModel = fallingObjectsModel;

    // Call super constructor
    ScreenView.call( this );

    // Variables for this constructor, for convenience
    var screenWidth = this.layoutBounds.width;
    var screenHeight = this.layoutBounds.height;

    // Create model-view transform
    var center = new Vector2( screenWidth / 2, screenHeight / 2 );
    var scale = FallingObjectsConstants.MODEL_VIEW_TRANSFORM_SCALE;
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( center, scale );

    // Create a view factory
    this.fallingObjectViewFactory = new FallingObjectViewFactory( );

    // Create the FallingObjectNode to display the currently falling object
    this.fallingObjectNode = new FallingObjectNode( this.fallingObjectsModel, this.fallingObjectViewFactory, this.modelViewTransform );
    this.addChild( this.fallingObjectNode );

    // Add the simulation controls
    var controlsNodeMaxWidth = screenWidth / 5;
    var controlsNodeSpacing = FallingObjectsConstants.CONTROLS_NODE_SPACING;
    var controlsNodeAlignment = FallingObjectsConstants.CONTROLS_NODE_ALIGNMENT;

    // Control Buttons (Play/Pause, Reset, Step)
    var controlButtonsNode = new ControlButtonsNode( fallingObjectsModel, controlsNodeMaxWidth );

    // ComboBox selector
    var fallingObjectSelectorNode = new FallingObjectSelectorNode(
      fallingObjectsModel,
      this.fallingObjectsModel.fallingObjectNames,
      controlsNodeMaxWidth
    );

    // Create a VBox to hold and place control nodes
    var controlsNodeVBox = new VBox( {
      align: controlsNodeAlignment,
      spacing: controlsNodeSpacing,
      children: [
        controlButtonsNode,
        fallingObjectSelectorNode
      ]
    } );
    this.addChild( controlsNodeVBox );
  }

  fallingObjects.register( 'FallingObjectsScreenView', FallingObjectsScreenView );

  return inherit( ScreenView, FallingObjectsScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );