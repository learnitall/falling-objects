// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsModel = require( 'FALLING_OBJECTS/falling-objects/model/FallingObjectsModel' );
  var FallingObjectsScreenView = require( 'FALLING_OBJECTS/falling-objects/view/FallingObjectsScreenView' );

  /**
   * @constructor
   */
  function FallingObjectsScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new FallingObjectsModel(); },
      function( model ) { return new FallingObjectsScreenView( model ); },
      options
    );
  }

  fallingObjects.register( 'FallingObjectsScreen', FallingObjectsScreen );

  return inherit( Screen, FallingObjectsScreen );
} );