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
  var fallingObjects = require( 'FALLING_OBJECTS/FallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * Constructor for FallingObject
   *
   * @param {FallingObjectsModel} fallingObjectsModel - used to pull environmental constants
   * @param {string} name - string describing this type of item
   * @param {number} mass - mass of the item (kg)
   * @param {number} referenceArea - reference area of the object used to calculate drag, i.e. the frontal area (m^2)
   * @param {number} dragCoefficient - drag coefficient of the item used to calculate drag
   * @param {number} initialAltitude - initial altitude of the object (give -1 for infinite falling)
   */
  function FallingObject( fallingObjectsModel, name, mass, referenceArea, dragCoefficient, initialAltitude ) {

    // @public (read-only)
    this.fallingObjectsModel = fallingObjectsModel;
    this.name = name;
    this.mass = mass;
    this.dragCoefficient = dragCoefficient;
    this.initialAltitude = initialAltitude;

    // @public {Property.<number>} reference area of the projectile
    this.referenceArea = new NumberProperty( referenceArea );

    // @public {Property.<number>} altitude (i.e. position) of the projectile
    this.altitudeProperty = new NumberProperty( initialAltitude );  // m

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
     * Reset properties
     * @public
     * @override
     */
    reset: function() {
      this.altitudeProperty.reset();
      this.velocityProperty.reset();
      this.accelerationProperty.reset();
      this.weightForceProperty.reset();
      this.dragForceProperty.reset();
      this.netForceProperty.reset();
   }

   /**
    * Calculate weight of the object in Newtons and set the weightForceProperty to the calculated value.
    * @public
    */
    updateWeightForce: function() {
      this.weightForceProperty.set( this.fallingObjectsModel.getAccelerationGravity() * this.mass );
    },

    /**
     * Calculate drag force acting on the object in Newtons and set the dragForceProperty to the calculated value.
     * @public
     */
    updateDragForce: function() {
      this.dragForceProperty.set(
        0.5 * ( this.dragCoefficient * this.fallingObjectsModel.getAirDensity() * ( this.velocityProperty.get() ** 2 ) * this.referenceAreaProperty.get() )
      );
    }

    /**
     * Calculate net force acting on the object in Newtons and set the netForceProperty to the calculated value.
     * This method will call updateDragForce() and updateWeightForce() prior to calculating anything, therefore updating
     * dragForceProperty, weightForceProperty and netForceProperty all in one.
     */
    updateNetForce: function() {
      // Update values that will be used to calculate net force
      this.updateWeightForce();
      this.updateDragForce();

      this.netForceProperty.set( this.weightForceProperty.get() - this.dragForceProperty.get() );
    }

    /**
     * Calculate acceleration acting on the object in m/s^2 and set the accelerationProperty to the calculated value.
     * This method will call updateNetForce() prior to calculating anything, therefore updating all force properties.
     */
    updateAcceleration: function() {
      // Update value that will be use to calculate acceleration
      this.updateNetForce();

      this.accelerationProperty.set( this.netForceProperty.get() / this.mass );
    }
  } );

} );
