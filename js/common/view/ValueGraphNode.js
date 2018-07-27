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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ValueGraphModel = require( 'FALLING_OBJECTS/common/model/ValueGraphModel' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var pattern0LabelString = require( 'string!FALLING_OBJECTS/pattern.0Label' );
  var pattern0LabelWithNegativeString = require( 'string!FALLING_OBJECTS/pattern.0LabelWithNegative' );

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
    var maxPlotHeight = backgroundRectangle.getHeight() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.y - this.graphOrigin.y;
    var maxPlotWidth = backgroundRectangle.getWidth() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.x - this.graphOrigin.x;

    // Create a ValueGraphModel that will be used to hold our data
    this.valueGraphModel = new ValueGraphModel( maxPlotWidth, maxPlotHeight );

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      this.graphOrigin, this.valueGraphModel.timeScaleProperty.get(), this.valueGraphModel.valueScaleProperty.get()
    );

    // Construct labels for our axis
    var axisLabelFont = new PhetFont( { size: FallingObjectsConstants.VG_AXIS_LABEL_FONT_SIZE } );
    this.axisLabelPadding = FallingObjectsConstants.VG_AXIS_LABEL_PADDING;

    /**
     * Determine the maxWidth or maxHeight of a label on the axis, based on padding parameters and the
     * location of the graph's origin
     *
     * @param {boolean} yAxis - if True, then return maxWidth parameter to be passed into a Text node, otherwise return maxHeight
     */
    var getMaxLabelSize = function( yAxis ) {

      // Each label is constructed like so: ( edge of graph : padding : label : padding : axis )
      // We want to find the size of 'label' above, so take the length between 'edge of graph' and 'axis' and then
      // subtract 'padding'.
      return ( yAxis ? self.graphOrigin.x : self.graphOrigin.y ) - ( 2 * self.axisLabelPadding );
    };

    /**
     * Generate a new label on our axis
     *
     * @param {number} maxLabelSize - Max size of the label. If yAxis is true, then interpreted as maxWidth, otherwise as maxHeight
     * @param {NumberProperty} axisMaxLengthProperty - Property that points to the max length this label resides on
     * @param {number} locPercent - Location of the label on the axis as a decimal percentage (i.e. 0.25 represents fourth of the way down the axis)
     * @param {boolean} yAxis - If true, then the label will be formatted for use on the yAxis, otherwise formatted for use on the xAxis
     */
    var genAxisLabel = function( maxLabelSize, axisMaxLengthProperty, locPercent, yAxis ) {

      var labelOptions;
      if ( yAxis ) {
        labelOptions = { font: axisLabelFont, maxWidth: maxLabelSize };
      } else {
        labelOptions = { font: axisLabelFont, maxHeight: maxLabelSize };
      }

      // The label's value will be updated shortly, set to empty string for now
      var newLabel = new Text( '', labelOptions );

      // Create a link to update axis label when the length of the axis changes
      axisMaxLengthProperty.link( function( axisLength ) {
        // Multiply total axis length by our location percentage
        var pattern = yAxis ? pattern0LabelWithNegativeString : pattern0LabelString;
        newLabel.setText( StringUtils.fillIn( pattern, { label: Math.round( axisLength * locPercent ) } ) );
      } );

      return newLabel;
    };

    /**
     * Generate and position axis labels, axes, and graph lines. Returning a list containing:
     * [ label container node, axes and graph lines container node ]
     *
     * @param {number} axisLabelCount - Number of labels to create on the axis
     * @param {boolean} yAxis - If true, then creates axis labels for the yAxis, otherwise for the xAxis
     */
    var genAxisStuff = function( axisLabelCount, yAxis ) {

      var axisLength;
      var axisMaxLengthProperty;
      if ( yAxis ) {
        axisLength = maxPlotHeight;
        axisMaxLengthProperty = self.valueGraphModel.maxValueProperty;
      } else {
        axisLength = maxPlotWidth;
        axisMaxLengthProperty = self.valueGraphModel.maxTimeProperty;
      }

      // Determine the base locPercent that we can scale and pass to genAxisLabel
      var baseLocPercent = 1 / axisLabelCount;
      // Determine the maxWidth or maxHeight of the label (interpretation done though yAxis param)
      var maxLabelSize = getMaxLabelSize( yAxis );

      // Create some nodes to hold our labels and lines
      var axisLabelNode = new Node();
      var graphLineNode = new Node();

      // Create some helper variables
      var locPercent;
      var newLabel;
      var newGraphLine;
      var newGraphLineOptions;
      var pos;
      for ( var i = 0; i < axisLabelCount + 1; i++ ) {  // The first axis label will be 0, then axisLabelCount number of labels will follow

        // Create the label and add as child
        locPercent = baseLocPercent * i;
        newLabel = genAxisLabel( maxLabelSize, axisMaxLengthProperty, locPercent, yAxis );

        // Get position of the label
        pos = axisLength * locPercent;

        // Get the appropriate graph line options
        if ( i === 0 ) {
          newGraphLineOptions = FallingObjectsConstants.VG_AXIS_LINE_OPTIONS;
        } else {
          newGraphLineOptions = FallingObjectsConstants.VG_GRAPH_LINE_OPTIONS;
        }

        if ( yAxis ) {
          // Position the label
          newLabel.setCenterY( pos );

          // Create the graph line and position
          newGraphLine = new Line( 0, 0, maxPlotWidth, 0, newGraphLineOptions );
          newGraphLine.setCenterY( pos );
          graphLineNode.addChild( newGraphLine );
        } else {
          // Position the label
          newLabel.setCenterX( pos );

          // Create the graph line and position
          newGraphLine = new Line( 0, 0, 0, maxPlotHeight, newGraphLineOptions );
          newGraphLine.setCenterX( pos );
          graphLineNode.addChild( newGraphLine );
        }

        axisLabelNode.addChild( newLabel );
      }

      return [ axisLabelNode, graphLineNode ];

    };

    // Now create our axis labels and position
    var axisLabelCount = FallingObjectsConstants.VG_AXIS_LABEL_COUNT;
    // Get the value axis
    var valueAxisStuff = genAxisStuff( axisLabelCount, true );
    this.valueAxisLabelNode = valueAxisStuff[ 0 ];
    this.valueGraphLinesNode = valueAxisStuff[ 1 ];
    // Get the time axis
    var timeAxisStuff = genAxisStuff( axisLabelCount, false );
    this.timeAxisLabelNode = timeAxisStuff[ 0 ];
    this.timeGraphLinesNode = timeAxisStuff[ 1 ];

    // Lay it all out- this is defined in the call to inherit
    this.layoutAxes();

    // Data plot is drawn using a Shape object, so we need to construct a Path object that will
    // do the work of displaying it on the screen
    // Pull default options from constants
    this.dataPlotNodeOptions = _.extend(
      FallingObjectsConstants.VG_DATA_PLOT_NODE_OPTIONS, {
        stroke: lineColor
      }
    );
    // Create a Path node that will draw the Shape- Path.setShape will be called in resetPlot
    this.dataPlotNode = new Path( null, this.dataPlotNodeOptions );

    // Initialize out Plot
    this.resetPlot();  // this is defined in the inherit call

    // Frequency at which to update the graph
    var updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;
    // Add a link onto the time property in the model to update our plot
    fallingObjectsModel.totalFallTimeProperty.lazyLink( function( totalFallTime ) {

      // Check if its time for us to update
      if ( totalFallTime - self.valueGraphModel.lastUpdateTimeProperty.get() > updateFrequency ) {

        // Get the new value to plot
        var newVal = self.getTargetValue() * -1;  // Inverse polarity so positive values plot up the screen instead of down
        var newDataPoint = new Vector2( totalFallTime, newVal );

        // If our new value is greater than the bounds of the graph, then change the scale and redraw
        if ( newVal > self.valueGraphModel.maxValueProperty.get() ) {
          // Incrementing the max value will also propagate a change onto the scale
          self.valueGraphModel.incrementMaxValue();

          // Modify our transform to use the new scale
          // In a offsetXYScale mapping transform, the yScale is stored in m11 in the transformation matrix
          // See ModelViewTransform2.createOffsetXYScaleMapping and Matrix3.affine
          self.modelViewTransform.matrix.set11( self.valueGraphModel.valueScaleProperty.get() );

          // Signal a replot
          self.valueGraphModel.replotGraphProperty.set( true );
        }

        // If we have run out of space on the X Axis, then change scale and redraw
        if ( totalFallTime > self.valueGraphModel.maxTimeProperty.get() ) {
          // Incrementing the max time will also propagate a change onto the scale
          self.valueGraphModel.incrementMaxTime();

          // Modify our transform to use the new scale
          // The xScale is stored in m00
          self.modelViewTransform.matrix.set00( self.valueGraphModel.timeScaleProperty.get() );

          // Signal a replot
          self.valueGraphModel.replotGraphProperty.set( true );
        }

        // After updating our scales, push new data point so it can be plotted
        var dataPoints = self.valueGraphModel.dataPointsProperty.get().slice();
        dataPoints.push( newDataPoint );
        self.valueGraphModel.dataPointsProperty.set( dataPoints );
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

        // Reset the plot
        self.resetPlot();

        // Loop through all the points and plot
        for ( var i = 0; i < dataPoints.length; i++ ) {
          self.plotPoint( dataPoints[ i] );
        }

        // Reposition the axis labels
        self.layoutAxes();

        // Reset
        self.valueGraphModel.replotGraphProperty.reset();
      }
    } );

    // Create a property link to draw the last point pushed into our data points array
    this.valueGraphModel.dataPointsProperty.lazyLink( function( dataPoints ) {
      // This function will only plot the last data point added
      var dataPoint = dataPoints[ dataPoints.length - 1 ];
      if ( dataPoint ) {
        self.plotPoint( dataPoint );
      }
    } );


    // Set children
    this.addChild( backgroundRectangle );
    this.addChild( this.valueAxisLabelNode );
    this.addChild( this.timeAxisLabelNode );
    this.addChild( this.valueGraphLinesNode );
    this.addChild( this.timeGraphLinesNode );
    this.addChild( this.dataPlotNode );

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
    },

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
      this.plotDataShape.moveTo(
        this.graphOrigin.x + this.dataPlotNodeOptions.lineWidth,
        this.graphOrigin.y + this.dataPlotNodeOptions.lineWidth
      );
      this.dataPlotNode.setShape( this.plotDataShape );

      // relayout the axes
      this.layoutAxes();

    },

    /**
     * Plots a point on the graph
     * @param {Vector2} newPoint - new point to plot on the graph
     */
    plotPoint: function( newPoint ) {
      // Convert the point from model to view coordinates, and then plot
      this.plotDataShape.lineToPoint( this.modelViewTransform.modelToViewXY( newPoint.x, newPoint.y ) );
    },

    /**
     * Layout the axes (includes the labels and graph lines) on the graph
     */
    layoutAxes: function() {

      // The methodology for laying this all out was determine empirically

      this.valueAxisLabelNode.setTop( this.graphOrigin.y - ( this.valueAxisLabelNode.children[ 0 ].getHeight() / 2 ) );
      var self = this;
      this.valueAxisLabelNode.children.forEach( function ( labelNode ) {
        labelNode.setRight( self.graphOrigin.x - self.axisLabelPadding );
      } );

      this.valueGraphLinesNode.setLeftTop( this.graphOrigin );

      this.timeAxisLabelNode.setLeftBottom( this.graphOrigin );
      this.timeGraphLinesNode.setLeftTop( this.graphOrigin );

    }

  } );

} );