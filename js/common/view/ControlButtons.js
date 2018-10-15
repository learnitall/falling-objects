// Copyright 2018, University of Colorado Boulder

/**
 * Scenery node containing the Play, Pause and Step buttons that let users
 * control how the simulation runs
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );

  /**
   * Construct the node
   *
   * @param {FallingObjectsModel} fallingObjectsModel - model to pull play property, step and reset method from
   * @param {FallingObjectsScreenView} fallingObjectsScreenView - screen view to pull reset method from
   * @param {number} controlButtonsMaxWidth - max width of the node
   * @constructor
   */
  function ControlButtons( fallingObjectsModel, fallingObjectsScreenView, controlButtonsMaxWidth ) {

    // Call super constructor
    Node.call( this );

    // Pull variables from constants
    var controlButtonRadius = FallingObjectsConstants.CONTROL_BUTTON_RADIUS;
    var controlButtonStepDT = FallingObjectsConstants.CONTROL_BUTTON_STEP_DT;
    var controlButtonMarginX = FallingObjectsConstants.CONTROL_BUTTON_MARGIN_X;

    // Calculate the spacing between each button based on maxWidth and the button radius
    // total width - width from all three buttons (sum of diameters) - padding / 2 (there are two spacing gaps)
    var controlButtonSpacing = ( controlButtonsMaxWidth - ( ( controlButtonRadius * 2 ) * 3 ) - ( 2 * controlButtonMarginX ) ) / 2;

    // Reset All Button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        fallingObjectsModel.reset();
        fallingObjectsScreenView.reset();
      },
      radius: controlButtonRadius
    } );

    // Play-Pause Button
    // @public
    this.playPauseButton = new PlayPauseButton( fallingObjectsModel.playEnabledProperty, {
      radius: controlButtonRadius
    } );

    // When the selected falling object name changes, hit pause
    fallingObjectsModel.selectedFallingObjectNameProperty.lazyLink( function ( selectedFallingObjectName ) {
      fallingObjectsModel.playEnabledProperty.set( false );
    } );

    // Manual Step Forward Button
    // @public
    this.stepForwardButton = new StepForwardButton( {
      radius: controlButtonRadius,
      playingProperty: fallingObjectsModel.playEnabledProperty,
      listener: function() { fallingObjectsModel.stepModel( controlButtonStepDT ); }
    } );

    // Add the three buttons into an HBox
    var controlButtonHBox = new HBox( {
      children: [ resetAllButton, this.playPauseButton, this.stepForwardButton ],
      spacing: controlButtonSpacing
    } );
    this.addChild( controlButtonHBox );

  }

  fallingObjects.register( 'ControlButtons', ControlButtons );

  return inherit( Node, ControlButtons );

} );