// Copyright 2018, University of Colorado Boulder

/**
 * Parachute image that is displayed above the falling object when triggered.
 *
 * @author Ryan drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // images
  var parachuteImage = require( 'image!FALLING_OBJECTS/parachute.png' );

  /**
   * Construct the Parachute node. Assumes that the FallingObjectsModel has been given the option "enableParachute: true"
   *
   * @param {FallingObjectsModel} fallingObjectsModel - Will be used to create the appropriate links that update state of parachute node
   * @param {FallingObjectNode} fallingObjectNode - Node created in the screen view that represents the falling object
   */
  function ParachuteNode( fallingObjectsModel, fallingObjectNode ) {

    // Call the super
    Node.call( this );
    // Grab a reference to self
    var self = this;

    // Create a the parachute image node
    this.parachuteImage = new Image( parachuteImage );

    // Get the aspect ratio of the parachute image so we can properly scale the height as the width changes
    var parachuteImageAspectRatio = this.parachuteImage.width / this.parachuteImage.height;

    // Link to adjust the size of the parachute when the selected falling object changes
    // Parachute will be set to twice the width of the falling object
    fallingObjectsModel.selectedFallingObjectNameProperty.link( function( selectedFallingObjectName ) {

      // Get the width of the falling object node, multiply by the defined scale in constants
      var parachuteImageWidth = fallingObjectNode.width * 1.5;
      // To set the height of the parachute, use the aspect ratio
      var parachuteImageHeight = parachuteImageWidth / parachuteImageAspectRatio;

      // Make sure the height doesn't extend past the screen
      if ( fallingObjectNode.getTop() - parachuteImageHeight < 0 ) {
        // If height does extend past the screen, then just set to the distance between the top of the falling object
        // to the edge of the screen
        parachuteImageHeight = fallingObjectNode.getTop() - FallingObjectsConstants.SCREEN_MARGIN_Y;
      }

      // Scale the image
      self.parachuteImage.setMaxWidth( parachuteImageWidth );
      self.parachuteImage.setMaxHeight( parachuteImageHeight );

      // Position the parachuteImage to be right above the FallingObjectNode
      self.parachuteImage.setCenterX( fallingObjectNode.getCenterX() );
      // Put the bottom of the parachute just below the top of the FO node, looks a bit nicer
      self.parachuteImage.setBottom( fallingObjectNode.getTop() + FallingObjectsConstants.PARACHUTE_Y_PADDING );

    } );

    // Create a link that will toggle the parachute with the parachuteDeployedProperty
    fallingObjectsModel.parachuteDeployedProperty.link( function( parachuteDeployed ) {

      // Set visibility of the parachute
      self.parachuteImage.setVisible( parachuteDeployed );

      // Adjust the falling object's reference area
      if ( parachuteDeployed ) {
        // Double the reference area of the selected falling object
        fallingObjectsModel.selectedFallingObject.referenceAreaProperty.set(
          fallingObjectsModel.selectedFallingObject.referenceAreaProperty.get() * 2
        );
      } else {
        // Reset the reference area
        fallingObjectsModel.selectedFallingObject.referenceAreaProperty.reset();
      }

    } );

    this.addChild( this.parachuteImage );

  }

  fallingObjects.register( 'ParachuteNode', ParachuteNode );

  return inherit( Node, ParachuteNode );

} );
