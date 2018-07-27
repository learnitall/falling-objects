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

    // Create a getter for the position property, since it's a vector property
    var getPositionProperty = function() {
      return fallingObjectsModel.selectedFallingObject.positionProperty.get().y;
    };

    // Calculate height of each graph- each gets little less than a third of maxHeight
    var graphHeight = ( maxHeight - ( 2 * FallingObjectsConstants.VG_VERTICAL_SPACING ) / 3 );
    var graphWidth = maxWidth;

    // Create the acceleration, velocity and position graphs
    this.accelerationGraph = new ValueGraphNode(
      fallingObjectsModel,
      accelerationString,
      fallingObjectsModel.selectedFallingObject.accelerationProperty.get,
      FallingObjectsConstants.VG_ACCELERATION_COLOR,
      graphWidth,
      graphHeight
    );

    this.velocityGraph = new ValueGraphNode(
     fallingObjectsModel,
     velocityString,
     fallingObjectsModel.selectedFallingObject.velocityProperty.get,
     FallingObjectsConstants.VG_VELOCITY_COLOR,
     graphWidth,
     graphHeight
    );

    this.positionGraph = new ValueGraphNode(
      fallingObjectsModel
      positionString,
      getPositionProperty,
      FallingObjectsConstants.VG_POSITION_COLOR,
      graphWidth,
      graphHeight
    )

    // Add them all as children
    this.addChild( this.accelerationGraph );
    this.addChild( this.velocityGraph );
    this.addChild( this.positionGraph );

  }

  fallingObjects.register( 'PVAGraphs', PVAGraphs );

  return inherit( Node, PVAGraphs );

} );