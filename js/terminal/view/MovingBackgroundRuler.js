// Copyright 2018, University of Colorado Boulder

/**
 * Addition to the MovingBackground that adds a Ruler and a Ground that the FallingObjectNode can
 * fall onto.
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var rocketImage = require( 'image!FALLING_OBJECTS/rocket.png' );

  /**
   * Construct the Ruler and Ground which will overlay onto the MovingBackground.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selected falling object
   */
  function MovingBackgroundRuler( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'MovingBackgroundRuler', MovingBackgroundRuler );

  return inherit( Node, PlatformNode );

} );