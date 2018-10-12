// Copyright 2018, University of Colorado Boulder

/**
 * Platform in the background that falling objects fall onto (i.e. simulates the ground or
 * position).
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
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
   * Construct the platform.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object's position
   * @param {TerminalScreenView} terminalScreenView - will be used to pull FallingObjectNode
   * @param {number} maxWidth - maxWidth of the platform
   * @param {number} maxHeight - maxHeight of the platform
   */
  function PlatformNode( fallingObjectsModel, terminalScreenView, maxWidth, maxHeight ) {

    // Call the super
    Node.call( this );
    var self = this;

    // Grab this for use later on
    this.terminalScreenView = terminalScreenView

    // Platform is comprised of two rockets on each side of a rectangle

    // Create two rocket images and scale so their height matches the maxHeight
    var rocketNodeLeft = new Image( rocketImage );
    var rocketNodeRight = new Image( rocketImage );
    // Scale the rocket nodes
    var rocketScale = maxHeight / rocketNodeLeft.height;
    rocketNodeLeft.setScaleMagnitude( rocketScale );
    rocketNodeRight.setScaleMagnitude( rocketScale );

    // Create the rectangle that acts as the actual platform
    var platformHeight = rocketNodeLeft.height * 0.15;
    var platformRectNode = new Rectangle(
      0,
      0,
      maxWidth,
      platformHeight,
      { fill: 'black' }
    );

    // Position our Nodes
    // Put the rockets on either side of the platform
    rocketNodeLeft.setCenterX( platformRectNode.getLeft() );
    rocketNodeLeft.setCenterY( platformRectNode.getCenterY() );
    rocketNodeRight.setCenterX( platformRectNode.getRight() );
    rocketNodeRight.setCenterY( platformRectNode.getCenterY() );

    // Create links to have the platform move as altitude changes
    // Use model view transform to determine where 'zero' is (relative to center of platform)
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping(
      // Just fill with dumb origin as can't determine until falling object node is layed out
      // scale set to modelViewTransform scale in screen view
      new Vector2( 0, 0 ), this.terminalScreenView.modelViewTransform.matrix.m00()  // m00 stores xscale, which will be same as yscale in this case
    );

    // Create a link to update modelViewTransform origin to be the bottom of the falling object node
    fallingObjectsModel.selectedFallingObjectNameProperty.lazyLink( function( selectedFallingObjectName ) {
      // Set the new y offset- x offset stays constant
      self.modelViewTransform.matrix.set12( self.terminalScreenView.fallingObjectNode.getBottom() );
      // Move the platform
      self.setCenterY( self.modelViewTransform.modelToViewY( 0 ) );
    } );

    // Create links to update the position of the platform when either the
    // initial altitude changes, or the object's position changes

    // Altitude will only change if the simulation is paused, so we don't need to take into account model
    // position of the falling object
    fallingObjectsModel.selectedFallingObject.initialAltitudeProperty.lazyLink( function( initialAltitude ) {

      // If the platform node is beyond the bounds of the visible screen, then don't need to update
      var newY = self.modelViewTransform.modelToViewY( initialAltitude );
      if ( self.getTop() <= self.terminalScreenView.visibleBoundsProperty.get().maxY ||
           newY <= self.terminalScreenView.visibleBoundsProperty.get().maxY ) {
        self.setCenterY( newY );
      }

    } );

    fallingObjectsModel.selectedFallingObject.positionProperty.lazyLink( function( position ) {

      var newY = self.modelViewTransform.modelToViewY( Math.abs( position.y ) );
      if ( self.getTop() <= self.terminalScreenView.visibleBoundsProperty.get().maxY ||
           newY <= self.terminalScreenView.visibleBoundsProperty.get().maxY ) {
        self.setCenterY( newY );
      }

    } );

    this.addChild( platformRectNode );
    this.addChild( rocketNodeLeft );
    this.addChild( rocketNodeRight );

  }

  fallingObjects.register( 'PlatformNode', PlatformNode );

  return inherit( Node, PlatformNode, {

    /**
     * Layout the platform node
     */
    layout: function() {

      // Set the x and y offset of the modelViewTransform
      this.modelViewTransform.matrix.set02( this.terminalScreenView.fallingObjectNode.getCenterX() );
      this.modelViewTransform.matrix.set12( this.terminalScreenView.fallingObjectNode.getBottom() );

      // Set Center
      this.setCenter( this.modelViewTransform.modelToViewXY( 0, 0 ) );

    }

  } );

} );