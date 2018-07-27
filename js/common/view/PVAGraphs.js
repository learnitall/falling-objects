// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ValueGraphNode = require( 'FALLING_OBJECTS/common/view/ValueGraphNode' );

  /**
   * Construct the graphs for Position, Velocity and Acceleration by implementing ValueGraph
   *
   * @param {FallingObjectsModel} fallingObjectsModel
   */
  function PVAGraphs( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );