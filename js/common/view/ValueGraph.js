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

  /**
   * Construct the value graph
   *
   * @param {NumberProperty} valueProperty - value to graph with time
   */
  function ValueGraph( valueProperty ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'ValueGraph', ValueGraph );

  return inherit( Node, ValueGraph );

} );