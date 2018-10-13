// Copyright 2018, University of Colorado Boulder

/**
 * Model for Falling Objects. Holds environmental properties and constructs/manages other models.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var FallingObject = require( 'FALLING_OBJECTS/common/model/FallingObject' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var badmintonShuttlecockString = require( 'string!FALLING_OBJECTS/badmintonShuttlecock' );
  var baseballString = require( 'string!FALLING_OBJECTS/baseball' );
  var bowlingBallString = require( 'string!FALLING_OBJECTS/bowlingBall' );
  var footballString = require( 'string!FALLING_OBJECTS/football' );
  var golfBallString = require( 'string!FALLING_OBJECTS/golfBall' );
  var modelRocketString = require( 'string!FALLING_OBJECTS/modelRocket' );
  var pingPongBallString = require( 'string!FALLING_OBJECTS/pingPongBall' );
  var scaleSportsCarString = require( 'string!FALLING_OBJECTS/scaleSportsCar' );

  /**
   * Construct the FallingObjectsModel
   *
   * @param {Object} options
   * @constructor
   */
  function FallingObjectsModel( options ) {

    // Add in defaults for options in case all is not given
    options = _.extend( {
      constantAltitude: true,  // if false, then air density and accel. gravity will be calculated based on the FallingObject's altitude
      initialDragForceEnabledValue: false,  // Sets the initial value for dragForceEnabledProperty
      disableOnGroundZero: false,  // Disable the simulation (requiring a reset) when the object hits the ground
      enableParachute: false  // Enable the parachute functionality by created the parachuteDeployedProperty
    }, options );

    // @private (read-only)
    this.constantAltitude = options.constantAltitude;
    this.disableOnGroundZero = options.disableOnGroundZero;
    this.enableParachute = options.enableParachute;

    // Variables defined here for convenience
    var self = this;
    this.accelerationGravitySeaLevel = FallingObjectsConstants.ACCELERATION_GRAVITY_SEA_LEVEL;
    this.earthMeanRadius = FallingObjectsConstants.EARTH_MEAN_RADIUS;
    var defaultFallingObjectName = FallingObjectsConstants.DEFAULT_FALLING_OBJECT_NAME;

    // @public {Property.<boolean>} whether or not the simulation is paused
    this.playEnabledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} whether or not the simulation is disabled
    this.simEnabledProperty = new BooleanProperty( true );

    // @public {Property.<boolean>} whether or not to display data values on the screen (object properties, force values, etc.)
    this.showValuesProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} whether or not to display the free body diagram
    this.showFreeBodyDiagramProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} whether or not to display the PVA graphs
    this.showPVAGraphsProperty = new BooleanProperty( false );

    if ( options.enableParachute ) {
      // @public {Property.<boolean>} whether or not the parachute is deployed (only shown on certain screens)
      this.parachuteDeployedProperty = new BooleanProperty( false );
    }

    // @public {Property.<number>} simulation's acceleration due to gravity (initially set to density at sea level)
    this.accelerationGravityProperty = new NumberProperty( this.getAccelerationGravity( 0 ) );

    // @public {Property.<number>} air density at the selected FallingObject's position (initially set to density at sea level)
    this.airDensityProperty = new NumberProperty( this.getAirDensity( 0 ) );

    // @public {Property.<boolean>} whether or not drag force will affect the FallingObject's fall
    this.dragForceEnabledProperty = new BooleanProperty( options.initialDragForceEnabledValue );

    // @public {Property.<number>} holds total amount of time in seconds that an object has been in free fall
    this.totalFallTimeProperty = new NumberProperty( 0 );

    // @public {Property.<string>} the name of the currently selected FallingObject (from string! plugin)
    this.selectedFallingObjectNameProperty = new Property( defaultFallingObjectName );

    // Construct a list of falling object names
    this.fallingObjectNames = [
      badmintonShuttlecockString,
      baseballString,
      bowlingBallString,
      footballString,
      golfBallString,
      modelRocketString,
      pingPongBallString,
      scaleSportsCarString
    ];

    // Construct an object to fall
    this.selectedFallingObject = new FallingObject( this, this.selectedFallingObjectNameProperty.get(), 0 );

    // When the selected name is updated, then have the FallingObject instance update too and call a reset
    this.selectedFallingObjectNameProperty.lazyLink( function ( selectedFallingObjectName ) {
      self.selectedFallingObject.resetName( selectedFallingObjectName );
      self.reset();
    } );

    // When the sim is disabled, stop the sim
    this.simEnabledProperty.link( function( simEnabledValue ) {
      self.playEnabledProperty.set( false );
    } );
  }

  fallingObjects.register( 'FallingObjectsModel', FallingObjectsModel );

  return inherit( Object, FallingObjectsModel, {

    /**
     * Rounds the given value to the given number of digits. Provided as a convenience.
     * @public
     *
     * @param {number} valueToRound
     * @param {number} numDigits
     */
    roundValue: function( valueToRound, numDigits ) {
      // Multiply by 10 * numDigits so all of the wanted digits are to the left of the decimal, then cast
      // to an int and divide by numDigits
      return parseInt( valueToRound * Math.pow( 10, numDigits ), 10 ) / Math.pow( 10, numDigits );
    },

    /**
     * Calculate the air density in kg/m^3 at the given altitude and return it.
     * Uses a standard Earth Atmospheric Model from the '60s.
     * @public
     *
     * @param {number} altitude - altitude to calculate air density at (i.e. selectedFallingObject's position property)
     **/
    getAirDensity: function( altitude ) {
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
    },

    /**
     * Calculate the acceleration due to gravity in m/s^2 at the given altitude and return it
     * @public
     *
     * @param {number} altitude - altitude to calculate the acceleration due to gravity at (i.e. selectedFallingObject's position property)
     */
    getAccelerationGravity: function( altitude ) {
      // This calculation is done in the same fashion as calculating the Doppler Effect on a wave- scalar applied to a base value
      var ratio = Math.pow( ( this.earthMeanRadius / ( this.earthMeanRadius + altitude ) ), 2 );
      return this.accelerationGravitySeaLevel * ratio;
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
      this.totalFallTimeProperty.reset();
      this.playEnabledProperty.reset();
      this.simEnabledProperty.reset();
      this.parachuteDeployedProperty.reset();

      // Reset FallingObject
      this.selectedFallingObject.reset();
    },

    /**
     * Step the model to perform the simulation's animation and physics calculations.
     * Called to perform a manual step or called within the overwritten step function found below.
     * @public
     */
    stepModel: function( dt ) {
      // If altitude is not to remain constant (i.e. the fall is not infinite) then first update gravity and air density
      if ( !this.constantAltitude ) {
        var altitude = Math.abs( this.selectedFallingObject.positionProperty.get().y ); // absolute y value is altitude
        this.airDensityProperty.set( this.getAirDensity( altitude ) );
        this.accelerationGravityProperty.set( this.getAccelerationGravity( altitude ) );
      }

      // Now just step the selectedFallingObject
      this.selectedFallingObject.step( dt );

      // Check if we need to disable
      if ( this.disableOnGroundZero ) {  // Only disable if that feature has been enabled (depending on the screen)

        // Check if we are at the ground
        if ( this.selectedFallingObject.positionProperty.get().y <= 0 ) {

          // If our previous step set the position past zero, then make sure we manually set it back to zero
          if ( this.selectedFallingObject.positionProperty.get().y < 0 ) {
            this.selectedFallingObject.positionProperty.set(
              new Vector2( this.selectedFallingObject.positionProperty.get().x, 0 )
            );
          }

          // And disable the sim
          this.simEnabledProperty.set( false );
        }
      }

      // And increment the timer
      this.totalFallTimeProperty.set( this.totalFallTimeProperty.get() + dt );
    },

    /**
     * If the simulation is not paused, step the simulation.
     * @public
     */
    step: function( dt ) {
      if ( this.playEnabledProperty.get() ) {
        this.stepModel( dt );
      }
    }

  } );

} );