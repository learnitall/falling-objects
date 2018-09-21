// Copyright 2018, University of Colorado Boulder

/**
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlButtons = require( 'FALLING_OBJECTS/common/view/ControlButtons' );
  var TogglePanel = require( 'FALLING_OBJECTS/common/view/TogglePanel' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var FallingObjectNode = require( 'FALLING_OBJECTS/common/view/FallingObjectNode' );
  var FallingObjectSelectorNode = require( 'FALLING_OBJECTS/common/view/FallingObjectSelectorNode' );
  var FallingObjectViewFactory = require( 'FALLING_OBJECTS/common/view/FallingObjectViewFactory' );
  var FreeBodyDiagram = require( 'FALLING_OBJECTS/common/view/FreeBodyDiagram' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovingBackground = require( 'FALLING_OBJECTS/common/view/MovingBackground' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PVAGraphs = require( 'FALLING_OBJECTS/common/view/PVAGraphs' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ValuePanel = require( 'FALLING_OBJECTS/common/view/ValuePanel' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var showValuesString = require( 'string!FALLING_OBJECTS/showValues' );
  var showFreeBodyDiagramString = require( 'string!FALLING_OBJECTS/showFreeBodyDiagram' );
  var showPVAGraphsString = require('string!FALLING_OBJECTS/showPVAGraphs' );
  var enableDragString = require( 'string!FALLING_OBJECTS/enableDrag' );

  /**
   * @param {FallingObjectsModel} fallingObjectsModel
   * @param {Object} options - Options that other screenViews will use to customize the screen
   * @constructor
   */
  function FallingObjectsScreenView( fallingObjectsModel, options ) {

    // Add in default values for the options Object, just in case all is not given
    options = _.extend( {
      addDragToggle: true,  // Will add an Enable Drag toggle into the TogglePanel
      addAltitudeValue: false  // Will add a label for Altitude in the ValuePanel
    }, options );

    // Hold onto a reference of the model
    this.fallingObjectsModel = fallingObjectsModel;

    // Call super constructor
    ScreenView.call( this );
    var self = this;

    // Variables for this constructor and for the layout method, for convenience
    // @private
    var screenWidth = this.layoutBounds.width;
    var screenHeight = this.layoutBounds.height;
    var center = new Vector2( screenWidth / 2, screenHeight / 2 );
    var scale = FallingObjectsConstants.MODEL_VIEW_TRANSFORM_SCALE;
    this.screenMarginX = FallingObjectsConstants.SCREEN_MARGIN_X;
    this.screenMarginY = FallingObjectsConstants.SCREEN_MARGIN_Y;
    this.controlPanelsMaxWidth = screenWidth / 4;
    this.controlPanelsVerticalSpacing = FallingObjectsConstants.CONTROL_PANELS_VERTICAL_SPACING;
    this.controlPanelsHorizontalSpacing = FallingObjectsConstants.CONTROL_PANELS_HORIZONTAL_SPACING;
    var freeBodyDiagramHeight = screenHeight - ( 2 * this.screenMarginY );
    var freeBodyDiagramWidth = this.controlPanelsMaxWidth / 1.5;
    this.graphsHorizontalSpacing = FallingObjectsConstants.GRAPHS_HORIZONTAL_SPACING;
    var pvaGraphsHeight = freeBodyDiagramHeight;
    var pvaGraphsWidth = center.x - freeBodyDiagramWidth - this.graphsHorizontalSpacing - FallingObjectsConstants.VG_CENTER_PADDING;

    // Create the moving background
    this.movingBackground = new MovingBackground( this.fallingObjectsModel );

    // Create model-view transform
    this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( center, scale );

    // Create a view factory
    this.fallingObjectViewFactory = new FallingObjectViewFactory( );

    // Create the FallingObjectNode to display the currently falling object
    this.fallingObjectNode = new FallingObjectNode(
      this.fallingObjectsModel,
      this.fallingObjectViewFactory,
      this.modelViewTransform
    );

    // Control Buttons (Play/Pause, Reset, Step)
    this.controlButtons = new ControlButtons( fallingObjectsModel, this, this.controlPanelsMaxWidth );

    // When the sim is disabled, also disable the play/step buttons
    this.fallingObjectsModel.simEnabledProperty.link( function( simEnabledValue ) {
      self.controlButtons.playPauseButton.enabled = simEnabledValue;
      self.controlButtons.stepForwardButton.enabled = simEnabledValue;
    } );

    // Falling Object Selector Node
    // The parent holds the comboBox
    this.fallingObjectSelectorParent = new Node();
    this.fallingObjectSelectorNode = new FallingObjectSelectorNode(
      this.fallingObjectsModel,
      this.fallingObjectsModel.fallingObjectNames,
      this.controlPanelsMaxWidth,
      this.fallingObjectSelectorParent
    );

    // Toggle Panel
    var toggleList = [
      { label: showValuesString, property: this.fallingObjectsModel.showValuesProperty },
      { label: showFreeBodyDiagramString, property: this.fallingObjectsModel.showFreeBodyDiagramProperty },
      { label: showPVAGraphsString, property: this.fallingObjectsModel.showPVAGraphsProperty }
    ];

    if ( options.addDragToggle ) {
      toggleList.push( FallingObjectsConstants.TP_LINE_SEP );
      toggleList.push( { label: enableDragString, property: this.fallingObjectsModel.dragForceEnabledProperty } );
    }
    this.togglePanel = new TogglePanel( toggleList, this.controlPanelsMaxWidth );

    // Value panel
    this.valuePanel = new ValuePanel( fallingObjectsModel, this.controlPanelsMaxWidth, options.addAltitudeValue );

    // Create the Free Body Diagram
    this.freeBodyDiagram = new FreeBodyDiagram( this.fallingObjectsModel, freeBodyDiagramWidth, freeBodyDiagramHeight );

    // Create the PVAGraphs
    this.pvaGraphs = new PVAGraphs( this.fallingObjectsModel, pvaGraphsWidth, pvaGraphsHeight );

    // Create a link that will reset the screen view when the selected falling object changes
    this.fallingObjectsModel.selectedFallingObjectNameProperty.lazyLink( function( selectedFallingObjectName ) {
      self.reset();
    } );

    // Add all of the children
    this.addChild( this.movingBackground );
    this.addChild( this.fallingObjectNode );
    this.addChild( this.fallingObjectSelectorNode );
    this.addChild( this.togglePanel );
    this.addChild( this.valuePanel );
    this.addChild( this.controlButtons );
    this.addChild( this.freeBodyDiagram );
    this.addChild( this.pvaGraphs );
    this.addChild( this.fallingObjectSelectorParent );
  }

  fallingObjects.register( 'FallingObjectsScreenView', FallingObjectsScreenView );

  return inherit( ScreenView, FallingObjectsScreenView, {

    /**
     * Layout the Nodes on the screen
     * @override
     *
     * @param {number} width
     * @param {number} height
     */
    layout: function( width, height ) {

      // First we need to scale and center the screen view to match the actual browser screen as best as possible
      // This code is from the default layout method which we are overwriting

      // Start with a clean transformation on the screen view
      this.resetTransform();

      // Determine the scale used for laying out components, and set our screen view's scale to match
      // If the difference between the screen view's width and the actual screen's width is smaller than the
      // respective difference in height, then that scale is used (and vice versa)
      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      // After scaling, translate the screen view on the screen so that it is centered
      var offsetX = 0;
      var offsetY = 0;

      // If we are scaling the screen view based off of width, then center it on the screen vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = ( height / scale - this.layoutBounds.height ) / 2;
      }

      // If we are scaling the screen view based off of height, then center it on the screen horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = ( width / scale - this.layoutBounds.width ) / 2;
      }

      // Move the screen view
      this.translate( offsetX, offsetY );

      // Now position nodes into place
      // Note that the fallingObjectNode will place itself based on the modelViewTransform

      // Transform the background node to take up the screen
      this.movingBackground.layout( offsetX, offsetY, width, height, scale );

      // Move the toggle panel to the top right (it's the control panel highest on screen)
      this.togglePanel.setRightTop( new Vector2( width / scale - offsetX - this.screenMarginX, this.screenMarginY - offsetY ) );

      // Place the value panel to the right of the toggle panel
      this.valuePanel.top = this.togglePanel.top;
      this.valuePanel.right = this.togglePanel.left - this.controlPanelsHorizontalSpacing;

      // Use relative position of the toggle panel to place the selector
      this.fallingObjectSelectorNode.top = this.togglePanel.bottom + this.controlPanelsVerticalSpacing;
      this.fallingObjectSelectorNode.centerX = this.togglePanel.centerX;
      this.fallingObjectSelectorParent.centerX = this.fallingObjectSelectorNode.centerX;
      this.fallingObjectSelectorParent.top = this.fallingObjectSelectorNode.top + this.fallingObjectSelectorNode.panelOptions.yMargin;

      // Use the relative position of the selector to place the control buttons
      this.controlButtons.top = this.fallingObjectSelectorNode.bottom + this.controlPanelsVerticalSpacing;
      this.controlButtons.centerX = this.fallingObjectSelectorNode.centerX;

      // Place free body diagram in center-left of the screen
      this.freeBodyDiagram.left =  -offsetX + this.screenMarginX;
      this.freeBodyDiagram.centerY = ( -offsetY + ( height / scale - offsetY ) ) / 2;

      // Place the PVAGraphs just to the right of the freeBodyDiagram
      this.pvaGraphs.centerY = this.freeBodyDiagram.centerY;
      this.pvaGraphs.left = this.freeBodyDiagram.right + this.graphsHorizontalSpacing;

      // Update the visible bounds of the screen view based on our previous calculations
      this.visibleBoundsProperty.set( new Bounds2( -offsetX, -offsetY, width / scale - offsetX, height / scale - offsetY ) );
    },

    /**
     * Reset the elements contained in the screen view
     */
    reset: function() {
      // Most of the items on the screen view will be reset when the model properties are reset, since they are linked
      // Some elements however have their own reset methods which need to be called.
      this.movingBackground.reset();
      this.pvaGraphs.reset();
    }

  } );

} );