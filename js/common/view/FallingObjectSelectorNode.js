// Copyright 2018, University of Colorado Boulder

/**
 * ComboBox that allows users to select the FallingObject they want to drop
 * Based off of the work done in the IntroView for projectile motion
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  /**
   * Construct the ComboBox
   *
   * @param {FallingObjectModel} fallingObjectModel - will be used to pull the selectedFallingObjectNameProperty
   * @param {array} fallingObjectNames - array of FallingObject string! names that users will be able to choose from (populates combo box)
   * @param {number} maxWidth - max width of the selector
   * @param {Node} comboBoxParentNode - parent node for the combo box
   * @constructor
   */
  function FallingObjectSelectorNode( fallingObjectModel, fallingObjectNames, maxWidth, comboBoxParentNode ) {
    // Method of construction based off of projectile-motion's combo box on the Intro screen)

    // Call the super
    Node.call( this );

    // Construct the phont and item node options object
    var itemNodeFont = new PhetFont( { size: FallingObjectsConstants.CONTROL_PANELS_FONT_SIZE } );
    var itemNodeOptions = { font: itemNodeFont, maxWidth: undefined };  // don't know maxWidth for now, it is set later

    // These are the default values for the combo box, we just need a reference for readability
    var comboBoxOptions = {
      buttonXMargin: 10,
      itemXMargin: 6,
      listLineWidth: 1,
      buttonLineWidth: 1
    };

    // Construct the first item in the options list and alter its size to set the length of the combo box
    // The combo box node will set its length according the longest item node in the options list
    var firstItemNode = new VBox( {
      align: 'left',
      children: [
        new Text( fallingObjectNames[ 0 ], itemNodeOptions )
      ]
    } );

    // Determine the desired width of the item list, which is everything to the left of the combo box button
    // Algorithm used determined by looking at source code for ComboBox
    var itemNodeWidth = (
      maxWidth -  // Start with the total width of the box
      comboBoxOptions.buttonXMargin * 2 - comboBoxOptions.itemXMargin * 2 -  // Subtract padding used in the item list width
      comboBoxOptions.buttonXMargin * 4 -  // Subtract padding used in the drop-down button width
      firstItemNode.height * 0.5 -  // Subtract width of the drop-down button's arrow (this is why firstItemNode must be defined first)
      comboBoxOptions.listLineWidth * 2 - comboBoxOptions.buttonLineWidth * 3  // Subtract width of lines in the combo box
    );

    // Set the width of the firstItemNode by adding an HStrut and setting the maxWidth of the Text Node
    firstItemNode.addChild( new HStrut( itemNodeWidth ) );
    firstItemNode.setMaxWidth( itemNodeWidth );

    // Define the maxWidth option in itemNodeOptions
    itemNodeOptions.maxWidth = itemNodeWidth;

    // Create the items for the combo box
    var comboBoxItems = [];
    comboBoxItems.push( ComboBox.createItem( firstItemNode, fallingObjectNames[ 0 ] ) );
    for ( var i = 1; i < fallingObjectNames.length; i++ ) {
      comboBoxItems.push( ComboBox.createItem( new Text( fallingObjectNames[ i ], itemNodeOptions ), fallingObjectNames[ i ] ) );
    }

    // Now construct the ComboBox
    var comboBox = new ComboBox( comboBoxItems, fallingObjectModel.selectedFallingObjectNameProperty, comboBoxParentNode, comboBoxOptions );
    comboBoxParentNode.addChild( comboBox );

    // Create a VBox to give some space for the comboBox
    var selectorControlVBox = new VBox( {
      resize: true,
      children: [
        new VStrut( comboBox.height )
      ]
    } );

    // Create a panel for the background color and placement of all the controls
    var panelOptions = FallingObjectsConstants.CONTROL_PANEL_OPTIONS;
    panelOptions.minWidth = maxWidth;
    var selectorPanel = new Panel( selectorControlVBox, panelOptions );

    // Add these to the object attributes so they can be used later on during layout
    this.comboBoxParentNode = comboBoxParentNode;
    this.panelOptions = panelOptions;
    this.selectorPanel = selectorPanel;

    this.addChild( selectorPanel );
  }

  fallingObjects.register( 'FallingObjectSelectorNode', FallingObjectSelectorNode );

  return inherit( Node, FallingObjectSelectorNode );

} );