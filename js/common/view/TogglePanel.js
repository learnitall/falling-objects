// Copyright 2018, University of Colorado Boulder

/**
 * Control panel that lets users toggle various elements on the screen,
 * such as the position, velocity and acceleration graphs, the free body
 * diagram and air resistance.
 *
 * @author Ryan Drew
 */
define( function ( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * Construct the control Panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selectedFallingObject property
   * @param {array} fallingObjectNames - array of FallingObject string! names that users will be able to choose from (populates combo box)
   * @param {number} controlPanelMaxWidth - max width of the control panel node
   */
  function ControlPanelNode( fallingObjectsModel, fallingObjectNames, controlPanelMaxWidth ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );

} );