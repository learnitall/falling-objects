// Copyright 2018, University of Colorado Boulder

/**
 * Model for a falling object. Includes properties and methods for tracking the
 * item's fall (velocity, acceleration, drag) and characteristics (mass,
 * reference area).
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for FallingObject
   *
   * @param {FallingObjectsModel} FallingObjectsModel - used to pull environmental values
   * @param {string} fallingObjectName - the name of the FallingObject to create (should be from string! plugin, see FallingObjectsConstants)
   * @param {Vector2} initialAltitude - initial altitude of the object (give -1 for infinite falling)
   */
  function FallingObject( FallingObjectsModel, fallingObjectName, initialAltitude ) {

    // Construct options dictionary from the named entry in FallingObjectsConstants, overriding values using the given options param
    var objectAttributes = FallingObjectsConstants[ FallingObjectsConstants.stringToConstantsName( fallingObjectName ) ];

    // @public
    this.FallingObjectsModel = FallingObjectsModel;
    this.name = fallingObjectName;
    this.mass = objectAttributes.mass;
    this.dragCoefficient = objectAttributes.dragCoefficient;
    this.initialAltitude = initialAltitude;

    // @public {Property.<Vector2>} - the position of the FallingObject
    this.positionProperty = new Property( this.initialAltitude );

    // @public {Property.<number>} reference area of the projectile
    this.referenceArea = new NumberProperty( objectAttributes.referenceArea );

    // @public {Property.<number>} velocity of the projectile
    this.velocityProperty = new NumberProperty( 0 );  // m/s

    // @public {Property.<number>} acceleration of the projectile
    this.accelerationProperty = new NumberProperty( 0 );  // m/s^2

    // @public {Property.<number>} weight of the projectile (changes in correspondence to changes in altitude)
    this.weightForceProperty = new NumberProperty( 0 );  // newtons

    // @public {Property.<number>} total drag force acting on the projectile
    this.dragForceProperty = new NumberProperty( 0 );  // newtons

    // @public {Property.<number>} total net force acting on the projectile
    this.netForceProperty = new NumberProperty( 0 );  // newtons

  }

  fallingObjects.register( 'FallingObject', FallingObject );

  return inherit( Object, FallingObject, {

    /**
     * Set the name of the FallingObject that should be simulated
     * @public
     *
     * @param {string} fallingObjectName - From the string! plugin, see FallingObjectsConstants
     */
    resetName: function( fallingObjectName ) {
      // Construct a new FallingObject instance with the given name and return it
      return new FallingObject( this.FallingObjectsModel, fallingObjectName, this.initialAltitude );
    },

    /**
     * Calculate weight of the object in Newtons and set the weightForceProperty to the calculated value.
     * @public
     */
    updateWeightForce: function() {
      this.weightForceProperty.set( this.FallingObjectsModel.accelerationGravityProperty.get() * this.mass );
    },

    /**
     * Calculate drag force acting on the object in Newtons and set the dragForceProperty to the calculated value.
     * @public
     */
    updateDragForce: function() {
      this.dragForceProperty.set(
        0.5 * ( this.dragCoefficient * this.FallingObjectsModel.airDensityProperty.get() * Math.pow( this.velocityProperty.get(), 2 ) * this.referenceAreaProperty.get() )
      );
    },

    /**
     * Calculate net force acting on the object in Newtons and set the netForceProperty to the calculated value.
     * weightForceProperty and dragForceProperty (if drag has been toggled) will be updated prior to calculation.
     * @public
     */
    updateNetForce: function() {
      // Update weight, as Ag could change
      this.updateWeightForce();

      // Set net force using drag if toggled
      var newNetForce;
      if ( this.FallingObjectsModel.dragForceEnabledProperty.get() ) {
        this.updateDragForce();
        newNetForce = this.weightForceProperty.get() - this.dragForceProperty.get();
      }
      // or without if drag is not toggled
      else {
        newNetForce = this.weightForceProperty.get();
      }

      this.netForceProperty.set( newNetForce );
    },

    /**
     * Calculate acceleration acting on the object in m/s^2 and set the accelerationProperty to the calculated value.
     * This method will call updateNetForce() prior to calculating anything, therefore updating all force properties.
     * @public
     */
    updateAcceleration: function() {
      // Update value that will be use to calculate acceleration
      this.updateNetForce();

      this.accelerationProperty.set( this.netForceProperty.get() / this.mass );
    },

    /**
     * Calculate velocity in m/s when given a change in time and set the velocityProperty to the calculated value.
     * This method will call updateAcceleration() prior to calculation, therefore updating all force and
     * acceleration properties.
     * @public
     *
     * @param {number} dt - delta time
     */
    updateVelocity: function( dt ) {
      // Update value that will be used to calculate velocity
      this.updateAcceleration();

      this.velocityProperty.set( this.velocityProperty.get() + ( this.accelerationProperty.get() * dt ) );
    },

    /**
     * Calculate position in m when given a change in time and set the positionProperty to the calculated value.
     * This method will call updateVelocity prior to calculation, therefore updating the velocity, acceleration and
     * force properties.
     * @public
     *
     * @param {number} dt - delta time
     */
    updatePosition: function( dt ) {
      // Update value that will be used to calculate position
      this.updateVelocity( dt );

      // The property is set to a new vector- modifying the positionProperty vector will also modify the internal
      // _initialValue vector (they are a reference to one another)
      var newPositionVector = new Vector2( 0, this.positionProperty.get().y + ( this.velocityProperty.get() * dt ) );
      this.positionProperty.set( newPositionVector );
    },

    /**
     * Reset properties
     * @public
     * @override
     */
    reset: function() {
      this.positionProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.weightForceProperty.reset();
      this.dragForceProperty.reset();
      this.netForceProperty.reset();
    },

    /**
    * Step the object in time by re-calculating properties given a change in time.
    * @public
    *
    * @param {number} dt - delta time
    */
    step: function( dt ) {
      // Updating the position will update all other calculated properties
      this.updatePosition( dt );
    }

  } );

} );
