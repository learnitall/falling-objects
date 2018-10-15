// Copyright 2018, University of Colorado Boulder

/**
 * Parachute image that is displayed above the falling object when triggered
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
    // @private
    this.parachuteImage = new Image( parachuteImage );

    // Get the aspect ratio of the parachute image so we can properly scale the height as the width changes
    var parachuteImageAspectRatio = this.parachuteImage.width / this.parachuteImage.height;

    /**
     * Auxiliary function to position the parachute on the falling object node
     */
    var positionParachuteOnNode = function() {
      // Put the bottom of the parachute just below the top of the FO node, looks a bit nicer
      // Add a Math.min call to deal with cases when PARACHUTE_Y_PADDING is actually greater than the height of the object
      self.parachuteImage.setBottom( fallingObjectNode.getTop() + Math.min( FallingObjectsConstants.PARACHUTE_Y_PADDING, fallingObjectNode.height * 0.1 ) );
    };

    // Link to adjust the size of the parachute when the selected falling object changes
    // Parachute will be set to twice the width of the falling object
    fallingObjectsModel.selectedFallingObjectNameProperty.link( function( selectedFallingObjectName ) {

      // Get the width of the falling object node, multiply by the defined scale in constants
      var parachuteImageWidth = fallingObjectNode.width * 2;
      // To set the height of the parachute, use the aspect ratio
      var parachuteImageHeight = parachuteImageWidth / parachuteImageAspectRatio;

      // Make sure the height doesn't extend past the screen
      if ( fallingObjectNode.getTop() - parachuteImageHeight < 0 ) {
        // If height does extend past the screen, then just set to the distance between the top of the falling object
        // to the edge of the screen
        parachuteImageHeight = fallingObjectNode.getTop() - FallingObjectsConstants.SCREEN_MARGIN_Y;
      }

      // Reset transform so scales reset
      self.parachuteImage.resetTransform();
      // Scale the image
      self.parachuteImage.setScaleMagnitude( parachuteImageWidth / self.parachuteImage.width, parachuteImageHeight / self.parachuteImage.height );

      // Position the parachuteImage to be right above the FallingObjectNode
      self.parachuteImage.setCenterX( fallingObjectNode.getCenterX() );
      positionParachuteOnNode();

    } );

    // Create a link that will toggle the parachute with the parachuteDeployedProperty
    fallingObjectsModel.parachuteDeployedProperty.link( function( parachuteDeployed ) {

      // Set visibility of the parachute
      self.parachuteImage.setVisible( parachuteDeployed );

      // Adjust the falling object's reference area
      if ( parachuteDeployed ) {
        // Set the reference area of the selected falling object to surface area of the parachute
        // (((width of falling object) * 2) / 2) ^ 2) * pi
        var objectAttributes = FallingObjectsConstants[
          FallingObjectsConstants.stringToConstantsName( fallingObjectsModel.selectedFallingObjectNameProperty.get() )
        ];
        var width;
        if ( objectAttributes.diameter.constructor === Array ) {
          width = objectAttributes.diameter[ 0 ];
        } else {
          width = objectAttributes.diameter;
        }

        fallingObjectsModel.selectedFallingObject.referenceAreaProperty.set( Math.pow( width, 2 ) * Math.PI );
      } else {
        // Reset the reference area
        fallingObjectsModel.selectedFallingObject.referenceAreaProperty.reset();
      }

    } );

    // Create a link that will update the position of the parachute, so it follows the falling object as it falls
    fallingObjectsModel.selectedFallingObject.positionProperty.lazyLink( function( position ) {
      if ( !fallingObjectsModel.fallingObjectNodeStaticPositionProperty.get() ) {  // only need to update if fo is moving dynamically
        positionParachuteOnNode();
      }
    } );

    // Create a link to re-position the parachute if we go from dynamic to static
    fallingObjectsModel.fallingObjectNodeStaticPositionProperty.lazyLink( function( fallingObjectNodeStaticPosition ) {
      if ( fallingObjectNodeStaticPosition ) {
        positionParachuteOnNode();
      }
    } );

    this.addChild( this.parachuteImage );

  }

  fallingObjects.register( 'ParachuteNode', ParachuteNode );

  return inherit( Node, ParachuteNode );

} );
