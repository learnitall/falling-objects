// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the 'Terminal' screen
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsScreenView = require( 'FALLING_OBJECTS/common/view/FallingObjectsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Construct the screenView
   *
   * @param {FallingObjectsModel} fallingObjectsModel
   */
  function TerminalScreenView( fallingObjectsModel ) {

    // Call the screenView, passing in our given model
    FallingObjectsScreenView.call( this, fallingObjectsModel );

  }

  fallingObjects.register( 'TerminalScreenView', TerminalScreenView );

  return inherit( FallingObjectsScreenView, TerminalScreenView );

} );