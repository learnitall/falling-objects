// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlButtons = require( 'FALLING_OBJECTS/common/view/ControlButtons' );
  var TogglePanel = require( 'FALLING_OBJECTS/common/view/TogglePanel' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var FallingObjectNode = require( 'FALLING_OBJECTS/common/view/FallingObjectNode' );
  var FallingObjectSelectorNode = require( 'FALLING_OBJECTS/common/view/FallingObjectSelectorNode' );
  var FallingObjectViewFactory = require( 'FALLING_OBJECTS/common/view/FallingObjectViewFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
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

    // Variables for this constructor and for the layout method, for convenience
    // @private
    var screenWidth = this.layoutBounds.width;
    var screenHeight = this.layoutBounds.height;
    var center = new Vector2( screenWidth / 2, screenHeight / 2 );
    var scale = FallingObjectsConstants.MODEL_VIEW_TRANSFORM_SCALE;
    this.controlPanelsMaxWidth = screenWidth / 4;
    this.controlPanelsVerticalSpacing = FallingObjectsConstants.CONTROL_PANELS_VERTICAL_SPACING;

    // Create model-view transform
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( center, scale );

    // Create a view factory
    this.fallingObjectViewFactory = new FallingObjectViewFactory( );

    // Create the FallingObjectNode to display the currently falling object
    this.fallingObjectNode = new FallingObjectNode(
      this.fallingObjectsModel,
      this.fallingObjectViewFactory,
      this.modelViewTransform
    );
    this.addChild( this.fallingObjectNode );

    // Add the simulation controls

    // Control Buttons (Play/Pause, Reset, Step)
    this.controlButtons = new ControlButtons( fallingObjectsModel, this.controlPanelsMaxWidth );

    // Falling Object Selector Node
    // The parent holds the comboBox
    this.fallingObjectSelectorParent = new Node();
    this.fallingObjectSelectorNode = new FallingObjectSelectorNode(
      this.fallingObjectsModel,
      this.fallingObjectsModel.fallingObjectNames,
      this.controlPanelsMaxWidth,
      this.fallingObjectSelectorParent
    );

    // Add all the controls as children
    this.addChild( this.fallingObjectSelectorNode );
    this.addChild( this.controlButtons );
    this.addChild( this.fallingObjectSelectorParent );
  }

  fallingObjects.register( 'FallingObjectsScreenView', FallingObjectsScreenView );

  return inherit( ScreenView, FallingObjectsScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    },

    /**
     * Layout the Nodes on the screen
     * @override
     *
     * @param {number} width
     * @param {number} height
     */
    layout: function( width, height ) {

      // First we need to scale and center the screen view to match the actual browser screen as best as possible
      // This code is from the default layout method which we are overwriting

      // Start with a clean transformation on the screen view
      this.resetTransform();

      // Determine the scale used for laying out components, and set our screen view's scale to match
      // If the difference between the screen view's width and the actual screen's width is smaller than the
      // respective difference in height, then that scale is used (and vice versa)
      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      // After scaling, translate the screen view on the screen so that it is centered
      var offsetX = 0;
      var offsetY = 0;

      // If we are scaling the screen view based off of width, then center it on the screen vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = (height / scale - this.layoutBounds.height) / 2;
      }

      // If we are scaling the screen view based off of height, then center it on the screen horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = (width / scale - this.layoutBounds.width) / 2;
      }

      // Move the screen view
      this.translate( offsetX, offsetY );

      // Now position nodes into place
      // Note that the fallingObjectNode will place itself based on the modelViewTransform
      var screenMarginX = FallingObjectsConstants.SCREEN_MARGIN_X;
      var screenMarginTop = FallingObjectsConstants.SCREEN_MARGIN_Y;

      // Move the selector to the top right (it's the control panel highest on screen)
      this.fallingObjectSelectorNode.setRightTop( new Vector2( width - screenMarginX, screenMarginTop ) );
      this.fallingObjectSelectorParent.centerX = this.fallingObjectSelectorNode.centerX;
      this.fallingObjectSelectorParent.top = this.fallingObjectSelectorNode.top + this.fallingObjectSelectorNode.panelOptions.yMargin;

      // Use the relative position of the selector to place the control buttons
      this.controlButtons.top = this.fallingObjectSelectorNode.bottom + this.controlPanelsVerticalSpacing;
      this.controlButtons.centerX = this.fallingObjectSelectorNode.centerX;

      // Update the visible bounds of the screen view based on our previous calculations
      this.visibleBoundsProperty.set( new Bounds2( -offsetX, -offsetY, width / scale - offsetX, height / scale - offsetY ) );
    }
  } );
} );