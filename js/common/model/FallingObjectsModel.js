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
  var sportsCarString = require( 'string!FALLING_OBJECTS/sportsCar' );

  /**
   * Construct the FallingObjectsModel
   *
   * @param {boolean} constantAltitude - if false, air density and accel. gravity will be calculated based on the FallingObject's altitude
   * @constructor
   */
  function FallingObjectsModel( constantAltitude ) {

    // @private (read-only)
    this.constantAltitude = constantAltitude;

    // Variables defined here for convenience
    var self = this;
    this.accelerationGravitySeaLevel = FallingObjectsConstants.ACCELERATION_GRAVITY_SEA_LEVEL;
    this.earthMeanRadius = FallingObjectsConstants.EARTH_MEAN_RADIUS;
    var defaultFallingObjectName = FallingObjectsConstants.DEFAULT_FALLING_OBJECT_NAME;

    // @public {Property.<boolean>} whether or not the simulation is paused
    this.playEnabledProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} whether or not to display data values on the screen (object properties, force values, etc.)
    this.showValuesProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} whether or not to display the free body diagram
    this.showFreeBodyDiagramProperty = new BooleanProperty( true );

    // TODO: Determine the appropriate initial values for these properties

    // @public {Property.<number>} simulation's acceleration due to gravity
    // TODO: Add a slider to control this value
    this.accelerationGravityProperty = new NumberProperty( this.accelerationGravitySeaLevel );

    // @public {Property.<number>} air density at the selected FallingObject's position
    // TODO: Add control over whether or not this gets calculated as altitude changes
    this.airDensityProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>} whether or not drag force will affect the FallingObject's fall
    // TODO: Add control over this variable
    this.dragForceEnabledProperty = new BooleanProperty( false );

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
      sportsCarString
    ];

    // Construct an object to fall
    this.selectedFallingObject = new FallingObject( this, this.selectedFallingObjectNameProperty.get(), new Vector2( 0, 0 ) );

    // When the selected name is updated, then have the FallingObject instance update too
    this.selectedFallingObjectNameProperty.lazyLink( function ( selectedFallingObjectName ) {
      self.selectedFallingObject.resetName( selectedFallingObjectName );
    } );
  }

  fallingObjects.register( 'FallingObjectsModel', FallingObjectsModel );

  return inherit( Object, FallingObjectsModel, {

    /**
     * Calculate the air density in kg/m^3 at the selectedFallingObject's position and set the airDensityProperty
     * to the calculated value. Uses a standard Earth Atmospheric Model from the '60s.
     * @public
     */
    updateAirDensity: function() {
      // Three different methods for calculating temperature and pressure, depending on altitude
      var altitude = Math.abs( this.selectedFallingObject.positionProperty.get().y ); // absolute y value is altitude
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
      this.airDensityProperty.set( pressure / ( 0.2869 * ( temperature + 273.1 ) ) );
    },

    /**
     * Calculate the acceleration due to gravity in m/s^2 at the selectedFallingObject's position and set the
     * accelerationGravityProperty to the calculated value.
     * @public
     */
    updateAccelerationGravity: function() {
      var altitude = Math.abs( this.selectedFallingObject.positionProperty.get().y );

      // This calculation is done in the same fashion as calculating the Doppler Effect on a wave- scalar applied to a base value
      var ratio = Math.pow( ( this.earthMeanRadius / ( this.earthMeanRadius + altitude ) ), 2 );
      this.accelerationGravityProperty.set( this.accelerationGravitySeaLevel * ratio );
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
     * Step the model to perform the simulation's animation and physics calculations.
     * Called to perform a manual step or called within the overwritten step function found below.
     * @public
     */
    stepModel: function( dt ) {
      // If altitude is not to remain constant (i.e. the fall is not infinite) then first update gravity and air density
      if ( !this.constantAltitude ) {
        this.updateAirDensity();
        this.updateAccelerationGravity();
      }

      // Now just step the selectedFallingObject
      this.selectedFallingObject.step( dt );
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