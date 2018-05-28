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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Property = require( 'AXON/Property' );

  /**
   * Constructor for FallingObjectNode
   *
   * @param {FallingObjectModel} fallingObjectModel - will be used to pull selectedFallingObjectNameProperty
   * @param {FallingObjectViewFactory} fallingObjectViewFactory - view factory for constructing images for this Node
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function FallingObjectNode( fallingObjectModel, fallingObjectViewFactory, modelViewTransform ) {

    // Set attributes
    this.fallingObjectModel = fallingObjectModel;
    this.fallingObjectViewFactory = fallingObjectViewFactory;
    this.modelViewTransform = modelViewTransform;

    // Defined for construction
    var self = this;

    // Call super constructor
    Node.call( this );

    // Set image for the node
    this.fallingObjectModel.selectedFallingObjectNameProperty.link( function ( selectedFallingObjectName ) {
      self.image = self.fallingObjectViewFactory.constructView( selectedFallingObjectName, self.modelViewTransform );
      self.setChildren( [ self.image ] );
    } );
    // using the link method will call the listener function right away, meaning this.image will be defined
    this.addChild( this.image );

    // Set drop position based on fallingObject's position
    this.translation = modelViewTransform.modelToViewPosition( fallingObjectModel.selectedFallingObject.positionProperty.get() );
  }

  fallingObjects.register( 'FallingObjectNode', FallingObjectNode );

  return inherit( Node, FallingObjectNode );
} );