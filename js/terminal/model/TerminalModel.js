// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Terminal' screen
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsModel = require( 'FALLING_OBJECTS/common/model/FallingObjectsModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Construct the TerminalModel
   * @constructor
   */
  function TerminalModel() {

    // Call our parent, passing in that we don't want a constant altitude and we want drag
    // to always be enabled
    FallingObjectsModel.call(
      this,
      {
        constantAltitude: false,
        initialDragForceEnabledValue: true,
        disableOnGroundZero: true,
        enableParachute: true,
        initialAltitude: 10  // m
      }
    );

  }

  fallingObjects.register( 'TerminalModel', TerminalModel );

  return inherit( FallingObjectsModel, TerminalModel );

} );