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
  var CheckBox = require( 'SUN/CheckBox' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * Construct the control Panel
   *
   * @param {array} toggleList - List of stings/labels and their associated properties to toggle: [ { label: {string}, property: {BooleanProperty} }, ... ]
   * @param {number} maxWidth - max width of the toggle panel
   */
  function TogglePanel( toggleList, maxWidth ) {

    // Call the super
    Node.call( this );

    // Defined below for convenience in this constructor
    var controlPanelOptions = FallingObjectsConstants.CONTROL_PANEL_OPTIONS;
    var controlPanelsAlignment = FallingObjectsConstants.CONTROL_PANELS_ALIGNMENT;
    var controlPanelsVerticalSpacing = FallingObjectsConstants.CONTROL_PANELS_VERTICAL_SPACING;

    // Create options for the CheckBoxes
    // Defined below are the defaults, we just need a reference for readability
    var checkBoxOptions = {
      spacing: 5,  // spacing between the check box and the label node
      boxWidth: 21  // Width of the check box
    };

    // Create options for the check box label nodes
    var labelNodeOptions = {
      font: new PhetFont( { size: FallingObjectsConstants.CONTROL_PANELS_FONT_SIZE } ),
      maxWidth: maxWidth -  // Start with max width
                2 * controlPanelOptions.xMargin -  // Subtract margin on each side of the panel
                checkBoxOptions.spacing - checkBoxOptions.boxWidth  // Remove width of check box and spacing between the box and label
    };

    // Construct the CheckBoxes from the given toggleList
    var toggleNodes = []
    toggleList.forEach( function( toggleItem ) {

      // Create a Text node to act as the check box label
      var labelText = new Text( toggleItem.label, labelNodeOptions );

      // Construct the check box
      var checkBox = new CheckBox( labelText, toggleItem.property, checkBoxOptions );

      // Place the check box alongside an HStrut that sets the width
      var toggleNode = new VBox( {
        align: controlPanelsAlignment,
        children: [
          checkBox,
          new HStrut( maxWidth - 2 * controlPanelOptions.xMargin )
        ]
      } );
      toggleNodes.push( toggleNode );
    } );

    // Create a VBox for all the toggles
    var toggleVBox = new VBox( {
      align: controlPanelsAlignment,
      spacing: controlPanelsVerticalSpacing,
      children: toggleNodes
    } );

    // Create the panel
    var togglePanel = new Panel( toggleVBox, controlPanelOptions );

    this.addChild( togglePanel );
  }

  fallingObjects.register( 'TogglePanel', TogglePanel );

  return inherit( Node, TogglePanel );

} );