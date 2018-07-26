// Copyright 2018, University of Colorado Boulder

/**
 * Model for a ValueGraph that plots an Axon property over time
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  /**
   * Construct the model
   */
  function ValueGraphModel( ) {

    // @public
    // Define these for convenience
    this.maxTimeInterval = FallingObjectsConstants.VG_MAX_TIME_INTERVAL;
    this.maxValueInterval = FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;
    this.updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;

    // @public {Property.<number>} last point in time since the graph was updated, relative to start of plotting
    this.lastUpdateTimeProperty = new NumberProperty( 0 );

    // @public {Property.<number>} max value that can be plotted on the graph at the current scale
    this.maxValueProperty = new NumberProperty( 0 );

    // @public {Property.<number>} max time that can be plotted on the graph at the current scale
    this.maxTimeProperty = new NumberProperty( 0 );

    // @public {Property.<array>} data points that have been plotted on the graph
    this.dataPointsProperty = new Property( [] );

    // @public {Property.<boolean>} if true, then when possible then the data points on the graph will be re-plotted
    this.replotGraphProperty = new BooleanProperty( false );

  }

  fallingObjects.register( 'ValueGraphModel', ValueGraphModel );

  return inherit( Object, ValueGraphModel, {

    /**
     * Reset the model so it can be re-used for a different selected falling object
     * or for a new drop of the current falling object
     */
    reset: function() {
      this.lastUpdateTimeProperty.reset();
      this.maxValueProperty.reset();
      this.maxTimeProperty.reset();
      this.dataPointsProperty.reset();
      this.replotGraphProperty.reset();
    }


  } );


} );