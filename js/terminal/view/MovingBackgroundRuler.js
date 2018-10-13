// Copyright 2018, University of Colorado Boulder

/**
 * Addition to the MovingBackground that adds a Ground that the FallingObjectNode can fall onto.
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
  function MovingBackgroundGround( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

    // Create the ground
    // Don't know dimensions yet, will be set in layout
    this.groundNode = new Rectangle( 0, 0, 0, 0, { fill: FallingObjectsConstants.MBR_GROUND_COLOR } );

    // Create a target
    var targetNodeCircleOptions = { stroke: 'black', lineWidth: FallingObjectsConstants.MBR_TARGET_LINE_WIDTH };
    this.targetNode = new Node( {
      children: [
        // Outer circle
        new Circle( 1, _.extend( { fill: 'red' }, targetNodeCircleOptions ) ),
        // Middle circle
        new Circle( 2 / 3, _.extend( { fill: 'white' }, targetNodeCircleOptions ) ),
        // Inner circle
        new Circle( 1 / 3, _.extend( { fill: 'red' }, targetNodeCircleOptions ) )
      ]
    } );

    this.addChild( this.groundNode );
    this.addChild( this.targetNode );

  }

  fallingObjects.register( 'MovingBackgroundGround', MovingBackgroundGround );

  return inherit( Node, MovingBackgroundGround, {


    /**
     * Layout the nodes that make up the MovingBackgroundRuler
     * @param {number} screenWidth - updated width of the visible screen calculated based off of scales and offsets
     * @param {number} screenHeight - updated height of the visible screen calculated based off of scales and offsets
     */
    layout: function( screenWidth, screenHeight ) {

      // Set the dimensions of the ground
      this.groundNode.setRectBounds( new Bounds2( 0, 0, screenWidth, screenHeight * FallingObjectsConstants.MBR_GROUND_HEIGHT_SCALAR ) );

      console.log( this.groundNode.getRectBounds );

      // Set the position of the target right in the center of the ground
      this.targetNode.setCenter( this.groundNode.getCenter() );
      // Set scale of the targetNode
      var targetNodeWidth = screenWidth * FallingObjectsConstants.MBR_TARGET_WIDTH_SCALAR;
      var targetNodeHeight = this.groundNode.getHeight() * FallingObjectsConstants.MBR_TARGET_HEIGHT_SCALAR;
      this.targetNode.setScaleMagnitude( targetNodeWidth / this.targetNode.getWidth(), targetNodeHeight / this.targetNode.getHeight() );

    }

  } );

} );