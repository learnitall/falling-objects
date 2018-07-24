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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Construct the value graph
   *
   * @param {string} name - name of the graph
   * @param {NumberProperty} valueProperty - value to graph with time
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {height} maxHeight - max height of the free body diagram panel
   */
  function ValueGraph( name, valueProperty, maxWidth, maxHeight ) {

    // Call the super
    Node.call( this );

  }

  function PVAGraphs( ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );