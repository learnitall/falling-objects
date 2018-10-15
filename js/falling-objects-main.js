// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScreen = require( 'FALLING_OBJECTS/basics/BasicsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var TerminalScreen = require( 'FALLING_OBJECTS/terminal/TerminalScreen' );

  // strings
  var fallingObjectsTitleString = require( 'string!FALLING_OBJECTS/falling-objects.title' );

  var simOptions = {
    credits: {
      leadDesign: '',
      softwareDevelopment: 'Ryan Drew',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: 'The RV Physics Team (Mr.Pennell, Mr.Lowrey and Mr.Bradley), friends and family, and the PhET team for making this possible.'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( fallingObjectsTitleString, [
      new BasicsScreen(),
      new TerminalScreen()
    ], simOptions );
    sim.start();
  } );
} );