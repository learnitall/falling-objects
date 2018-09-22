// Copyright 2018, University of Colorado Boulder

/**
 * Timer panel that displays the total fall time
 * Essentially just a wrapper around the Scenery-PhET TimerReadoutNode
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';


  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerReadoutNode = require( 'SCENERY_PHET/TimerReadoutNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var objectsFallTimeString = require( 'string!FALLING_OBJECTS/objectsFallTime' );

  /**
   * Construct the timer panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull total fall time
   * @param {number} maxWidth - max width of the timer panel
   */
  function TimerPanel( fallingObjectsModel, maxWidth ) {

    // Call the super
    Node.call( this );

    // Create our TimerReadoutNode
    var timerReadoutNode = new TimerReadoutNode( fallingObjectsModel.totalFallTimeProperty, {
      maxTime: FallingObjectsConstants.TP_MAX_TIME
    } );

    // Create a label for the panel (just displays the totalFallTimeString)
    var labelOptions = {
      font: new PhetFont( { size: FallingObjectsConstants.CONTROL_PANELS_FONT_SIZE } ),
      maxWidth: maxWidth - timerReadoutNode.width - ( 2 * FallingObjectsConstants.CONTROL_PANEL_OPTIONS.xMargin )
    };
    var panelLabel = new Text( objectsFallTimeString, labelOptions );

    // Add them together using an HBox
    var timerPanelElements = new HBox( {
      resize: true,
      align: FallingObjectsConstants.CONTROL_PANELS_ALIGNMENT,
      children: [
        // Add the label into a VBox with an HStrut to ensure that the label will take up
        // the appropriate space
        new VBox( {
          align: 'left',
          children: [
            panelLabel,
            new HStrut( labelOptions.maxWidth )
          ]
        } ),
        timerReadoutNode
      ]
    } );

    // Create a panel
    var timerPanel = new Panel( timerPanelElements, FallingObjectsConstants.CONTROL_PANEL_OPTIONS );

    this.addChild( timerPanel );

  }

  fallingObjects.register( 'TimerPanel', TimerPanel );

  return inherit( Node, TimerPanel );

} );