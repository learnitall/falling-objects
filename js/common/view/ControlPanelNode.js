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
  var ComboBox = require( 'SUN/ComboBox' );
  var ControlButtonsNode = require( 'FALLING_OBJECTS/common/view/ControlButtonsNode' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Construct the control Panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull selectedFallingObject property
   * @param {array} fallingObjectNames - array of FallingObject string! names that users will be able to choose from (populates combo box)
   */
  function ControlPanelNode( fallingObjectsModel, fallingObjectNames ) {

    // Call the super
    Node.call( this );

    // Combo Box
    var comboBoxItems = [];
    fallingObjectNames.forEach( function( fallingObjectName ) {
      comboBoxItems.push( ComboBox.createItem( new Text( fallingObjectName ), fallingObjectName ) );
    } );

    var fallingObjectChoiceComboBox = new ComboBox(
      comboBoxItems,
      fallingObjectsModel.selectedFallingObjectNameProperty,
      this
    );

   this.addChild( fallingObjectChoiceComboBox );

  }

  fallingObjects.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );


} );