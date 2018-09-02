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

    // Defined for construction
    var self = this;

    // Call super constructor
    Node.call( this );

    // Set image for the node based on the selected falling object
    this.fallingObjectsModel.selectedFallingObjectNameProperty.link( function ( selectedFallingObjectName ) {
      // This function is defined below in the inherit call
      self.setFallingObjectNodeImage( selectedFallingObjectName );
    } );

    // using the link method will call the listener function right away, meaning this.image will be defined
    this.addChild( this.image );

    // Set drop position based on fallingObject's position
    this.translation = modelViewTransform.modelToViewPosition( this.fallingObjectsModel.selectedFallingObject.positionProperty.get() );

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
    }

  } );
} );