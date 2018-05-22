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
      'dragCoefficient': 0.5,
      'diameter': 0.218 // in m
    },

    BADMINTON_SHUTTLECOCK: {
      'mass': 0.00515,  // in kg
      'referenceArea': 0.0033, // in m^2,
      'dragCoefficient': 0.61,
      'diameter': [ 0.064, 0.083 ]  // skirt length in m (view width), total length in m (view height)
    },

    GOLF_BALL: {
      'mass': 0.045,  // in kg
      'referenceArea': 0.00143,  // in m^2
      'dragCoefficient': 0.3,
      'diameter': 0.043  // in m
    },

    PING_PONG_BALL: {
      'mass': 0.0027,  // in kg
      'referenceArea': 0.0013,  // in m^2
      'dragCoefficient': 0.5,
      'diameter': 0.04  // in m
    },

    BASEBALL: {
      'mass': 0.14,  // in kg
      'referenceArea': 0.042,  // in m^2
      'dragCoefficient': 0.3,
      'diameter': 0.23  // in m
    },

    FOOTBALL: {
      'mass': 0.411,  // in kg
      'referenceArea': 0.023,  // in m^2
      'dragCoefficient': 0.055,
      'diameter': [ 0.171, 0.228 ]  // short diameter in m (width), long diameter in m (view height)
    },

    MODEL_ROCKET: {
      'mass': 0.0402,  // in kg
      'referenceArea': 0.00049,  // in m^2
      'dragCoefficient': 0.75,
      'diameter': [ 0.113, 0.345 ]  // width with fins on in m, height with fins on in m
    },

    ELECTRIC_CAR: {
      'mass': 2170,  // in kg
      'referenceArea': 2.34,  // in m^2
      'dragCoefficient': 0.24,
      'diameter': [ 2.189, 4.978 ]  // width of car in m, length of car in m (view height)
    },

  };

  fallingObjects.register( 'FallingObjectsConstants', FallingObjectsConstants );

  return FallingObjectsConstants;

} );
