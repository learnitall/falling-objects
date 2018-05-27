// Copyright 2018, University of Colorado Boulder

/**
 * Model for Falling Objects. Holds environmental properties and constructs/manages other models.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var FallingObject = require( 'FALLING_OBJECTS/common/model/FallingObject' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var badmintonShuttlecockString = require( 'string!FALLING_OBJECTS/badminton_shuttlecock' );
  var baseballString = require( 'string!FALLING_OBJECTS/baseball' );
  var bowlingBallString = require( 'string!FALLING_OBJECTS/bowling_ball' );
  var footballString = require( 'string!FALLING_OBJECTS/football' );
  var golfBallString = require( 'string!FALLING_OBJECTS/golf_ball' );
  var modelRocketString = require( 'string!FALLING_OBJECTS/model_rocket' );
  var pingPongBallString = require( 'string!FALLING_OBJECTS/ping_pong_ball' );
  var sportsCarString = require( 'string!FALLING_OBJECTS/sports_car' );

  /**
   * Construct the FallingObjectsModel
   *
   * @constructor
   */
  function FallingObjectsModel() {

    // Variables defined here for convenience
    var accelerationGravitySeaLevel = FallingObjectsConstants.ACCELERATION_GRAVITY_SEA_LEVEL;
    var earthMeanRadius = FallingObjectsConstants.EARTH_MEAN_RADIUS;

    // TODO: Determine the appropriate initial values for these properties

    // @public {Property.<number>} simulation's acceleration due to gravity
    // TODO: Add a slider to control this value
    this.accelerationGravityProperty = new NumberProperty( accelerationGravitySeaLevel );

    // @public {Property.<boolean>} whether or not gravitational acceleration will vary based off of altitude
    // TODO: Add functionality for when this is enabled and disabled
    this.variableAccelerationGravityProperty = new Property( false );

    // @public {Property.<number>} air density at the selected FallingObject's position
    // TODO: Add control over whether or not this gets calculated as altitude changes
    this.airDensityProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>} whether or not drag force will affect the FallingObject's fall
    // TODO: Add control over this variable
    this.dragForceEnabledProperty = new Property( false );

    /**
     * Calculate the air density in kg/m^3 at the given altitude and return it. Uses a standard Earth
     * Atmosphere Model from the 60s
     * @public
     *
     * @param {number} altitude - altitude in meters to calculate the air density at
     * @returns {number} - air density at the given altitude
     */
    this.calculateAirDensity = function( altitude ) {

      // Three different methods for calculating temperature and pressure, depending on altitude
      var temperature;
      var pressure;

      // Troposphere
      if ( altitude <= 11000 ) {
        temperature = 15.04 - ( 0.00649 * altitude );
        pressure = 101.29 * Math.pow( ( ( temperature + 273.1 ) / 288.08 ), 5.256 );
      }
      // Lower Stratosphere ( 11000 < altitude <= 25000 )
      else if ( altitude <= 25000 ) {
        temperature = -56.46;
        pressure = 22.65 * Math.pow( Math.E, ( 1.73 - ( 0.000157 * altitude ) ) );
      }
      // Upper Stratosphere ( altitude > 25000 )
      else {
        temperature = -131.21 + ( 0.00299 * altitude );
        pressure = 2.488 * Math.pow( ( ( temperature + 273.1 ) / 216.6 ), -11.388 );
      }

      // Now calculate air density using the Equation of State
      return pressure / ( 0.2869 * ( temperature + 273.1 ) );

    };

    /**
     * Calculate the gravitational acceleration in m/s^2 at the given altitude and return it.
     * @public
     *
     * @param {number} altitude - altitude in meters to calculate the gravitational acceleration at
     * @returns {number} - gravitational acceleration at the given altitude
     */
    this.calculateAccelerationGravity = function( altitude ) {

      // This calculation is done in the same fashion as calculating the Doppler Effect on a wave- scalar applied to a base value
      var ratio = Math.pow( ( earthMeanRadius / ( earthMeanRadius + altitude ) ), 2 );

      return accelerationGravitySeaLevel * ratio;

    };

    // Construct a list of falling object names
    var selectedFallingObjectIndex = 3;  // Placeholder value, see the below TODO
    var fallingObjectNames = [
      badmintonShuttlecockString,
      baseballString,
      bowlingBallString,
      footballString,
      golfBallString,
      modelRocketString,
      pingPongBallString,
      sportsCarString
    ];

    // TODO: Create a combo box to choose
    // Construct an object to fall
    this.selectedFallingObject = new FallingObject( this, fallingObjectNames[ selectedFallingObjectIndex ], new Vector2( 0, 0 ) );

  }

  fallingObjects.register( 'FallingObjectsModel', FallingObjectsModel );

  return inherit( Object, FallingObjectsModel, {

    // TODO: These two methods below have the same structure- anyway to condense?

    /**
     * Calculate the air density in kg/m^3 at the selectedFallingObject's position and set the airDensityProperty
     * to the calculated value.
     * @public
     */
    updateAirDensity: function() {
      // y value of positionProperty is altitude
      var newAirDensity = this.calculateAirDensity( Math.abs( this.selectedFallingObject.positionProperty.get().y ) );
      this.airDensityProperty.set( newAirDensity );
    },

    /**
     * Calculate the acceleration due to gravity in m/s^2 at the selectedFallingObject's position and set the
     * accelerationGravityProperty to the calculated value.
     * @public
     */
    updateAccelerationGravity: function() {
      // y value of positionProperty is altitude
      var newAccelerationGravity = this.calculateAccelerationGravity( Math.abs( this.selectedFallingObject.positionProperty.get().y ) );
      this.accelerationGravityProperty.set( newAccelerationGravity );
    },

    /**
     * Reset the model
     * @public
     * @override
     */
    reset: function() {
      // Reset properties
      this.accelerationGravityProperty.reset();
      this.airDensityProperty.reset();
      this.dragForceEnabledProperty.reset();

      // Reset FallingObject
      this.selectedFallingObject.reset();
    },

    /**
     * Step the model to perform the simulation's animation
     * @public
     */
    step: function( dt ) {
    }

  } );

} );