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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Property = require( 'AXON/Property' );

  /**
   * Constructor for FallingObjectNode
   *
   * @param {FallingObject} fallingObject - the corresponding FallingObject for this Node
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function FallingObjectNode( fallingObject, modelViewTransform ) {

    // Get reference to this context for use in other contexts
    var self = this;
    this.fallingObject = fallingObject;
    this.modelViewTransform = modelViewTransform;

    // Call super constructor
    Node.call( this );

    // Set image for the node
    this.image = new Image( fallingObject.image, {
      centerX: 0,
      centerY: 0
    } );
    this.addChild( this.image );

    // Scale to appropriate size
    this.scale( fallingObject.imageScale );

    // Set drop position
    this.translation = modelViewTransform.modelToViewPosition( fallingObject.positionProperty.get() );
  }

  fallingObjects.register( 'FallingObjectNode', FallingObjectNode );

  return inherit( Node, FallingObjectNode );
} );