// Copyright 2018, University of Colorado Boulder

/**
 * The 'Basics' screen, that allows basic simulation of various FallingObject types with an infinite fall time
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsModel = require( 'FALLING_OBJECTS/common/model/FallingObjectsModel' );
  var FallingObjectsScreenView = require( 'FALLING_OBJECTS/common/view/FallingObjectsScreenView' );

  // strings
  var screenBasicsString = require( 'string!FALLING_OBJECTS/screen.basics' );

  /**
   * @constructor
   */
  function FallingObjectsScreen() {

    var options = {
      name: screenBasicsString,
      backgroundColorProperty: new Property( 'white' )
      // TODO: Add a homeScreenIcon
    };

    Screen.call( this,
      function() { return new FallingObjectsModel( true ); },
      function( model ) { return new FallingObjectsScreenView( model ); },
      options
    );
  }

  fallingObjects.register( 'FallingObjectsScreen', FallingObjectsScreen );

  return inherit( Screen, FallingObjectsScreen );
} );