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
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the background. Most of the work done here is to create a skeleton that will
   * be filled in and sized in the 'layout' function.
   */
  function MovingBackground( ) {

    // Call the super
    Node.call( this );

    // Create a rectangular sky
    this.sky = new Rectangle( 0, 0, 0, 0 );  // don't know screen dimensions yet, so sizing for later

    this.addChild( this.sky );

  }

  fallingObjects.register( 'MovingBackground', MovingBackground );

  return inherit( Node, MovingBackground, {

    /**
     * Calculates and sets the sky's fill to the appropriate gradient based on the selected falling
     * object's altitude. The sky's dimensions should be set prior to calling this method.
     * TODO: Will be linked to altitude at a later date, for now this is constant
     */
    updateSkyGradient: function( ) {

      // Just set to a constant gradient for now
      // Use the height of the sky node rectangle to determine the height of the linear gradient
      this.sky.setFill( new LinearGradient( 0, 0, 0, this.sky.height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' ) );

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
      this.sky.setRect( 0, 0, width / scale, height / scale );
      this.sky.center = center
      // And now set the sky's color
      // TODO: Move this to a property link on altitude
      this.updateSkyGradient();

    }

  } );

} );