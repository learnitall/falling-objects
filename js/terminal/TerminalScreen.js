// Copyright 2018, University of Colorado Boulder

/**
 * The 'Terminal' screen, that allows users to explore the concept of Terminal Velocity by seeing how drag force
 * and time are interrelated
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TerminalModel = require( 'FALLING_OBJECTS/terminal/model/TerminalModel' );
  var TerminalScreenView = require( 'FALLING_OBJECTS/terminal/view/TerminalScreenView' );

  // string
  var screenTerminalString = require( 'string!FALLING_OBJECTS/screen.terminal' );

  /**
   * @constructor
   */
  function TerminalScreen() {

    var options = {
      name: screenTerminalString,
      backgroundColorProperty: new Property( 'white' )
      // TODO: Add a homeScreenIcon
    };

    Screen.call( this,
      function() { return new TerminalModel(); },
      function( model ) { return new TerminalScreenView( model ); },
      options
    );
  }

  fallingObjects.register( 'TerminalScreen', TerminalScreen );

  return inherit( Screen, TerminalScreen );
} );