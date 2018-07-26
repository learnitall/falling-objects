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
   *
   * @param {number} maxPlotWidth - Max width of the graph (needed to determine our initial scales)
   * @param {number} maxPlotHeight - Max height of the graph (needed to determine our initial scales)
   */
  function ValueGraphModel( maxPlotWidth, maxPlotHeight ) {

    // Grab a reference to self
    var self = this;

    // @public
    // Define these for convenience
    this.maxTimeInterval = FallingObjectsConstants.VG_MAX_TIME_INTERVAL;
    this.maxValueInterval = FallingObjectsConstants.VG_MAX_VALUE_INTERVAL;
    this.updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;
    this.maxPlotWidth = maxPlotWidth;
    this.maxPlotHeight = maxPlotHeight;

    // @public {Property.<number>} last point in time since the graph was updated, relative to start of plotting
    this.lastUpdateTimeProperty = new NumberProperty( 0 );

    // @public {Property.<number>} max value that can be plotted on the graph at the current scale
    this.maxValueProperty = new NumberProperty( this.maxValueInterval );

    // @public {Property.<number>} max time that can be plotted on the graph at the current scale
    this.maxTimeProperty = new NumberProperty( this.maxTimeInterval );
    
    // @private {Property.<number>} power used to increase the valueScale exponentially (see increaseValueScale)
    this._valueScalePower = new NumberProperty( 0 );

    // @public {Property.<number>} scalar that maps model values to view coordinates
    this.valueScaleProperty = new NumberProperty( 0 );

    // @public {Property.<number>} scalar that maps time to view coordinates
    this.timeScaleProperty = new NumberProperty( 0 );

    // @public {Property.<array>} data points that have been plotted on the graph
    this.dataPointsProperty = new Property( [] );

    // @public {Property.<boolean>} if true, then when possible then the data points on the graph will be re-plotted
    this.replotGraphProperty = new BooleanProperty( false );


    // Create links to update valueScale and timeScale whenever maxValue and maxTime change
    // Scales are calculated by taking the max length for plotting and dividing by the maximum value to be fit
    // onto that length

    this.maxValueProperty.link( function( maxValue ) {
      self.valueScaleProperty.set( self.maxPlotHeight / maxValue );
    } );

    this.maxTimeProperty.link( function( maxTime ) {
      self.timeScaleProperty.set( self.maxPlotWidth / maxTime );
    } );

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
    },

    /**
     * Exponentially increment the maxValue that can be plotted on the graph.
     * Calculated using the formula: maxValueInterval * ( 2 ** _valueScalePower)
     *
     * @param {boolean} replot - If true, set replotGraphProperty to true in order to signal a replot
     */
    incrementMaxValue: function( replot ) {
      // Increment the valueScalePower
      this._valueScalePower.set( this._valueScalePower.get() + 1 );
      // Set the maxValue to the interval multiplied by 2 raised to our power
      this.maxValueProperty.set( this.maxValueInterval * ( Math.pow( 2, this._valueScalePower.get() ) ) );

      // Replot
      if ( replot ) { this.replotGraphProperty.set( true ); }
    },

    /**
     * Linearly increment the maxTime that can be plotted on the graph.
     * Calculated using the formula: maxTime + maxTimeInterval
     *
     * @param {boolean} replot - If true, set replotGraphProperty to true in order to signal a replot
     */
    incrementMaxTime: function( replot ) {
      // Just tack another interval onto our maxTime
      this.maxTimeProperty.set( this.maxTimeProperty.get() + this.maxTimeInterval );

      // Replot
      if ( replot ) { this.replotGraphProperty.set( true ); }
    }


  } );


} );