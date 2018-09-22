// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the 'Terminal' screen
 */
define( function( require ) {
  'use strict';

  // modules
  var AltitudePanel = require( 'FALLING_OBJECTS/terminal/view/AltitudePanel' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsScreenView = require( 'FALLING_OBJECTS/common/view/FallingObjectsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TimerPanel = require( 'FALLING_OBJECTS/terminal/view/TimerPanel' );

  /**
   * Construct the screenView
   *
   * @param {FallingObjectsModel} fallingObjectsModel
   */
  function TerminalScreenView( fallingObjectsModel ) {

    // Call the screenView, passing in our given model
    FallingObjectsScreenView.call(
      this,
      fallingObjectsModel,
      {
        addDragToggle: false
      }
    );

    // Create the altitude panel
    this.altitudePanel = new AltitudePanel( fallingObjectsModel, this.controlPanelsMaxWidth );

    // Create the timer panel
    this.timerPanel = new TimerPanel( fallingObjectsModel, this.controlPanelsMaxWidth );

    // Add children
    // Make sure the  panels are behind the selector, yet in front of the moving background
    this.insertChild( 1, this.altitudePanel );
    this.insertChild( 1, this.timerPanel );

  }

  fallingObjects.register( 'TerminalScreenView', TerminalScreenView );

  return inherit( FallingObjectsScreenView, TerminalScreenView, {

    /**
     * Layout the items on the screen by first calling the parent FallingObjectsScreenView.layout
     * method, and then laying out all Terminal-screen view specific nodes
     * @override
     *
     * @public {number} width
     * @public {number] height
     */
    layout: function( width, height ) {
      // Call the super layout function
      FallingObjectsScreenView.prototype.layout.call( this, width, height );

      // Set the altitude panel to be just below the falling objects selector
      this.altitudePanel.top = this.fallingObjectSelectorNode.bottom + this.controlPanelsVerticalSpacing;
      this.altitudePanel.left = this.fallingObjectSelectorNode.left;

      // Set the timer to be just below the altitude panel
      this.timerPanel.top = this.altitudePanel.bottom + this.controlPanelsVerticalSpacing;
      this.timerPanel.left = this.altitudePanel.left;

      // Position control buttons below the timerPanel
      this.controlButtons.top = this.timerPanel.bottom + this.controlPanelsVerticalSpacing;
    }

  } );

} );