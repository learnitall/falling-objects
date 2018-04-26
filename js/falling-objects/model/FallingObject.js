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
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' )

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
    this.name = name;
    this.mass = mass;
    this.referenceArea = referenceArea;
    this.dragCoefficient = dragCoefficient;
    this.initialAltitude = initialAltitude;

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
  } );

} );
