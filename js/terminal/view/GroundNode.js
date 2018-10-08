// Copyright 2018, University of Colorado Boulder

/**
 * Ground node that gets put in front of the MovingBackground. Used as a way to
 * show that the falling object has approached or hit position 0.
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * Construct the ground
   *
   * @param {FallingObjectsModel} fallingObjectsModel - used to pull the altitude of the selected falling object
   */
  function GroundNode( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'GroundNode', GroundNode );

  return inherit( Node, GroundNode );

} );