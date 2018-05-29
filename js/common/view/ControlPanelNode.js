// Copyright 2018, University of Colorado Boulder

/**
 * Control panel that lets users toggle various elements on the screen,
 * choose which object they want to drop, and pause/play, step and reset
 * the simulation.
 *
 * @author Ryan Drew
 */
define( function ( require ) {
  'use strict';

  // modules
  var ControlButtonsNode = require( 'FALLING_OBJECTS/common/view/ControlButtonsNode' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var FallingObjectSelectorNode = require( 'FALLING_OBJECTS/common/view/FallingObjectSelectorNode' );
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

    // Defined for convenience
    var controlPanelSpacing = FallingObjectsConstants.CONTROL_PANEL_SPACING;
    var controlPanelAlignment = FallingObjectsConstants.CONTROL_PANEL_ALIGNMENT;

    // Control Buttons (Play/Pause, Reset, Step)
    var controlButtonsNode = new ControlButtonsNode( fallingObjectsModel, controlPanelMaxWidth );

    // ComboBox selector
    var fallingObjectSelectorNode = new FallingObjectSelectorNode( fallingObjectsModel, fallingObjectNames, controlPanelMaxWidth );

    // Create a VBox to hold and place items
    var controlPanelVBox = new VBox( {
      align: controlPanelAlignment,
      spacing: controlPanelSpacing,
      children: [
        controlButtonsNode,
        fallingObjectSelectorNode
      ]
    } );
    this.addChild( controlPanelVBox );

  }

  fallingObjects.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );


} );