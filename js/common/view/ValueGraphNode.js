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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

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

    // Store the getter for our targetValue
    // @public
    this.getTargetValue = targetValueGetter;

    // Define where the origin of the graph lies (VG_RELATIVE_ORIGIN is relative to the top left corner of the background rectangle)
    this.graphOrigin = FallingObjectsConstants.VG_RELATIVE_ORIGIN;

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Determine max plot area
    var maxPlotHeight = backgroundRectangle.getHeight() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.y - this.graphOrigin.x;
    var maxPlotWidth = backgroundRectangle.getWidth() - FallingObjectsConstants.VG_PLOT_EDGE_PADDING.x - this.graphOrigin.y;

    // Create a ValueGraphModel that will be used to hold our data
    this.valueGraphModel = new ValueGraphModel( maxPlotWidth, maxPlotHeight );

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
      this.graphOrigin, this.valueGraphModel.timeScaleProperty.get(), this.valueGraphModel.valueScaleProperty.get()
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

    // Construct labels for our axis
    var axisLabelFont = new PhetFont( { size: FallingObjectsConstants.VG_AXIS_LABEL_FONT_SIZE } );
    var axisLabelPadding = FallingObjectsConstants.VG_AXIS_LABEL_PADDING;

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
      return ( yAxis ? self.graphOrigin.x : self.graphOrigin.y ) - ( 2 * axisLabelPadding );
    };

    // These are used in the below two functions
    var paddingStrut;
    var containerBox;

    /**
     * Generate a new label on our axis
     *
     * @param {number} maxLabelSize - Max size of the label. If yAxis is true, then interpreted as maxWidth, otherwise as maxHeight
     * @param {number} locPercent - Location of the label on the axis as a decimal percentage (i.e. 0.25 represents fourth of the way down the axis)
     * @param {boolean} yAxis - If true, then the label will be formatted for use on the yAxis, otherwise formatted for use on the xAxis
     */
    var genAxisLabel = function( maxLabelSize, locPercent, yAxis ) {

      // Labels on the yAxis use different Struts and Boxes than labels on the xAxis to add in the padding
      var labelOptions;
      var axisLengthProperty;
      if ( yAxis ) {
        paddingStrut = HStrut;
        containerBox = HBox;
        labelOptions = { font: axisLabelFont, maxWidth: maxLabelSize };
        axisLengthProperty = self.valueGraphModel.maxValueProperty;
      } else {
        paddingStrut = VStrut;
        containerBox = VBox;
        labelOptions = { font: axisLabelFont, maxHeight: maxLabelSize };
        axisLengthProperty = self.valueGraphModel.maxTimeProperty;
      }

      // The label's value will be updated shortly, set to empty string for now
      var newLabel = new Text( '', labelOptions );

      // Create a link to update axis label when the length of the axis changes
      axisLengthProperty.link( function( axisLength ) {
        // Multiply total axis length by our location percentage
        newLabel.setText( StringUtils.fillIn( pattern0LabelString, axisLength * locPercent ) );
      } );

      // Wrap the label in padding and return
      return new containerBox( {
        align: 'center',
        children: [
          new paddingStrut( axisLabelPadding ),
          newLabel,
          new paddingStrut( axisLabelPadding )
        ]
      } );
    };

    /**
     * Generate axis labels for a whole axis, returning a Box that contains them.
     *
     * @param {number} axisLabelCount - Number of labels to create on the axis
     * @param {boolean} yAxis - If true, then creates axis labels for the yAxis, otherwise for the xAxis
     */
    var genAxisLabels = function( axisLabelCount, yAxis ) {

      var axisLength;
      if ( yAxis ) {
        paddingStrut = VStrut;
        containerBox = VBox;
        axisLength = maxPlotHeight;
      } else {
        paddingStrut = HStrut;
        containerBox = HBox;
        axisLength = maxPlotWidth;
      }

      // Determine the base locPercent that we can scale and pass to genAxisLabel
      var baseLocPercent = 1 / axisLabelCount;
      // Determine the maxWidth or maxHeight of the label (interpretation done though yAxis param)
      var maxLabelSize = getMaxLabelSize( yAxis );
      // Calculate the space in between each axis label (total space - space taken up by labels / number of needed padding sections)
      var labelSpacing = ( axisLength - ( axisLabelCount * maxLabelSize ) ) / ( axisLabelCount - 1 );

      var axisLabelBox = new containerBox( { align: 'center' } );
      for ( var i = 0; i < axisLabelCount; i++ ) {

        // Create the label and add it to the box
        axisLabelBox.addChild( genAxisLabel( maxLabelSize, baseLocPercent * i, yAxis ) );

        // Add padding if we aren't on the last label
        if ( i !== ( axisLabelCount - 1 ) ) {
          axisLabelBox.addChild( new paddingStrut( labelSpacing ) );
        }

      }

      return axisLabelBox;

    };

    // Now create our axis labels and position
    var axisLabelCount = FallingObjectsConstants.VG_AXIS_LABEL_COUNT;
    var valueAxisLabelBox = genAxisLabels( axisLabelCount, true );
    valueAxisLabelBox.setRightTop( this.graphOrigin );
    var timeAxisLabelBox = genAxisLabels( axisLabelCount, false );
    timeAxisLabelBox.setLeftBottom( this.graphOrigin );

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

        // Reset
        self.valueGraphModel.replotGraphProperty.reset();
      }
    } );

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
    this.addChild( valueAxisLabelBox );
    this.addChild( timeAxisLabelBox );

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