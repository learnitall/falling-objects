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
   */
  function FallingObject( fallingObjectsModel, name, mass, referenceArea, dragCoefficient ) {

    // @public (read-only)
    this.name = name;
    this.mass = mass;
    this.referenceArea = referenceArea;
    this.dragCoefficient = dragCoefficient;

  }

  fallingObjects.register( 'FallingObject', FallingObject );

  return inherit( Object, FallingObject );

} );
