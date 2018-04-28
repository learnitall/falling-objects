// Copyright 2018, University of Colorado Boulder

/**
 * Global constants for the entire sim that define environmental and object parameters.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );

  var FallingObjectsConstants = {

    // Define FallingObject parameters
    BOWLING_BALL: {
      'mass': 7.25,  // in kg, equal to 16 lbs
      'referenceArea':  1.47,  // in m^2, equal to a bowling ball with 8.595" diameter
      'dragCoefficient': 0.5
    },

    BADMINTON_SHUTTLECOCK: {
      'mass': 0.00515,  // in kg
      'referenceArea': 0.0033, // in m^2,
      'dragCoefficient': 0.61
    },

    GOLF_BALL: {
      'mass': 0.045,  // in kg
      'referenceArea': 0.00143,  // in m^2
      'dragCoefficient': 0.3
    },

    PING_PONG_BALL: {
      'mass': 0.0027,  // in kg
      'referenceArea': 0.0013,  // in m^2
      'dragCoefficient': 0.5
    },

    BASEBALL: {
      'mass': 0.14,  // in kg
      'referenceArea': 0.042,  // in m^2
      'dragCoefficient': 0.3,
    },

    FOOTBALL: {
      'mass': 0.411,  // in kg
      'referenceArea': 0.0229,  // in m^2
      'dragCoefficient': 0.055
    },

    MODEL_ROCKET: {
      'mass': 0.0402,  // in kg
      'referenceArea': 0.00049,  // in m^2
      'dragCoefficient': 0.75
    },

    TESLA_MODEL_S: {
      'mass': 2170,  // in kg
      'referenceArea': 2.34,  // in m^2
      'dragCoefficient': 0.24
    },

  };

  fallingObjects.register( 'FallingObjectsConstants', FallingObjectsConstants );

  return FallingObjectsConstants;

} );
