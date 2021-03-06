// Copyright 2018, University of Colorado Boulder

/**
 * Addition to the MovingBackground that adds a Ground that the FallingObjectNode can fall onto
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * Construct the Ruler and Ground which will overlay onto the MovingBackground
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object
   * @param {ModelViewTransform2} modelViewTransform - used to translate between model and view coordinates
   * @constructor
   */
  function MovingBackgroundGround( fallingObjectsModel, modelViewTransform ) {

    // Call the super
    Node.call( this );

    // Grab reference to self
    var self = this;
    // ...and fallingObjectsModel
    // @private
    this.fallingObjectsModel = fallingObjectsModel;

    // Create the ground
    // Don't know dimensions yet, will be set in layout
    // @private (read-only)
    this.groundNode = new Rectangle( 0, 0, 0, 0, { fill: FallingObjectsConstants.MBR_GROUND_COLOR } );

    // Create a target
    var targetNodeCircleOptions = { stroke: 'black', lineWidth: FallingObjectsConstants.MBR_TARGET_LINE_WIDTH };
    // @private (read-only)
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

    // Create a link to update the position of the ground as the falling object's model position changes
    // When the model distance from the ground becomes greater than the view distance from the ground, move the ground
    // down off the screen to resemble the object moving upwards
    // @private
    this.screenHeight = 0;  // Need to know the screenHeight- will be given in layout method
    // @private
    this.updatePositionOnScreen = function( position ) {

      // Position of the ground when falling object model position is zero
      var defaultPosGround = self.screenHeight - ( self.groundNode.height / 2 );

      // If the object is above its origin position
      if ( modelViewTransform.modelToViewDeltaY( position.y ) > self.fallingObjectsModel.viewDistanceToGroundProperty.get() ) {

        self.setCenterY(
          defaultPosGround +
          // Height above the falling object's origin position
          modelViewTransform.modelToViewDeltaY( position.y ) - self.fallingObjectsModel.viewDistanceToGroundProperty.get()
        );

      } else {

        // Update position of ground to be at its default location
        if ( self.getCenterY() !== defaultPosGround ) {
          self.setCenterY( defaultPosGround );
        }

      }

    };
    this.fallingObjectsModel.selectedFallingObject.positionProperty.lazyLink( this.updatePositionOnScreen );

  }

  fallingObjects.register( 'MovingBackgroundGround', MovingBackgroundGround );

  return inherit( Node, MovingBackgroundGround, {


    /**
     * Layout the nodes that make up the MovingBackgroundRuler
     * @public
     *
     * @param {number} offsetX - calculated x offset between actual user's screen and the default screen layout
     * @param {number} offsetY - calculated y offset between actual user's screen and the default screen layout
     * @param {number} width - width of the screen
     * @param {number} height - height of the screen
     * @param {scale} scale - scale between the actual user's screen and the default screen layout
     */
    layout: function( offsetX, offsetY, width, height, scale ) {

      // Determine center of screen, screenWidth and screenHeight for convenience
      var screenWidth = -offsetX + width / scale;
      this.screenHeight = -offsetY + height / scale;

      // Set the dimensions of the ground
      this.groundNode.setRect(
        -offsetX, 0, width / scale, this.screenHeight * FallingObjectsConstants.MBR_GROUND_HEIGHT_SCALAR
      );

      // Be sure to reset transform in case multiple layouts are called
      this.targetNode.resetTransform();
      // Set the position of the target right in the center of the ground
      this.targetNode.setCenter( this.groundNode.getCenter() );
      // Set scale of the targetNode
      var targetNodeWidth = screenWidth * FallingObjectsConstants.MBR_TARGET_WIDTH_SCALAR;
      var targetNodeHeight = this.groundNode.getHeight() * FallingObjectsConstants.MBR_TARGET_HEIGHT_SCALAR;
      this.targetNode.setScaleMagnitude(
        targetNodeWidth / this.targetNode.getWidth(),
        targetNodeHeight / this.targetNode.getHeight()
      );

      // Make sure position on the screen is appropriate
      this.updatePositionOnScreen( this.fallingObjectsModel.selectedFallingObject.positionProperty.get() );

    }

  } );

} );