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
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // images
  var rocketImage = require( 'image!FALLING_OBJECTS/rocket.svg' );

  /**
   * Construct the platform.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object's position
   */
  function PlatformNode( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'PlatformNode', PlatformNode );

  return inherit( Node, PlatformNode );

} );