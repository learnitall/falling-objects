// Copyright 2018, University of Colorado Boulder

/**
 * Deploy Parachute button for toggling the ParachuteNode. Built on RoundStickyToggleButton
 *
 * @author Ryan Drew
 */
define( function ( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );

  // images
  var parachuteImage = require( 'image!FALLING_OBJECTS/parachute.png' );

  /**
   * Construct the DeployParachuteButton
   *
   * @param {FallingObjectsModel} fallingObjectsModel - Will be used to access the parachuteDeployedProperty
   * @param {number} radius - radius of the button
   */
  function DeployParachuteButton( fallingObjectsModel, radius ) {

    // Call the super
    RoundStickyToggleButton.call(
      this,
      false,  // When not pressed, value will be set to false
      true,  // When pressed, value will be set to true
      fallingObjectsModel.parachuteDeployedProperty,  // Property whose value will change is the parachuteDeployedProperty
      { radius: radius }
    );

    // Create a little parachute icon to put over the button
    var parachuteImageNode = new Image( parachuteImage, {

      maxWidth: ( radius * 2 ) - ( radius / 10 ),  // Set to width of button, minus 1/20th of the radius on each side for padding
      maxHeight: ( radius * 2 ) - ( radius / 4 ),  // Set to height of button, minus 1/8th of the radius on each side for padding
      centerX: this.getCenterX(),
      centerY: this.getCenterY()

    } );

    this.addChild( parachuteImageNode );

  }

  fallingObjects.register( 'DeployParachuteButton', DeployParachuteButton );

  return inherit( RoundStickyToggleButton, DeployParachuteButton );

} );