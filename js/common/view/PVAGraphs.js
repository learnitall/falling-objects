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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the value graph, which plots the value of a property over time.
   *
   * @param {string} name - name of the graph
   * @param {NumberProperty} valueProperty - value to graph with time
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {number} maxHeight - max height of the free body diagram panel
   */
  function ValueGraph( name, valueProperty, maxWidth, maxHeight ) {

    // Call the super
    Node.call( this );

    // Define these here for convenience and clarity
    var graphOrigin = FallingObjectsConstants.VG_RELATIVE_ORIGIN;  // relative origin of the graph (offset for padding)
    var timeScale = maxWidth / FallingObjectsConstants.VG_MAX_TIME_INTERVAL;  // maps model seconds onto the graph's X axis
    /*
     VG_MAX_VALUE_INTERVAL describes the max amount of valueProperty units that can be plotted on the Y axis, until the
     axis is extended by another VG_MAX_TIME_INTERVAL. For instance, if VG_MAX_VALUE_INTERVAL is 3, and the point
     (1, 3) is plotted, then the y axis bounds will be increased by 3. This process works in reverse as well
    */
    var valueScale = maxHeight / FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;   // maps model valueProperty onto the graph's Y axis

    // Construct the background, using the same options as the free body diagram
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Construct the model-view transform which will translate between the valueProperty and time to the graph on screen
    this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping( graphOrigin, timeScale, valueScale );

    // Set children
    this.addChild( backgroundRectangle );

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