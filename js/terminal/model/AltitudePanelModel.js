// Copyright 2018, University of Colorado Boulder

/**
 * Model to hold certain Properties needed for the AltitudePanel
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for AltitudePanelModel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - used to pull playEnabledProperty
   * @constructor
   */
  function AltitudePanelModel( fallingObjectsModel ) {

    // Grab a reference to self
    var self = this;

    // @public {Property.<boolean>} - tracks when play is disabled (the inverse of playEnabledProperty)
    this.playDisabledProperty = new BooleanProperty( null );  // will be set in the link below

    fallingObjectsModel.playEnabledProperty.link( function( playEnabled ) {
      self.playDisabledProperty.set( !playEnabled );
    } );

   }

   fallingObjects.register( 'AltitudePanelModel', AltitudePanelModel );

   return inherit( Object, AltitudePanelModel );

} );
