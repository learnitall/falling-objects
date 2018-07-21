// Copyright 2018, University of Colorado Boulder

/**
 * Moving background that acts as the sky for the falling object. Contains animated
 * clouds and a ruler that will 'fall' upwards as the falling object is dropped, giving
 * users the appearance of an object falling in the sky.
 * Based on the MovingBackgroundNode from Forces and Motion Basics
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var cloudImage = require( 'image!FALLING_OBJECTS/cloud.png' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the background. Most of the work done here is to create a skeleton that will
   * be filled in and sized in the 'layout' function.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object
   */
  function MovingBackground( fallingObjectsModel ) {

    // Call the super
    Node.call( this );
    
    // Get a reference to model and self
    this.fallingObjectsModel = fallingObjectsModel;
    var self = this;

    // Create a rectangular sky
    this.sky = new Rectangle( 0, 0, 0, 0 );  // don't know screen dimensions yet, so sizing for later
    this.addChild( this.sky );

    // Create a container node for the clouds (children are sorted, i.e., cloud at index 0 is closest to the top)
    this.cloudContainerNode = new Node();
    this.addChild( this.cloudContainerNode );

    // Create a link so when the selected falling object changes the background is reset (same behavior with the Free Body Diagram)
    fallingObjectsModel.selectedFallingObjectNameProperty.link( function( selectedFallingObjectName ) {
      self.reset();
    } );

  }

  fallingObjects.register( 'MovingBackground', MovingBackground );

  return inherit( Node, MovingBackground, {

    /**
     * Calculates and sets the sky's fill to the appropriate gradient based on the selected falling
     * object's altitude. The sky's dimensions should be set prior to calling this method.
     * TODO: Will be linked to altitude at a later date, for now this is constant
     */
    updateSkyGradient: function() {

      // Just set to a constant gradient for now
      // Use the height of the sky node rectangle to determine the height of the linear gradient
      this.sky.setFill( new LinearGradient( 0, 0, 0, this.sky.height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' ) );

    },

    /**
     * Return a valid x-coordinate for a cloud node
     *
     * @param {number} centerX - center X coordinate of the screen
     * @param {boolean} placeOnLeft - if true then the cloud will be placed to the left of the center, and if false then to the right
     */
    genCloudNodeXPos: function( centerX, placeOnLeft ) {
      //TODO: should be adjusted to x can cover a larger area

      // Define these constants for convenience
      var cloudMarginX = FallingObjectsConstants.MB_CLOUD_MARGIN_X;
      var cloudMarginXVariance = FallingObjectsConstants.MB_CLOUD_MARGIN_X_VARIANCE;

      // Determine spacing between the cloud node and the center of the screen
      // Use the base margin and apply a variant factor, which ranges from 0 to cloudMarginXVariance
      var padding = cloudMarginX + ( cloudMarginXVariance * Math.random() );
      // If the cloud is on the left then the padding is negative, otherwise positive
      if ( placeOnLeft ) {
        padding *= -1;
      }

      // Return the new xCoordinate for the cloud
      return centerX + padding;

    },

    /**
     * Return a valid scale for a cloud node
     */
    genCloudNodeScale: function() {

      // Define these constants here for convenience
      var scaleRange = FallingObjectsConstants.MB_CLOUD_SCALE_RANGE;

      // The scale of the cloud is a random float in the above scaleRange
      return ( Math.random() * scaleRange.getLength() ) + scaleRange.min;

    },

    /**
     * Create a new CloudNode to add into the background. Will have a random initial scale and x
     * coordinate- both of which will be reset when the cloud reaches the top of the screen.
     *
     * @param {number} initialCenterX - initial coordinate of the X center of the cloud node
     * @param {number} initialTopY - initial coordinate of the top of the cloud node
     * @param {number} initialScale - initial scale of the cloud node
     */
    createCloudNode: function( initialCenterX, initialTopY, initialScale ) {

      // First create a new image that will act as our node
      var cloudNode = new Image( cloudImage );
      // get a reference to this
      var self = this;

      /**
       * Override the reset method of the node for repositioning when the user resets the sim. 
       * This also acts as a layout method, as it sets the cloud in its initial position
       */
      cloudNode.reset = function() {
        cloudNode.setScaleMagnitude( initialScale );
        cloudNode.setCenterX( initialCenterX );
        cloudNode.setTop( initialTopY );
      };

      // Link the cloudNode's position with the selected falling object's position property
      this.fallingObjectsModel.selectedFallingObject.positionProperty.lazyLink( function( newPosition, oldPosition ) {

        // Animate the cloud to move upwards so the selected falling object appears to fall downwards
        var dy = ( ( newPosition.y - oldPosition.y ) * cloudNode.getScaleVector().y );
        cloudNode.setCenterY( cloudNode.getCenterY() + dy );

        // If we hit the top, then reset
        if ( cloudNode.bottom < self.sky.top ) {
          cloudNode.setScaleMagnitude( self.genCloudNodeScale() );
          cloudNode.setCenterX( self.genCloudNodeXPos() );
          cloudNode.setTop( self.sky.bottom );
        }

      } );

      cloudNode.reset();  // call reset to layout initial position

      return cloudNode;

    },

    /**
     * Layout nodes on the moving background
     *
     * @param {number} offsetX - calculated x offset between actual user's screen and the default screen layout
     * @param {number} offsetY - calculated y offset between actual user's screen and the default screen layout
     * @param {number} width - width of the screen
     * @param {number} height - height of the screen
     * @param {scale} scale - scale between the actual user's screen and the default screen layout
     */
    layout: function( offsetX, offsetY, width, height, scale ) {

      // Determine center of the screen for convenience in the following calculations
      var center = new Vector2( ( -offsetX + ( width / scale - offsetX ) ) / 2, ( -offsetY + ( height / scale - offsetY ) ) / 2 );

      // Set the sky's dimensions and position
      this.sky.setRect( -offsetX, -offsetY, width / scale, height / scale );
      this.sky.center = center;
      // And now set the sky's color
      // TODO: Move this to a property link on altitude
      this.updateSkyGradient();

      // Define these constants for convenience
      var cloudMarginY = FallingObjectsConstants.MB_CLOUD_MARGIN_Y;
      var cloudMarginYVariance = FallingObjectsConstants.MB_CLOUD_MARGIN_Y_VARIANCE;

      // These variable will help with generating the clouds
      var lastBotY = -offsetY;  // bottom y coordinate of the last cloud node to be created (set initially to min value of zero, which is top of screen)
      var posOnLeftCounter = 0;  // which side of the center the cloud should be placed on (if the counter is divisible by 2, will be on the left, otherwise on the right)


      // Layout our cloud nodes

      // Check if we already have cloud nodes created on the screen
      if ( this.cloudContainerNode.children.length > 0 ) {
        // TODO: Check the cloud nodes' x coordinate

        // If we have clouds extending past the screen, then remove them (this means screen size has decreased)
        var lastChild = this.cloudContainerNode.getChildAt( this.cloudContainerNode.children.length - 1 );
        while ( lastChild.getTop() > this.sky.height && this.cloudContainerNode.children.length >= 2 ) {
          this.cloudContainerNode.removeChild( lastChild );
          lastChild = this.cloudContainerNode.getChildAt( this.cloudContainerNode.children.length - 1 );
        }

        // If the screen size has increased or decreased, then make sure the existing clouds are at the top of the screen
        if ( this.cloudContainerNode.getTop() > -offsetY + cloudMarginY + cloudMarginYVariance || this.cloudContainerNode.getTop() < -offsetY ) {

          this.cloudContainerNode.setTop( -offsetY + cloudMarginY + ( Math.random() * cloudMarginYVariance ) );
          // if we need to move the clouds up, then most likely we'll need to add clouds as well
          lastBotY = lastChild.getBottom();
          console.log(lastChild.getCenterX(), "child center x");
          console.log(center.x, "center x");
          posOnLeftCounter = lastChild.getCenterX() < center.x ? 1 : 0;
          console.log(posOnLeftCounter, "poso on left counter");

        } else {
          // if we don't need to move the clouds upward, then don't need to add clouds either
          return;
        }

      }

      // Create and add cloud nodes
      // While we still have sky left to create a cloud
      while ( lastBotY <= this.sky.height ) {

        // Determine the initial top Y value of the next cloud to be created, based on margins and the previous cloud's bottom y value
        var initialTopY = lastBotY + cloudMarginY + ( Math.random() * cloudMarginYVariance );  // Add variance to the margin in the range of 0 to cloudMarginYVariance
        // Determine the initial X value
        var initialCenterX = this.genCloudNodeXPos( center.x, posOnLeftCounter % 2 === 0 );

        // Get a random, initial scale
        var initialScale = this.genCloudNodeScale();

        // Construct the cloud
        var newCloudNode = this.createCloudNode( initialCenterX, initialTopY, initialScale );
        this.cloudContainerNode.addChild( newCloudNode );

        // Set these for the next iteration
        posOnLeftCounter += 1;
        lastBotY = newCloudNode.getBottom();

      }

    },

    /**
     * Reset the moving background (places clouds at initial position)
     */
    reset: function() {

      this.cloudContainerNode.children.forEach( function( cloudNode ) {
        cloudNode.reset();
      } );

    }

  } );

} );