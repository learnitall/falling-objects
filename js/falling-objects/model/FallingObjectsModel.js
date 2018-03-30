// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );

  /**
   * @constructor
   */
  function FallingObjectsModel() {
    //TODO
  }

  fallingObjects.register( 'FallingObjectsModel', FallingObjectsModel );

  return inherit( Object, FallingObjectsModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );