// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the value graph, which plots the value of a property over time.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull total fall time property
   * @param {string} name - name of the graph
   * @param {NumberProperty} valueProperty - value to graph with time
   * @param {string} lineColor - color of the line to plot on the graph (rbg formatted, name of a color, etc.)
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {number} maxHeight - max height of the free body diagram panel
   * @param {string} valueVectorComp - if the valueProperty is a vector, pass in the name of the component that should be plotted
   */
  function ValueGraph( fallingObjectsModel, name, valueProperty, lineColor, maxWidth, maxHeight, valueVectorComp ) {

    // Call the super and grab reference to self
    Node.call( this );
    var self = this;

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Define where the origin of the graph lies (VG_RELATIVE_ORIGIN is relative to the top left corner of the background rectangle)
    this.graphOrigin = FallingObjectsConstants.VG_RELATIVE_ORIGIN;

    // Maps model seconds onto the graph's X axis
    var timeScale = maxWidth / FallingObjectsConstants.VG_MAX_TIME_INTERVAL;
    // Maps model valueProperty onto the graph's Y axis
    // NOTE: VG_MAX_VALUE_INTERVAL describes the max amount of valueProperty units that can be plotted on the Y axis, until the
    // axis is extended by another VG_MAX_TIME_INTERVAL. When the extension is not needed anymore (i.e. all plotted data
    // has gone below the previously added extension), then it is removed and the axis bounds are changed
    var valueScale = maxHeight / FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;

    // Frequency at which to update the graph
    var updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( this.graphOrigin, timeScale, valueScale );

    // Construct a Shape and Path object that will hold our data plot
    // Call reset to initialize a Shape node (called this.plotDataShape) which will hold data points
    this.resetPlotDataShape();
    // Pull default options from constants
    var dataPlotNodeOptions = _.extend( {
      stroke: lineColor
    }, FallingObjectsConstants.VG_DATA_PLOT_NODE_OPTIONS );
    // Create a Path node that will draw the shape
    this.dataPlotNode = new Path( this.plotDataShape, dataPlotNodeOptions );

    // Add a link onto the time property in the model to update our plot
    // TODO: Axis
    // TODO: Axis scale changes
    // TODO: Proper scaling
    var lastUpdateTime = 0;
    fallingObjectsModel.totalFallTimeProperty.lazyLink( function( totalFallTime ) {

      // If the fallTime has been reset, then reset as well
      if ( totalFallTime < lastUpdateTime ) {
        lastUpdateTime = 0;
        self.resetPlotDataShape();  // reset the shape
        self.dataPlotNode.setShape( self.plotDataShape );  // tell path to draw the fresh shape
      }

      // Check if its time for us to update
      if ( totalFallTime - lastUpdateTime > updateFrequency ) {

        // Get the new value to plot
        var newVal = valueProperty.get();
        if ( newVal.dimension ) {  // if we are working with a vector, pull the appropriate component
          newVal = newVal[ valueVectorComp ];
        }
        newVal *= -1; // Inverse polarity so positive values plot up the screen instead of down

        // Convert to view coordinates and plot
        self.plotDataShape.lineToPoint( self.modelViewTransform.modelToViewXY( totalFallTime, newVal ) );

        // Set lastUpdateTime
        lastUpdateTime = totalFallTime;
      }

    } );

    // Set children
    this.addChild( backgroundRectangle );
    this.addChild( this.dataPlotNode );

  }

  // ValueGraph still needs to inherit from its super
  ValueGraph = inherit( Node, ValueGraph, {

    /**
     * Reset plotDataShape to reset our plot, as the shape holds the data points.
     * After calling, also make a call to dataPlotNode.setShape
     */
    resetPlotDataShape: function( ) {

      // if defined, then dispose
      if ( this.plotDataShape ) {
        this.plotDataShape.dispose();
      }

      // create a new shape and move it to the origin
      this.plotDataShape = new Shape();
      this.plotDataShape.moveToPoint( this.graphOrigin );

    }

  } );

  /**
   * Construct the graphs for Position, Velocity and Acceleration by implementing ValueGraph
   *
   * @param {FallingObjectsModel} fallingObjectsModel
   */
  function PVAGraphs( fallingObjectsModel ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );