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
   * @param {string} name - name of the graph
   * @param {NumberProperty} valueProperty - value to graph with time
   * @param {string} lineColor - color of the line to plot on the graph (rbg formatted, name of a color, etc.)
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {number} maxHeight - max height of the free body diagram panel
   */
  function ValueGraph( name, valueProperty, lineColor, maxWidth, maxHeight ) {

    // Call the super
    Node.call( this );

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Define these here for convenience and clarity
    var graphOrigin = new Vector2(  // VG_RELATIVE_ORIGIN is relative to bottom left corner of the background rectangle
      FallingObjectsConstants.VG_RELATIVE_ORIGIN.x,
      backgroundRectangle.getHeight() - FallingObjectsConstants.VG_RELATIVE_ORIGIN.y
    );
    var timeScale = maxWidth / FallingObjectsConstants.VG_MAX_TIME_INTERVAL;  // maps model seconds onto the graph's X axis
    /*
     VG_MAX_VALUE_INTERVAL describes the max amount of valueProperty units that can be plotted on the Y axis, until the
     axis is extended by another VG_MAX_TIME_INTERVAL. For instance, if VG_MAX_VALUE_INTERVAL is 3, and the point
     (1, 3) is plotted, then the y axis bounds will be increased by 3. This process works in reverse as well
    */
    var valueScale = maxHeight / FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;   // maps model valueProperty onto the graph's Y axis

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( graphOrigin, timeScale, valueScale );

    // Construct a Shape and Path object that will hold our data plot
    this.plotDataShape = new Shape();
    this.plotDataShape.moveToPoint( graphOrigin );

    var dataPlotNodeOptions = _.extend( {
      fill: lineColor,
      stroke: lineColor
    }, FallingObjectsConstants.VG_DATA_PLOT_NODE_OPTIONS );
    this.dataPlotNode = new Path( this.plotDataShape, dataPlotNodeOptions);

    // Set children
    this.addChild( backgroundRectangle );
    this.addChild( this.dataPlotNode );

  }

  // Make sure ValueGraph still inherits from its super
  ValueGraph = inherit( Node, ValueGraph );


  function PVAGraphs( ) {

    // Call the super
    Node.call( this );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );