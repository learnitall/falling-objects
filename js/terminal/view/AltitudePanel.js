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
  var Text = require( 'SCENERY/nodes/Text' );

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
    var controlPanelsAlignment = FallingObjectsConstants.CONTROL_PANELS_ALIGNMENT;
    var controlPanelsVerticalSpacing = FallingObjectsConstants.CONTROL_PANELS_VERTICAL_SPACING;
    var altitudeSliderRange = FallingObjectsConstants.AP_SLIDER_RANGE;
    var altitudeSliderOptions = _.extend( {
      thumbSize: new Dimension2( 22, 45 ),  // Default values set for thumbSize, put here for reference
      //            | ----------maxWidth - xmargins---------- |
      //            | [thumbSize]                 [thumbSize] |
      // [track boundary min]-------------------------[track boundary max]
      // When the thumb has been slid all the way to the left, the leftmost part of the track
      // will lie right in the center of the thumb (same for the right side)
      // Need to therefore subtract the (half of the width of the thumb) * 2 from the track size
      // so everything will fit properly
      trackSize: new Dimension2( maxWidth - ( controlPanelOptions.xMargin * 2 ) - 22, 5 ),  // 5 is the default value here for trackSize height
    }, FallingObjectsConstants.AP_SLIDER_OPTIONS );

    // Create a slider
    var altitudeSlider = new HSlider(
      fallingObjectsModel.selectedFallingObject.initialAltitudeProperty,
      altitudeSliderRange,
      altitudeSliderOptions
    );

    // Create the panel
    var altitudePanel = new Panel( altitudeSlider, controlPanelOptions );

    this.addChild( altitudePanel );

  }

  fallingObjects.register( 'AltitudePanel', AltitudePanel );

  return inherit( Node, AltitudePanel );

} );