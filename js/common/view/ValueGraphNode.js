// Copyright 2018, University of Colorado Boulder

/**
 * Node for a ValueGraph that plots an Axon property over time
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the ValueGraphNode.
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to pull total fall time property
   * @param {string} name - name of the graph
   * @param {Object} targetValueGetter - function used to retrieve the data value to be plotted on the graph
   * @param {string} lineColor - color of the line to plot on the graph (rbg formatted, name of a color, etc.)
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {number} maxHeight - max height of the free body diagram panel
   */
  function ValueGraphNode( fallingObjectsModel, name, targetValueGetter, lineColor, maxWidth, maxHeight ) {

    // Call the super, grab reference to self
    Node.call( this );
    var self = this;

    // Store the getter for our targetValue
    // @public
    this.getTargetValue = targetValueGetter;

    // Define where the origin of the graph lies (VG_RELATIVE_ORIGIN is relative to the top left corner of the background rectangle)
    this.graphOrigin = FallingObjectsConstants.VG_RELATIVE_ORIGIN;

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Determine max plot area
    var maxPlotHeight = backgroundRectangle.getHeight() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.y;
    var maxPlotWidth = backgroundRectangle.getWidth() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.x;

    // Create a ValueGraphModel that will be used to hold our data
    this.valueGraphModel = new ValueGraphModel( maxPlotWidth, maxPlotHeight );

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      this.graphOrigin, this.valueGraphModel.timeScaleProperty, this.valueGraphModel.valueScaleProperty
    );

    // Construct our axis lines
    var valueAxis = new Line(
      this.graphOrigin.x, this.graphOrigin.y, this.graphOrigin.x, this.graphOrigin.y + maxPlotHeight,
      FallingObjectsConstants.VG_AXIS_LINE_OPTIONS
    );
    var timeAxis = new Line(
      this.graphOrigin.x, this.graphOrigin.y, this.graphOrigin.x + maxPlotWidth, this.graphOrigin.y,
      FallingObjectsConstants.VG_AXIS_LINE_OPTIONS
    );

    // Data plot is drawn using a Shape object, so we need to construct a Path object that will
    // do the work of displaying it on the screen
    // Pull default options from constants
    var dataPlotNodeOptions = _.extend( {
      stroke: lineColor
    }, FallingObjectsConstants.VG_DATA_PLOT_NODE_OPTIONS );
    // Create a Path node that will draw the Shape- Path.setShape will be called in resetPlot
    this.dataPlotNode = new Path( null, dataPlotNodeOptions );

    // Initialize out Plot
    this.resetPlot();  // this is defined in the inherit call

    // TODO: Axis
    // TODO: Axis scale changes
    // TODO: Make sure the reset method is called in PVAGraph
    // Frequency at which to update the graph
    var updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;
    // Add a link onto the time property in the model to update our plot
    fallingObjectsModel.totalFallTimeProperty.lazyLink( function( totalFallTime ) {

      // Check if its time for us to update
      if ( totalFallTime - self.valueGraphModel.lastUpdateTimeProperty.get() > updateFrequency ) {

        // Get the new value to plot
        var newVal = this.getTargetValue * -1;  // Inverse polarity so positive values plot up the screen instead of down
        var newDataPoint = new Vector2( totalFallTime, newVal );

        // If our new value is greater than the bounds of the graph, then change the scale and redraw
        if ( newVal > maxValue ) {
          // Incrementing the max value will also propagate a change onto the scale
          self.valueGraphModel.incrementMaxValue();

          // Modify our transform to use the new scale
          // In a offsetXYScale mapping transform, the yScale is stored in m11 in the transformation matrix
          // See ModelViewTransform2.createOffsetXYScaleMapping and Matrix3.affine
          self.modelViewTransform.matrix.set11( valueScale );
        }

        // If we have run out of space on the X Axis, then change scale and redraw
        if ( totalFallTime > maxTime ) {
          // Incrementing the max time will also propagate a change onto the scale
          self.valueGraphModel.incrementMaxTime();

          // Modify our transform to use the new scale
          // The xScale is stored in m00
          self.modelViewTransform.matrix.set00( timeScale );
        }

        // After updating our scales, push new data point so it can be plotted
        self.valueGraphModel.dataPointsProperty.get().push( newDataPoint );

        // Set lastUpdateTime
        self.valueGraphModel.lastUpdateTimeProperty.set( totalFallTime );
      }

    } );

    // Now from within the context of the ValueGraphNode, create property links that will plot our data
    // Create a property link to replot the graph when needed
    this.valueGraphModel.replotGraphProperty.lazyLink( function( replotGraph ) {

      if ( replotGraph ) {
        // Grab a reference to the data points so we don't have to keep calling the getter
        var dataPoints = self.valueGraphModel.dataPointsProperty.get();

        // Loop through all the points and plot
        for ( var i = 0; i < dataPoints.length; i++ ) {
          self.plotPoint( dataPoints[ i] );
        }
      }
    } )

    // Create a property link to draw the last point pushed into our data points array
    this.valueGraphModel.dataPointsProperty.lazyLink( function( dataPoints ) {
       // This function will only plot the last data point added
       self.plotPoint( dataPoints[ dataPoints.length - 1] );
     } );


    // Set children
    this.addChild( backgroundRectangle );
    this.addChild( this.dataPlotNode );
    this.addChild( valueAxis );
    this.addChild( timeAxis );

  }

  fallingObjects.register( 'ValueGraphNode', ValueGraphNode );

  // ValueGraphNode still needs to inherit from its super
  return inherit( Node, ValueGraphNode, {

    /**
     * Reset the ValueGraph entirely, both the Node and the Model
     */
    reset: function() {
      this.valueGraphModel.reset();
      this.resetPlot();
    }

    /**
     * Reset plotDataShape to reset our plot, as the shape holds the data points, and reset our scales
     */
    resetPlot: function() {

      // if defined, then dispose
      if ( this.plotDataShape ) {
        this.plotDataShape.dispose();
      }
      // create a new shape and move it to the origin
      this.plotDataShape = new Shape();
      this.plotDataShape.moveToPoint( this.graphOrigin );
      this.dataPlotNode.setShape( this.plotDataShape );

    },

    /**
     * Plots a point on the graph
     * @param {Vector2} newPoint - new point to plot on the graph
     */
    plotPoint: function( newPoint ) {
      // Convert the point from model to view coordinates, and then plot
      this.plotDataShape.lineToPoint( this.modelViewTransform.modelToViewXY( newPoint.x, newPoint.y ) );
    }

  } );

} );