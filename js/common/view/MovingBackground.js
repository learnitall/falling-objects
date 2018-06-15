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
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * Construct the background. Most of the work done here is to create a skeleton that will
   * be filled in and sized in the 'layout' function.
   */
  function MovingBackground( ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'MovingBackground', MovingBackground );

  return inherit( Node, MovingBackground );

} );