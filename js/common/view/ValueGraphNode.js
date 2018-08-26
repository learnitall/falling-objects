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

    // Grab reference to the model
    this.fallingObjectsModel = fallingObjectsModel;

    // Store the getter for our targetValue
    // @public
    this.getTargetValue = targetValueGetter;

    // Define where the top left bound of the graph lies (VG_TOP_LEFT_BOUND is relative to the top left corner of the background rectangle)
    this.graphTopLeftBound = FallingObjectsConstants.VG_TOP_LEFT_BOUND;

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Determine max plot area
    var maxPlotHeight = backgroundRectangle.getHeight() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.y - this.graphTopLeftBound.y;
    var maxPlotWidth = backgroundRectangle.getWidth() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.x - this.graphTopLeftBound.x;

    // Create a ValueGraphModel that will be used to hold our data
    this.valueGraphModel = new ValueGraphModel( maxPlotWidth, maxPlotHeight );

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = null;  // will be set below
    // Have it update with the origin's location percentage
    this.valueGraphModel.originLocPercentProperty.link( function( locPercent ) {
      self.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2(
          self.graphTopLeftBound.x,
          // Starting at the top left bound, then translate depending on our locPercent
          // locPercent is relative to the bottom of the graph
          // MIN -------------ORIGIN ------------- MAX
          // <----------------locPercent * maxPlotHeight
          // <-----------------maxPlotHeight--------->
          self.graphTopLeftBound.y + ( maxPlotHeight - ( maxPlotHeight * locPercent ) )
        ),
        self.valueGraphModel.timeScaleProperty.get(),
        self.valueGraphModel.valueScaleProperty.get()
      );
    } );

    // Construct labels for our axis
    var axisLabelFont = new PhetFont( { size: FallingObjectsConstants.VG_AXIS_LABEL_FONT_SIZE } );
    this.axisLabelPadding = FallingObjectsConstants.VG_AXIS_LABEL_PADDING;

    /**
     * Generate a new label on our axis
     *
     * @param {number} maxLabelSize - Max size of the label. If yAxis is true, then interpreted as maxWidth, otherwise as maxHeight
     * @param {NumberProperty} axisLengthProperty - Property that points to the length this label resides on
     * @param {number} locPercent - Location of the label on the axis as a decimal percentage (i.e. 0.25 represents fourth of the way down the axis)
     * @param {boolean} yAxis - If true, then the label will be formatted for use on the yAxis, otherwise formatted for use on the xAxis
     */
    var genAxisLabel = function( maxLabelSize, axisLengthProperty, locPercent, yAxis ) {

      var labelOptions;
      if ( yAxis ) {
        labelOptions = { font: axisLabelFont, maxWidth: maxLabelSize };
      } else {
        labelOptions = { font: axisLabelFont, maxHeight: maxLabelSize };
      }

      // The label's value will be updated shortly, set to empty string for now
      var newLabel = new Text( '', labelOptions );

      // Create a link to update axis label when the length of the axis changes
      axisLengthProperty.link( function( axisLength ) {

        // Multiply total axis length by our location percentage
        var labelVal = Math.abs( axisLength.getLength() * locPercent );

        // Normalize the labelVal
        if ( yAxis ) {

          // First determine if we are above or below the origin
          // (distinction between being at the origin and above it doesn't matter)
          var belowOrigin = self.valueGraphModel.originLocPercentProperty.get() > locPercent;

          if ( belowOrigin ) {

            // Need to normalize our label's value
            // MIN --------------- 0 ------- MAX
            // --------labelVal-----------------
            // labelVal right now measures distance from MIN to labelVal, but we instead want
            // distance from origin
            labelVal = ( Math.abs( axisLength.min ) - labelVal ) * -1;
          } else {

            // Need to normalize our label's value, same deal as in the last block
            labelVal = ( labelVal - Math.abs( axisLength.min ) );
          }
        }

        newLabel.setText( StringUtils.fillIn( pattern0LabelString, { label: labelVal } ) );
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
      var axisLengthProperty;
      if ( yAxis ) {
        axisLength = maxPlotHeight;
        axisLengthProperty = self.valueGraphModel.valueLengthProperty;
      } else {
        axisLength = maxPlotWidth;
        axisLengthProperty = self.valueGraphModel.timeLengthProperty;
      }

      // Determine the base locPercent that we can scale and pass to genAxisLabel
      var baseLocPercent = 1 / axisLabelCount;
      // Determine the maxWidth or maxHeight of the label (interpretation done though yAxis param)
      // Each label is constructed like so: ( edge of graph : padding : label : padding : axis )
      // We want to find the size of 'label' above, so take the length between 'edge of graph' and 'axis' and then
      // subtract 'padding'.
      var maxLabelSize = ( yAxis ? self.graphTopLeftBound.x : self.graphTopLeftBound.y ) - ( 2 * self.axisLabelPadding );

      // Create some nodes to hold our labels and lines
      var axisLabelNode = new Node();
      var graphLineNode = new Node();

      // Create some helper variables
      var locPercent;
      var newLabel;
      var newGraphLine;
      var pos;
      for ( var i = 0; i < axisLabelCount + 1; i++ ) {  // add one line for the top and left bound axes

        // Determine our locPercent
        locPercent = baseLocPercent * i;

        // Create our label
        newLabel = genAxisLabel( maxLabelSize, axisLengthProperty, locPercent, yAxis );

        // Get position of the label in view coordinates
        // pos is relative to the minimum value on the graph, or relative to the axisLength
        if ( yAxis ) {
          pos = axisLength - ( axisLength * locPercent );
        } else {
          pos = axisLength * locPercent;
        }

        if ( yAxis ) {
          // Position the label
          newLabel.setCenterY( pos );

          // Create the graph line and position
          newGraphLine = new Line( 0, 0, maxPlotWidth, 0, FallingObjectsConstants.VG_GRAPH_LINE_OPTIONS );
          newGraphLine.setCenterY( pos );
          graphLineNode.addChild( newGraphLine );

        } else {
          // Position the label
          newLabel.setCenterX( pos );

          // Create the graph line and position
          newGraphLine = new Line( 0, 0, 0, maxPlotHeight, FallingObjectsConstants.VG_GRAPH_LINE_OPTIONS );
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
        var newVal = self.getTargetValue();
        // Inverse polarity so positive values plot up the screen instead of down
        var newDataPoint = new Vector2( totalFallTime, newVal * -1 );

        // If our new value is greater than the bounds of the graph, then change the scale and redraw
        var updateScale;
        // Increment until our new value will fit
        while ( newVal > self.valueGraphModel.valueLengthProperty.get().max ) {

          // Incrementing the max value will also propagate a change onto the scale
          self.valueGraphModel.incrementMaxValue( newVal );
          // Signal to update the scale
          updateScale = true;

        }

        while ( newVal < self.valueGraphModel.valueLengthProperty.get().min ) {

          // Incrementing the min value will also propagate a change onto the scale
          self.valueGraphModel.incrementMinValue();
          // Signal to update the scale
          updateScale = true;

        }

        // Update the scale if needed
        if ( updateScale ) {
          // Modify our transform to use the new scale
          // In a offsetXYScale mapping transform, the yScale is stored in m11 in the transformation matrix
          // See ModelViewTransform2.createOffsetXYScaleMapping and Matrix3.affine
          self.modelViewTransform.matrix.set11( self.valueGraphModel.valueScaleProperty.get() );

          // Signal a replot
          self.valueGraphModel.replotGraphProperty.set( true );
        }

        // If we have run out of space on the X Axis, then change scale and redraw
        if ( totalFallTime > self.valueGraphModel.timeLengthProperty.get().max ) {
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

    // Create a property link to replot the graph when needed
    this.valueGraphModel.replotGraphProperty.lazyLink( function( replotGraph ) {

      // Only replot if we are actually displaying the graph
      if ( replotGraph && ( self.fallingObjectsModel.showPVAGraphsProperty.get() === true ) ) {

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
      }

      // Reset the value, even if we didn't need a replot
      self.valueGraphModel.replotGraphProperty.reset();
    } );

    // Create a property link to draw the last point pushed into our data points array
    this.valueGraphModel.dataPointsProperty.lazyLink( function( dataPoints ) {
      // This function will only plot the last data point added
      var dataPoint = dataPoints[ dataPoints.length - 1 ];
      // Only plot if we have a data point and the graph is being shown
      if ( dataPoint && self.fallingObjectsModel.showPVAGraphsProperty.get() ) {
        self.plotPoint( dataPoint );
      }
    } );


    // Set children
    this.addChild( backgroundRectangle );
    this.addChild( this.timeAxisLabelNode );
    this.addChild( this.valueAxisLabelNode );
    this.addChild( this.valueGraphLinesNode );
    this.addChild( this.timeGraphLinesNode );
    this.addChild( this.dataPlotNode );

    // Create a link to update the graph when it is shown
    this.fallingObjectsModel.showPVAGraphsProperty.link( function( showPVAGraphsValue ) {
      if ( showPVAGraphsValue ) {
        // When displaying the graph, trigger a replot
        self.valueGraphModel.replotGraphProperty.set( true );
        self.setVisible( true );
      }
      else {
        self.setVisible( false );
      }
    } );

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
        // m02 and m12 hold the XY offset
        this.modelViewTransform.matrix.m02() + this.dataPlotNodeOptions.lineWidth,
        this.modelViewTransform.matrix.m12() + this.dataPlotNodeOptions.lineWidth
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

      this.valueAxisLabelNode.setTop( this.graphTopLeftBound.y - ( this.valueAxisLabelNode.children[ 0 ].getHeight() / 2 ) );
      var self = this;
      this.valueAxisLabelNode.children.forEach( function ( labelNode ) {
        labelNode.setRight( self.graphTopLeftBound.x - self.axisLabelPadding );
      } );

      this.valueGraphLinesNode.setLeftTop( this.graphTopLeftBound );

      this.timeAxisLabelNode.setLeftBottom( this.graphTopLeftBound );
      this.timeGraphLinesNode.setLeftTop( this.graphTopLeftBound );

    }

  } );

} );