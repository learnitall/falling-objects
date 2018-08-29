// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ValueGraphNode = require( 'FALLING_OBJECTS/common/view/ValueGraphNode' );

  // strings
  var accelerationString = require( 'string!FALLING_OBJECTS/acceleration' );
  var velocityString = require( 'string!FALLING_OBJECTS/velocity' );
  var positionString = require( 'string!FALLING_OBJECTS/position' );
  var mString = require( 'string!FALLING_OBJECTS/m' );
  var msString = require( 'string!FALLING_OBJECTS/ms' );
  var ms2String = require( 'string!FALLING_OBJECTS/ms2' );

  /**
   * Construct the graphs for Position, Velocity and Acceleration by implementing ValueGraph
   *
   * @param {FallingObjectsModel} fallingObjectsModel
   * @param {number} maxWidth - Max width of the PVAGraph node
   * @param {number} maxHeight - Max height of the PVAGraph node
   */
  function PVAGraphs( fallingObjectsModel, maxWidth, maxHeight ) {

    // Call the super
    Node.call( this );

    // Calculate dimensions of each graph- each gets little less than a third of maxHeight
    this.verticalSpacing = FallingObjectsConstants.VG_VERTICAL_SPACING;
    var graphHeight = ( maxHeight - ( 2 * this.verticalSpacing ) ) / 3;
    var graphWidth = maxWidth;

    // Create the acceleration, velocity and position graphs
    this.accelerationGraph = new ValueGraphNode(
      fallingObjectsModel,
      accelerationString,
      'accelerationProperty',
      ms2String,
      FallingObjectsConstants.VG_ACCELERATION_COLOR,
      graphWidth,
      graphHeight
    );

    this.velocityGraph = new ValueGraphNode(
     fallingObjectsModel,
     velocityString,
     'velocityProperty',
     msString,
     FallingObjectsConstants.VG_VELOCITY_COLOR,
     graphWidth,
     graphHeight
    );

    this.positionGraph = new ValueGraphNode(
      fallingObjectsModel,
      positionString,
      'positionProperty',
      mString,
      FallingObjectsConstants.VG_POSITION_COLOR,
      graphWidth,
      graphHeight
    );

    // Do some layout (acceleration on top, then velocity and position to follow)
    this.accelerationGraph.top = 0;
    this.velocityGraph.top = this.accelerationGraph.bottom + this.verticalSpacing;
    this.positionGraph.top = this.velocityGraph.bottom + this.verticalSpacing;

    // Add them all as children
    this.addChild( this.accelerationGraph );
    this.addChild( this.velocityGraph );
    this.addChild( this.positionGraph );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs, {

    /**
     * Reset the PVAGraphs
     */
    reset: function() {
      this.accelerationGraph.reset();
      this.velocityGraph.reset();
      this.positionGraph.reset();
    }

  } );

} );