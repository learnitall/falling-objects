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

    // Determine max plot area
    var maxPlotHeight = backgroundRectangle.getHeight() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.y;
    var maxPlotWidth = backgroundRectangle.getWidth() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.x;

    // Max amount of seconds that can be plotted on x axis at a time
    var maxTimeInterval = FallingObjectsConstants.VG_MAX_TIME_INTERVAL;
    // Maps model seconds onto the graph's X axis
    var timeScale = maxPlotWidth / maxTimeInterval;
    // Max amount of valueProperty units that can be plotted on the y axis at a time before an adjustment happens
    var maxValueInterval = FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;
    // Maps model valueProperty onto the graph's Y axis
    var valueScale = maxPlotHeight / maxValueInterval;

    // Frequency at which to update the graph
    var updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( this.graphOrigin, timeScale, valueScale );

    // Construct a Path object that will hold our data plot
    // The Shape object is stored in this.plotDataShape, and is initialized below
    // Pull default options from constants
    var dataPlotNodeOptions = _.extend( {
      stroke: lineColor
    }, FallingObjectsConstants.VG_DATA_PLOT_NODE_OPTIONS );
    // Create a Path node that will draw the shape
    this.dataPlotNode = new Path( null, dataPlotNodeOptions );

    // Add a link onto the time property in the model to update our plot
    // TODO: Axis
    // TODO: Axis scale changes
    var lastUpdateTime = 1;  // holds the last time our graph was updated, set initially to one so we trigger a reset (see the if statement below)
    var maxValue;  // holds the max value that can be plotted (set initially to the maxValueInterval)
    // Every time the valueProperty extends past the top of the graph, this value will be incremented by one
    // In context, length of y axis is calculated using: maxValueInterval * ( 2 ** maxValueIntervalPower )
    var maxValueIntervalPower;
    var maxTime;  // holds the max time that can be plotted on the x axis
    var dataPoints;  // create an array of Vector2's to hold raw data points
    var redrawPlot;  // signals to redraw the whole plot (for instance if a scale changes)
    fallingObjectsModel.totalFallTimeProperty.link( function( totalFallTime ) {

      // If the fallTime has been reset, then reset as well and (re)initialize our helper variables
      if ( totalFallTime < lastUpdateTime ) {
        lastUpdateTime = 0;
        maxValue = maxValueInterval;
        maxValueIntervalPower = 0;
        maxTime = maxTimeInterval;
        dataPoints = [];
        redrawPlot = false;
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
        var newDataPoint = new Vector2( totalFallTime, newVal );
        dataPoints.push( newDataPoint );

        // If our new value is greater than the bounds of the graph, then change the scale and redraw
        if ( newVal > maxValue ) {
          maxValueIntervalPower++;
          maxValue = maxValueInterval * ( Math.pow( 2, maxValueIntervalPower ) );
          valueScale = maxPlotHeight / maxValue;
          // Modify our transform to use the new scale
          // In a offsetXYScale mapping transform, the yScale is stored in m11 in the transformation matrix
          // See ModelViewTransform2.createOffsetXYScaleMapping and Matrix3.affine
          self.modelViewTransform.matrix.set11( valueScale );

          // signal to redraw the whole shape
          redrawPlot = true;
        }

        // If we have run out of space on the X Axis, then change scale and redraw
        if ( totalFallTime > maxTime ) {
          // Just increment by adding on another interval, since we now the rate at which time changes stays constant
          maxTime += maxTimeInterval;
          timeScale = maxPlotWidth / maxTime;
          // Modify the transform to use the new scale
          // In a offsetXYScale mapping transform, the xScale is stored in m00 in the transformation matrix
          self.modelViewTransform.matrix.set00( timeScale );

          // signal to redraw the whole shape
          redrawPlot = true;
        }

        // Draw the point(s)
        if ( redrawPlot ) {  // if we need to, redraw the whole plot

          // Reset the shape and redraw
          self.resetPlotDataShape();
          self.dataPlotNode.setShape( self.plotDataShape );
          for ( var i = 0; i < dataPoints.length; i++ ) {
            self.plotDataShape.lineToPoint( self.modelViewTransform.modelToViewXY( dataPoints[ i ].x, dataPoints[ i ].y ) );
          }
          redrawPlot = false;  // make sure we reset

        } else {  // otherwise just plot the new point

          // Convert to view coordinates and plot
          self.plotDataShape.lineToPoint( self.modelViewTransform.modelToViewXY( newDataPoint.x, newDataPoint.y ) );

        }

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

    this.addChild( new ValueGraph( fallingObjectsModel, "test", fallingObjectsModel.selectedFallingObject.positionProperty, 'black', 320, 320, 'y' ) );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );