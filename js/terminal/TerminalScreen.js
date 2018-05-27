// Copyright 2018, University of Colorado Boulder

/**
 * The 'Terminal' screen, that allows users to explore the concept of Terminal Velocity by
 * seeing how and why a falling object interacts with the air around it.
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

  // string
  var screenTerminalString = require( 'string!FALLING_OBJECTS/screen.terminal' );

  /**
   * @constructor
   */
  function FallingObjectsScreen() {

    var options = {
      name: screenTerminalString,
      backgroundColorProperty: new Property( 'white' )
      // TODO: Add a homeScreenIcon
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