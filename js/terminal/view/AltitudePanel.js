// Copyright 2018, University of Colorado Boulder

/**
 * Control panel that lets users set the initial altitude that
 * the FallingObject drops at
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern0Value1UnitsString = require( 'string!FALLING_OBJECTS/pattern.0Value.1Units' );
  var kmString = require( 'string!FALLING_OBJECTS/km' );

  /**
   * Construct the altitude panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - will be used to communicate initial altitude to selected falling object
   * @param {number} maxWidth - max width of the altitude panel
   */
  function AltitudePanel( fallingObjectsModel, maxWidth ) {

    // Call the super
    Node.call( this );

    // Define below for convenience
    var controlPanelOptions = FallingObjectsConstants.CONTROL_PANEL_OPTIONS;
    var controlPanelsFontSize = FallingObjectsConstants.CONTROL_PANELS_FONT_SIZE;
    var altitudeSliderRange = FallingObjectsConstants.AP_SLIDER_RANGE;
    var altitudeSliderNumMinorTicks = FallingObjectsConstants.AP_NUM_MINOR_TICKS;
    var altitudeSliderOptions = _.extend( {
      thumbSize: new Dimension2( 22, 45 ),  // Default values set for thumbSize, put here for reference
      //            | ----------maxWidth - xmargins---------- |
      //            | [thumbSize]                 [thumbSize] |
      // [track boundary min]-------------------------[track boundary max]
      // When the thumb has been slid all the way to the left, the leftmost part of the track
      // will lie right in the center of the thumb (same for the right side)
      // Need to therefore subtract the (half of the width of the thumb) * 2 from the track size
      // so everything will fit properly
      // Double value of xMargins in order to leave room for labels (two x margins doubled = xMargin * 4)
      trackSize: new Dimension2( maxWidth - ( controlPanelOptions.xMargin * 4 ) - 22, 5 ),  // 5 is the default value here for trackSize height
      // Round all values to having no decimals
      constrainValue: function( value ) { return fallingObjectsModel.roundValue( value, 0 ); }
    }, FallingObjectsConstants.AP_SLIDER_OPTIONS );

    // Create a slider
    var altitudeSlider = new HSlider(
      fallingObjectsModel.selectedFallingObject.initialAltitudeProperty,
      altitudeSliderRange,
      altitudeSliderOptions
    );

    // Add tick marks
    var tickLabelOptions = {
        font: new PhetFont( { size: controlPanelsFontSize } ),
        /*
         ( ( maxWidth - altitudeSliderOptions.trackSizse.width ) / 2 ) - controlPanelOptions.xMargin gets the length
         between the edge of the track to the edge of the panel (symmetrical to both sides)
         We then multiply by two, since this distance represents just half of the room available to the label

         | -------------maxWidth-------------- |
         |         -----trackSize-----         |
         |         |                  |        |
         |       majorTick         majorTick   |
         | --xMargin                 xMargin-- |
         |    -----tickLabelWidth / 2          |
         |    ----------tickLabelWidth         |
        */
        maxWidth: ( ( ( maxWidth - altitudeSliderOptions.trackSize.width ) / 2 ) - controlPanelOptions.xMargin ) * 2
    };
    // Going to convert these values to km in order to save space
    altitudeSlider.addMajorTick( altitudeSliderRange.min,
      new Text(
        StringUtils.fillIn( pattern0Value1UnitsString, {
          value: altitudeSliderRange.min / 1000,
          units: kmString
        } ),
        tickLabelOptions
      )
    );
    altitudeSlider.addMajorTick( altitudeSliderRange.max,
      new Text(
        StringUtils.fillIn( pattern0Value1UnitsString, {
          value: altitudeSliderRange.max / 1000,
          units: kmString
        } ),
        tickLabelOptions
      )
    );

    // Add in our minor ticks
    // Take our range and divide by the number of ticks we want
    // Increase the number of ticks by one to account for the fact that all of our minor ticks are inbetween the major ticks
    // ex: if we want four minor ticks in-between the two major ticks:
    // 0  1  2  3  4  5
    // 0 2k 4k 6k 8k 10k
    var interval = ( altitudeSliderRange.max - altitudeSliderRange.min ) / ( altitudeSliderNumMinorTicks + 1 );
    for ( var i = 1; i <= altitudeSliderNumMinorTicks; i++ ) {
      altitudeSlider.addMinorTick( interval * i );
    }

    // Create the panel
    var altitudePanel = new Panel( altitudeSlider, controlPanelOptions );

    this.addChild( altitudePanel );

  }

  fallingObjects.register( 'AltitudePanel', AltitudePanel );

  return inherit( Node, AltitudePanel );

} );