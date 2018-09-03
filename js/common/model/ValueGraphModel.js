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
  var Range = require( 'DOT/Range' );

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
    this.timeInterval = FallingObjectsConstants.VG_TIME_INTERVAL;
    this.valueInterval = FallingObjectsConstants.VG_VALUE_INTERVAL;
    this.updateFrequency = FallingObjectsConstants.VG_UPDATE_FREQUENCY;
    this.maxPlotWidth = maxPlotWidth;
    this.maxPlotHeight = maxPlotHeight;

    // @public {Property.<number>} last point in time since the graph was updated, relative to start of plotting
    this.lastUpdateTimeProperty = new NumberProperty( 0 );

    // @public {Property.<range>} Bounds of the value axis ( min, max )
    this.valueLengthProperty = new Property( new Range( -this.valueInterval, 0 ) );

    // @public {Property.<number>} Bounds of the time axis
    this.timeLengthProperty = new NumberProperty( new Range( 0, this.timeInterval ) );
    
    // @private {Property.<number>} power used to increase the max value exponentially (see increaseMaxValue)
    this._valueMaxScalePowerProperty = new NumberProperty( -1 );

    // @private {Property.<number>} power used to increase the min value exponentially (see increaseMinValue)
    this._valueMinScalePowerProperty = new NumberProperty( 0 );

    // @public {Property.<number>} scalar that maps model values to view coordinates
    this.valueScaleProperty = new NumberProperty( this.getValueScale() );

    // @public {Property.<number>} scalar that maps time to view coordinates
    this.timeScaleProperty = new NumberProperty( this.getTimeScale() );

    // @public {Property.<array>} data points that have been plotted on the graph
    this.dataPointsProperty = new Property( [] );
    // Change the method used to determine equality between values- default doesn't play nice with arrays
    this.dataPointsProperty.areValuesEqual = function( a, b ) {
      return false;  // just always assume they are not equal
    };

    // @public {Property.<boolean>} if true, then when possible then the data points on the graph will be re-plotted
    this.replotGraphProperty = new BooleanProperty( false );

    // @public {Property.<number>} location percentage of the origin
    this.originLocPercentProperty = new NumberProperty( 0 );


    // Create links to update valueScale and timeScale whenever valueLength and maxTime change
    // Scales are calculated by taking the length for plotting and dividing by the maximum value to be fit
    // onto that length

    this.valueLengthProperty.link( function( valueLength ) {
      self.valueScaleProperty.set( self.getValueScale() );
    } );

    this.timeLengthProperty.link( function( timeLength ) {
      self.timeScaleProperty.set( self.getTimeScale() );
    } );

    // Create a link to update the origin loc percentage on a value length
    this.valueLengthProperty.link( function( valueLength ) {
      self.originLocPercentProperty.set( self.getOriginLocPercent() );
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
      this.valueScaleProperty.reset();
      this.timeScaleProperty.reset();
      this.valueLengthProperty.reset();
      this.timeLengthProperty.reset();
      this._valueMaxScalePowerProperty.reset();
      this._valueMinScalePowerProperty.reset();
      this.dataPointsProperty.reset();
      this.replotGraphProperty.reset();
    },

    /**
     * Exponentially increment the maxValue that can be plotted on the graph.
     * Calculated using the formula: valueInterval * ( 2 ** _valueScalePower)
     */
    incrementMaxValue: function() {
      // Increment the valueScalePower
      this._valueMaxScalePowerProperty.set( this._valueMaxScalePowerProperty.get() + 1 );

      // Set the maxValue to the interval multiplied by 2 raised to our power
      this.valueLengthProperty.set(
        new Range(
          this.valueLengthProperty.get().min,  // Minimum stays the same
          Math.abs( this.valueInterval * ( Math.pow( 2, this._valueMaxScalePowerProperty.get() ) ) )
        )
      );
    },

    /**
     * Exponentially increment the minValue that can be plotted on the graph.
     * Calculated using the same formula as above
     */
    incrementMinValue: function( ) {
      // Increment the valueScalePower
      this._valueMinScalePowerProperty.set( this._valueMinScalePowerProperty.get() + 1 );

      // Set the minValue to the interval multiplied by 2 raised to our power
      this.valueLengthProperty.set(
        new Range(
          Math.abs( this.valueInterval * ( Math.pow( 2, this._valueMinScalePowerProperty.get() ) ) ) * -1,
          this.valueLengthProperty.get().max  // Maximum stays the same
        )
      );
    },

    /**
     * Linearly increment the maxTime that can be plotted on the graph.
     * Calculated using the formula: maxTime + timeInterval
     */
    incrementMaxTime: function() {
      // Just tack another interval onto our maxTime
      this.timeLengthProperty.set( new Range( 0, this.timeLengthProperty.get().max + this.timeInterval ) );
    },

    /**
     * Return the scale along the value/Y axis, which can be used to translate model coordinates onto view
     * coordinates. Scale is calculated by taking the length for plotting (length of the value axis in view
     * coordinates) and dividing by the range of model values that needs to fit that plot length. For instance,
     * if our maxPlotHeight is 100 in view coordinates and the range we want to plot onto that height is
     * -30 Newtons to 0 Newtons, then our scale would be 100 / 30 = 3.33 (one Newton is equal to 3.33 in view
     * coordinates)
     */
    getValueScale: function() {
      return this.maxPlotHeight / Math.abs( this.valueLengthProperty.get().getLength() );
    },

    /**
     * Return the scale along the time/X axis, which can be used to translate time onto view coordinates.
     * Scale is calculated by taking the length of plotting (length of the time axis in view coordinates) and
     * dividing by the length of the time that needs to fit that plot length. For instance, if our
     * maxPlotWidth is 100 in view coordinates and we want to plot 30 seconds on the graph at a time, then
     * our scale would be 100 / 30 = 3.33 (one second is equal to 3.33 in view coordinates).
     */
    getTimeScale: function() {
      return this.maxPlotWidth / Math.abs( this.timeLengthProperty.get().getLength() );
    },

    /**
     * Return the location percentage for the origin on the graph (i.e. how far from
     * this.valueLengthProperty.get().min is 0, in the valueLengthProperty range)
     */
    getOriginLocPercent: function() {
        // MIN ------ 0 ------ MAX
        // Distance between MIN and 0 as a relative percentage to the distance between MIN and MAX is what
        // we want to return
        return Math.abs( this.valueLengthProperty.get().min / this.valueLengthProperty.get().getLength() );
    }

  } );


} );