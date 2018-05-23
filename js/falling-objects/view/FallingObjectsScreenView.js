// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/falling-objects/FallingObjectsConstants' );
  var FallingObjectNode = require( 'FALLING_OBJECTS/falling-objects/view/FallingObjectNode' );
  var FallingObjectViewFactory = require( 'FALLING_OBJECTS/falling-objects/view/FallingObjectViewFactory' );
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
    var self = this;
    var screenWidth = this.layoutBounds.width;
    var screenHeight = this.layoutBounds.height;

    // Create model-view transform
    var center = new Vector2( screenWidth / 2, screenHeight / 2 );
    var scale = FallingObjectsConstants.MODEL_VIEW_TRANSFORM_SCALE;
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( center, scale );

    // Create a view factory
    this.fallingObjectViewFactory = new FallingObjectViewFactory( );

    // Create the FallingObjectNode to display the currently falling object
    this.fallingObjectNode = new FallingObjectNode( this.fallingObjectsModel.selectedObject, this.fallingObjectViewFactory, this.modelViewTransform );
    this.addChild( this.fallingObjectNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        fallingObjectsModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
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