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
  var FallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor for FallingObject
   *
   * @param {FallingObjectsModel} FallingObjectsModel - used to pull environmental values
   * @param {string} name - string describing this type of item
   * @param {number} mass - mass of the item (kg)
   * @param {number} referenceArea - reference area of the object used to calculate drag, i.e. the frontal area (m^2)
   * @param {number} dragCoefficient - drag coefficient of the item used to calculate drag
   * @param {number} initialAltitude - initial altitude of the object (give -1 for infinite falling)
   * @param {image} image - image from the 'image!' plugin, which will be shown on screen for the FallingObject
   * @param {number} imageScale - value used to scale the image to the appropriate size
   * @param {Vector2} initialPosition - the starting position of the FallingObject in model coordinates
   */
  function FallingObject( FallingObjectsModel, name, mass, referenceArea, dragCoefficient, initialAltitude, image, imageScale, initialPosition ) {

    // @public (read-only)
    this.FallingObjectsModel = FallingObjectsModel;
    this.name = name;
    this.mass = mass;
    this.dragCoefficient = dragCoefficient;
    this.initialAltitude = initialAltitude;
    this.image = image;
    this.imageScale = imageScale;

    // @public {Property.<Vector2>} - the position of the FallingObject
    this.positionProperty = new Property( initialPosition );

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

  FallingObjects.register( 'FallingObject', FallingObject );

  return inherit( Object, FallingObject, {

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
      if ( this.FallingObjectsModel.dragEnabledProperty.get() ) {
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
    },

    /**
    * Step the object in time by re-calculating properties given a change in time.
    * @public
    *
    * @param {number} dt - delta time
    */
    step: function( dt ) {
      // Updating the velocity will update all other calculated properties
      this.updateVelocity( dt );
    }
  } );

} );
