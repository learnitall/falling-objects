// Copyright 2018, University of Colorado Boulder

/**
 * Node to display a FallingObject
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var combustedString = require( 'string!FALLING_OBJECTS/combusted' );

  /**
   * Constructor for FallingObjectNode
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selectedFallingObjectNameProperty
   * @param {FallingObjectViewFactory} fallingObjectViewFactory - view factory for constructing images for this Node
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function FallingObjectNode( fallingObjectsModel, fallingObjectViewFactory, modelViewTransform ) {

    // Set attributes
    this.fallingObjectsModel = fallingObjectsModel;
    this.fallingObjectViewFactory = fallingObjectViewFactory;
    this.modelViewTransform = modelViewTransform;

    // Defined for constructor
    var self = this;

    // Define for convenience
    this.originPos = this.modelViewTransform.modelToViewPosition( new Vector2( 0, 0 ) );

    // Call super constructor
    Node.call( this );

    // Set image for the node based on the selected falling object
    this.fallingObjectsModel.selectedFallingObjectNameProperty.link( function ( selectedFallingObjectName ) {
      // This function is defined below in the inherit call
      self.setFallingObjectNodeImage( selectedFallingObjectName );
    } );

    // Set the positioning of the node on the screen dynamically if needed
    if ( !this.fallingObjectsModel.constantAltitude ) {

      this.fallingObjectsModel.selectedFallingObject.positionProperty.link( function( position ) {

        // self.originPos.y + viewDistanceToGround represents the point on the ground to which the object falls to
        // Then we subtract the altitude of the object in view coordinates (subtract since axis is inverted on screen)
        var newViewPosition = self.originPos.y + self.fallingObjectsModel.viewDistanceToGroundProperty.get() - self.modelViewTransform.modelToViewDeltaY( position.y );

        // Check if the view position if below than the origin position on the screen
        if ( newViewPosition > self.originPos.y ) {
          self.setBottom( newViewPosition );

          // Make sure that the dynamic falling property is set to other moving background elements know to stop moving
          if ( self.fallingObjectsModel.fallingObjectNodeStaticPositionProperty.get() ) {
            self.fallingObjectsModel.fallingObjectNodeStaticPositionProperty.set( false );
          }
        } else {
          // If the newViewPosition is not below the origin position, but the fallingObject is, then set the falling object
          // to the origin
          if ( self.getBottom() > self.originPos.y ) {
            self.setCenterBottom( self.originPos );
          }

          // Reset the static position property to being true
          if ( !self.fallingObjectsModel.fallingObjectNodeStaticPositionProperty.get() ) {
            self.fallingObjectsModel.fallingObjectNodeStaticPositionProperty.set( true );
          }
        }

      } );

    }


    // using the link method will call the listener function right away, meaning this.image will be defined
    this.addChild( this.image );

    // If the object has combusted due to drag forces, then replace the image with a fireball
    this.fallingObjectsModel.selectedFallingObject.combustedProperty.link( function( combustedValue ) {
      // If the object is combusted
      if ( combustedValue ) {
        // Set the combusted image to have the same diameter settings as the currently selected falling object
        // This way the fireball image that is to be displayed will be the same size as the selected falling object's image
        var combustedConstantsName = FallingObjectsConstants.stringToConstantsName( combustedString );
        var selectedFallingObjectConstantsName = FallingObjectsConstants.stringToConstantsName( self.fallingObjectsModel.selectedFallingObjectNameProperty.get() );
        FallingObjectsConstants[ combustedConstantsName ].diameter = FallingObjectsConstants[ selectedFallingObjectConstantsName ].diameter;

        // Set the image to be combusted
        self.setFallingObjectNodeImage( combustedString );
      } else {
        // If the object isn't combusted but the combusted object is updated, then make sure the appropriate
        // image is displayed for the selected falling object (i.e. in the case of a reset)
        self.setFallingObjectNodeImage( self.fallingObjectsModel.selectedFallingObjectNameProperty.get() );
      }
    } );
  }

  fallingObjects.register( 'FallingObjectNode', FallingObjectNode );

  return inherit( Node, FallingObjectNode, {

    /**
     * Auxiliary function for changing the image of the falling object node based on the name of the
     * selected falling object
     * @private
     *
     * @param {string} selectedFallingObjectName - name of the falling object whose image to use for the FallingObjectNode
     */
    setFallingObjectNodeImage: function( selectedFallingObjectName ) {
      // If we already have an existing image set, then dispose of it
      if ( typeof this.image !== 'undefined' ) {
        this.image.dispose();
      }
      // Set the image to the appropriate view retrieved from the factory
      this.image = this.fallingObjectViewFactory.constructView( selectedFallingObjectName, this.modelViewTransform );
      // Reset our children so the Node updates
      this.setChildren( [ this.image ] );

      // Reset position of the image on the screen
      this.setCenterBottom( this.originPos );
    }

  } );
} );