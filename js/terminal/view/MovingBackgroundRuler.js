// Copyright 2018, University of Colorado Boulder

/**
 * Addition to the MovingBackground that adds a Ruler and a Ground that the FallingObjectNode can
 * fall onto.
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var rocketImage = require( 'image!FALLING_OBJECTS/rocket.png' );

  /**
   * Construct the Ruler and Ground which will overlay onto the MovingBackground.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object
   */
  function MovingBackgroundRuler( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

    // Create the ground
    // Don't know dimensions yet, will be set in layout
    var ground = new Rectangle( 0, 0, 0, 0, { fill: FallingObjectsConstants.MBR_GROUND_COLOR } );

    this.addChild( ground );

  }

  fallingObjects.register( 'MovingBackgroundRuler', MovingBackgroundRuler );

  return inherit( Node, MovingBackgroundRuler, {


    /**
     * Layout the nodes that make up the MovingBackgroundRuler
     * @param {number} offsetX - calculated x offset between actual user's screen and the default screen layout
     * @param {number} offsetY - calculated y offset between actual user's screen and the default screen layout
     * @param {number} width - width of the screen
     * @param {number} height - height of the screen
     * @param {scale} scale - scale between the actual user's screen and the default screen layout
     */
    layout: function( offsetX, offsetY, width, height, scale ) {

      // Define these for convenience
      var screenWidth = -offsetX + ( width / scale - offsetX );
      var screenHeight = -offsetY + ( height / scale - offsetY );

      // Set the dimensions of the ground
      ground.setRectBounds( new Bounds2( 0, 0, screenWidth, screenHeight * 0.1 ) );

    }

  } );

} );