// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the 'Terminal' screen
 */
define( function( require ) {
  'use strict';

  // modules
  var AltitudePanel = require( 'FALLING_OBJECTS/terminal/view/AltitudePanel' );
  var DeployParachuteButton = require( 'FALLING_OBJECTS/terminal/view/DeployParachuteButton' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var FallingObjectsScreenView = require( 'FALLING_OBJECTS/common/view/FallingObjectsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ParachuteNode = require( 'FALLING_OBJECTS/terminal/view/ParachuteNode' );
  var MovingBackgroundGround = require( 'FALLING_OBJECTS/terminal/view/MovingBackgroundGround' );
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

    // Create the deploy parachute button
    // Set the width of the button to be 1/8 of the controlPanels' width
    this.deployParachuteButton = new DeployParachuteButton( fallingObjectsModel, this.controlPanelsMaxWidth * ( 1 / 8 ) );

    // Create the parachute node
    this.parachuteNode = new ParachuteNode( fallingObjectsModel, this.fallingObjectNode );

    // Create the MovingBackgroundGround, which sits right on top of the moving background
    this.movingBackgroundGround = new MovingBackgroundGround( fallingObjectsModel );

    // Add children
    // Make sure the movingBackgroundGround and parachuteNode are behind the fallingObjectNode
    this.insertChild( 1, this.movingBackgroundGround );
    this.insertChild( 1, this.parachuteNode );
    // Make sure the  panels are behind the selector, yet in front of the moving background
    this.insertChild( 1, this.altitudePanel );
    this.insertChild( 1, this.timerPanel );
    this.insertChild( 1, this.deployParachuteButton );

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

      // Layout the MovingBackgroundGround
      this.movingBackgroundGround.layout( this.visibleBoundsProperty.get().maxX, this.visibleBoundsProperty.get().maxY )

      // Set the altitude panel to be just below the falling objects selector
      this.altitudePanel.top = this.fallingObjectSelectorNode.bottom + this.controlPanelsVerticalSpacing;
      this.altitudePanel.left = this.fallingObjectSelectorNode.left;

      // Set the timer to be just below the altitude panel
      this.timerPanel.top = this.altitudePanel.bottom + this.controlPanelsVerticalSpacing;
      this.timerPanel.left = this.altitudePanel.left;

      // Position control buttons below the timerPanel
      this.controlButtons.top = this.timerPanel.bottom + this.controlPanelsVerticalSpacing;

      // Set the deploy parachute button to be below the control buttons
      this.deployParachuteButton.setCenterX( this.altitudePanel.getCenterX() );
      this.deployParachuteButton.top = this.controlButtons.bottom + this.controlPanelsVerticalSpacing;
    }

  } );

} );