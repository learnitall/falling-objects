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
   * @param {FallingObject} fallingObject - the corresponding FallingObject for this Node
   * @param {FallingObjectViewFactory} fallingObjectViewFactory - view factory for constructing images for this Node
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function FallingObjectNode( fallingObject, fallingObjectViewFactory, modelViewTransform ) {

    // Set attributes
    this.fallingObject = fallingObject;
    this.fallingObjectViewFactory = fallingObjectViewFactory;
    this.modelViewTransform = modelViewTransform;

    // Call super constructor
    Node.call( this );

    // Set image for the node
    this.image = this.fallingObjectViewFactory.constructView( this.fallingObject.name, this.modelViewTransform );
    this.addChild( this.image );

    // Set drop position based on fallingObject's position
    this.translation = modelViewTransform.modelToViewPosition( fallingObject.positionProperty.get() );
  }

  fallingObjects.register( 'FallingObjectNode', FallingObjectNode );

  return inherit( Node, FallingObjectNode );
} );