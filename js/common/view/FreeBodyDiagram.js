// Copyright 2018, University of Colorado Boulder

/**
 * Free Body Diagram to display the forces acting on the falling object. It consists
 * of two plots: one showing the drag and gravitational forces acting on the falling object
 * and another showing the net force acting on the falling object.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Construct the FreeBodyDiagram
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to determine FBD should be displayed or not
   * @param {number} maxWidth - max width of the free body diagram panel
   * @param {height} maxHeight - max height of the free body diagram panel
   */
  function FreeBodyDiagram( fallingObjectsModel, maxWidth, maxHeight ) {

    // Call super constructor
    Node.call( this );

    // Define values here for convenience
    var self = this;
    var centerCircleRadius = FallingObjectsConstants.FBD_CENTER_CIRCLE_RADIUS;
    var arrowCenterSpacing = FallingObjectsConstants.FBD_ARROW_CENTER_SPACING;
    var horizontalMargin = FallingObjectsConstants.FBD_HORIZONTAL_MARGIN;
    // Individual forces are plotted to the left of the center
    var centerForcesPos = new Vector2( ( maxWidth - horizontalMargin * 2 ) * ( 1 / 4 ) + horizontalMargin, maxHeight / 2 );
    // Total force plotted to the right of the center
    var centerNetForcePos = new Vector2( ( maxWidth - horizontalMargin * 2 ) * ( 3 / 4 ) + horizontalMargin, maxHeight / 2 );
    var maxArrowLength = ( maxHeight / 2 ) - FallingObjectsConstants.FBD_VERTICAL_MARGIN;

    // Loop through each of the objects the selector will display and determine the largest mass
    var objectMasses = [];
    fallingObjectsModel.fallingObjectNames.forEach( function ( fallingObjectName ) {
      objectMasses.push( FallingObjectsConstants[ FallingObjectsConstants.stringToConstantsName( fallingObjectName ) ].mass );
    } );
    var maxMass = Math.max.apply( null, objectMasses );

    // Construct a background rectangle to hold our arrows
    var backgroundRectangle = new Rectangle( 0, 0, maxWidth, maxHeight, FallingObjectsConstants.FBD_BACKGROUND_OPTIONS );

    // Plot the diagram's centers
    var centerForcesNode = new Circle( centerCircleRadius, { fill: 'black' } );
    centerForcesNode.center = centerForcesPos;
    var centerNetForceNode = new Circle( centerCircleRadius, { fill: 'black' } );
    centerNetForceNode.center = centerNetForcePos;

    // Arrows are scaled based off of the max force they will display and their max allocated length
    // The function below deals with max allocated length

    /**
     * To scale the arrows on the screen, the area in which we can plot arrows is split in half
     *
     * For the half closest to the center of the diagram, each power of 10 (from 10 ^ -2 to 10 ^ 2 ) gets
     * its own dedicated segment where arrow lengths lie. Arrows will be scaled based on the upper and lower
     * bounds of their segment. Visually here is what it looks like:
     * Model coordinate ranges: | 0 < mass < 0.01 | 0.01 <= mass < 0.1 | 0.1 <= mass < 1 | 1 <= mass < 10 |
     * View coordinate lengths:               ( 1 / 8 )            ( 1 / 6 )         ( 1 / 4 )        ( 1 / 2 )
     * An arrow modeling the a mass of 0.01 kg will take of an eighth of the length, and an arrow modeling a mass
     * of 10 kg will take up half of the length.
     *
     * The second half of the length is just mapped to the range of ( 10kg, mass of the largest falling object ).
     *
     * @param {number} forceValue - force value in Newtons to return an arrow length for
     */
    var arrowLengths = [ 0, maxArrowLength / 8, maxArrowLength / 6, maxArrowLength / 4, maxArrowLength / 2 ];
    var massSegmentCutoffs = [ 0, 0.01, 0.1, 1, 10 ];
    this.getScaledMaxArrowLength = function ( mass ) {

      for ( var i = 1; i < massSegmentCutoffs.length; i++ ) {
        var massSegmentCutoff = massSegmentCutoffs[ i ];

        if ( mass < massSegmentCutoff ) {
          // Only scale the piece of the arrow that is in the segment, therefore isolate just the segment,
          // scale it, and then add back the previous segment lengths
          return ( ( arrowLengths[ i ] - arrowLengths[ i - 1 ] ) * ( mass / massSegmentCutoff ) ) + arrowLengths[ i - 1 ];
        }
      }

      // If the mass doesn't fit in a segment, then it is just scaled to match the second half
      var lastArrowLengthSegment = arrowLengths[ arrowLengths.length - 1 ];
      // Again, just scale the piece of the arrow that is in the second half
      return ( ( maxArrowLength - ( lastArrowLengthSegment ) ) * ( mass / maxMass ) ) + lastArrowLengthSegment;

      /**
      Here's what this looks like without a for loop:

      if ( mass < 0.01 ) {
        return ( maxArrowLength / 8 ) * ( mass / 0.01 );

      else if ( mass < 0.1 ) {
        return ( ( ( maxArrowLength / 6 ) - ( maxArrowLength / 8 ) ) * ( mass / 0.1 ) ) + ( maxArrowLength / 8 );
      }
      else if ( mass < 1 ) {
        return ( ( ( maxArrowLength / 4 ) - ( maxArrowLength / 4 ) ) * ( mass / 1 ) ) + ( maxArrowLength / 6 );
      }
      else if ( mass < 10 ) {
        return ( ( ( maxArrowLength / 2 ) - ( maxArrowLength / 3 ) ) * ( mass / 10 ) ) + ( maxArrowLength / 4 );
      }
      else {
        return ( ( maxArrowLength - ( maxArrowLength / 2 ) ) * ( mass / maxMass ) ) + ( maxArrowLength / 2 );
      }
      **/

    };

    /**
     * Auxiliary function to create force arrows
     *
     * @param {Vector2} center - center of the arrow/it's base
     * @param {NumberProperty} forceProperty - force property that the arrow will model
     * @param {string} color - color/fill of the arrow
     */
    var createForceArrow = function( center, forceProperty, color ) {
      // Create a node to hold the arrow's shape
      var arrowNode = new Path( null, {
        fill: color,
        stroke: color,
        lineWidth: centerCircleRadius
      } );

      // The link below deals with max force (which is set to the selected falling object's weight)
      // If the selected falling object changes, then dispose of the arrow's shape and set the max arrow length and max force
      fallingObjectsModel.selectedFallingObjectNameProperty.link( function( selectedFallingObjectName ) {
        arrowNode.shape = null;
        var selectedMass =  FallingObjectsConstants[ FallingObjectsConstants.stringToConstantsName( selectedFallingObjectName ) ].mass;
        self.scaledMaxArrowLength = self.getScaledMaxArrowLength( selectedMass );
        self.maxForce = selectedMass * FallingObjectsConstants.ACCELERATION_GRAVITY_SEA_LEVEL;
      } );

      /**
       * Creates the arrow's shape based on the value of the force property
       *
       * @param {number} forceValue - value of the force property to map the arrow to
       */
      var updateArrowNode = function( forceValue ) {
        // If the free body diagram is shown, then do calculations
        if ( fallingObjectsModel.showFreeBodyDiagramProperty.get() ) {

          // The length of the arrow is set to the property's value times the arrow scale
          var forceRatio;
          if ( Math.abs( forceValue ) > Math.abs( self.maxForce ) )  {  // this happens when one enables drag after dropping an object for too long
            forceRatio = 1 * ( ( forceValue / self.maxForce ) < 1 ? -1 : 1 );
          }
          else {
            forceRatio = forceValue / self.maxForce;
          }
          var arrowLength = self.scaledMaxArrowLength * forceRatio;
          // Create the arrow shape
          arrowNode.shape = new ArrowShape(
            center.x,
            center.y + arrowCenterSpacing,
            center.x,
            center.y + arrowCenterSpacing + arrowLength,
            // Scale the arrows dynamically when they become small
            { isHeadDynamic: true, scaleTailToo: true, tailWidth: centerCircleRadius / 2 }
          );
        }
      };

      // Link the above auxiliary function onto the forceProperty and onto the showFreeBodyDiagramProperty
      forceProperty.link( updateArrowNode );
      // Have to also link onto the show property, because we need to guarantee that the arrows will be accurately
      // drawn when the graph is displayed
      fallingObjectsModel.showFreeBodyDiagramProperty.link( function( showFreeBodyDiagramValue ) {
        // Only update if shown
        if ( showFreeBodyDiagramValue ) {
          updateArrowNode( forceProperty.get() );
        }
      } );

      return arrowNode;
    };

    // Create the arrows
    // Drag Force
    var dragForceArrow = createForceArrow(
      centerForcesPos,
      fallingObjectsModel.selectedFallingObject.dragForceProperty,
      FallingObjectsConstants.FBD_DRAG_FORCE_ARROW_COLOR,
      true
    );
    // Weight Force
    var weightForceArrow = createForceArrow(
      centerForcesPos,
      fallingObjectsModel.selectedFallingObject.weightForceProperty,
      FallingObjectsConstants.FBD_WEIGHT_FORCE_ARROW_COLOR
    );
    // Net Force
    var netForceArrow = createForceArrow(
      centerNetForcePos,
      fallingObjectsModel.selectedFallingObject.netForceProperty,
      FallingObjectsConstants.FBD_NET_FORCE_ARROW_COLOR
    );

    // Add children (set rendering order)
    this.addChild( backgroundRectangle );
    this.addChild( dragForceArrow );
    this.addChild( weightForceArrow );
    this.addChild( netForceArrow );
    this.addChild( centerForcesNode );
    this.addChild( centerNetForceNode );

    // Now link the showFreeBodyDiagramProperty in the model with the visibility of this node
    fallingObjectsModel.showFreeBodyDiagramProperty.link( function( showFreeBodyDiagramValue ) {
      self.setVisible( showFreeBodyDiagramValue );
    } );

    // Also create a link where the dragForceArrow is only shown if the dragForceEnabledProperty is true
    fallingObjectsModel.dragForceEnabledProperty.link( function ( dragForceEnabledValue ) {
      if ( !dragForceEnabledValue ) {
        dragForceArrow.shape = null;
      }
    } );
  }

  fallingObjects.register( 'FreeBodyDiagram', FreeBodyDiagram );

  return inherit( Node, FreeBodyDiagram );

} );