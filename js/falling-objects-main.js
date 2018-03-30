// Copyright 2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var FallingObjectsScreen = require( 'FALLING_OBJECTS/falling-objects/FallingObjectsScreen' );

  // strings
  var fallingObjectsTitleString = require( 'string!FALLING_OBJECTS/falling-objects.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( fallingObjectsTitleString, [ new FallingObjectsScreen() ], simOptions );
    sim.start();
  } );
} );