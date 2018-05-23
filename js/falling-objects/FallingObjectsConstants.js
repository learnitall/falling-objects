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

    /**
     * Convert the name of a falling object (retrieved with the string! plugin) to the falling object's keyname in this constants dictionary
     * @public
     *
     * @param {String} fallingObjectString - Name of the falling object from the string! plugin
     * @returns {String}
     */
    stringToConstantsName: function( fallingObjectString ) {
      // Need to convert to all caps, replace spaces with underscores, and remove leading and trailing whitespace characters
      return fallingObjectString.toUpperCase().replace( / /g, '_' ).replace( String.fromCharCode( 8234 ), '' ).replace( String.fromCharCode( 8236 ), '' );
    },

    MODEL_VIEW_TRANSFORM_SCALE: 900,  // scalar between model coordinates and view coordinates

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

    SPORTS_CAR: {
      'mass': 283.63,  // in kg
      'referenceArea': 2.04,  // in m^2
      'dragCoefficient': 0.32,
      'diameter': [ 1.82, 4.37 ]  // width of car in m, length of car in m (view height)
    },

    // TODO: Define initial values for a ball that has its attributes change with a slider
    DYNAMIC_BALL: {

    }

  };

  fallingObjects.register( 'FallingObjectsConstants', FallingObjectsConstants );

  return FallingObjectsConstants;

} );
