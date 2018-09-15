// Copyright 2018, University of Colorado Boulder

/**
 * Control panel that lets users set the initial altitude that
 * the FallingObject drops at
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Construct the altitude panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to communicate initial altitude to selected falling object
   * @param {number} maxWidth - max width of the altitude panel
   */
  function AltitudePanel( fallingObjectsModel, maxWidth ) {


  }

  fallingObjects.register( 'AltitudePanel', AltitudePanel );

  return inherit( Node, AltitudePanel );

} );