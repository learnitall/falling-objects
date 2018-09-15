// Copyright 2018, University of Colorado Boulder

/**
 * Global constants for the entire sim that define environmental and object parameters.
 *
 * @author Ryan Drew
 */
define( function( require ) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var baseballString = require( 'string!FALLING_OBJECTS/baseball' );

  // This variable is used more than once in the dictionary below, define it outside thereofre
  var _max_altitude = 100000;  // Max altitude is set to the Karman line (i.e. 100 km)

  var FallingObjectsConstants = {

    // TODO: Fix this line length
    /**
     * Convert the name of a falling object (retrieved with the string! plugin) to the falling object's keyname in this constants dictionary
     * @public
     *
     * @param {String} fallingObjectString - Name of the falling object from the string! plugin
     * @returns {String}
     */
    stringToConstantsName: function( fallingObjectString ) {
      // Need to convert to all caps, replace spaces with underscores, and remove leading and trailing whitespace characters
      return fallingObjectString.toUpperCase().replace( / /g, '_' ).replace( String.fromCharCode( 8234 ), '' ).replace( String.fromCharCode( 8236 ), '' );
    },

    DEFAULT_FALLING_OBJECT_NAME: baseballString,  // Default FallingObject name that will be selected upon entering the sim

    MAX_ALTITUDE: _max_altitude,  // Max altitude is set to the Karman line (i.e. 100 km)

    FO_NUM_DIGITS: 5,  // Number of digits that all values in the FallingObject will be rounded to

    // This is modified from projectile motion
    CONTROL_PANEL_OPTIONS: {  // Options for each of the control panels (i.e. the FallingObjectSelector and TogglePanel)
      align: 'left',
      minWidth: undefined,  // Should be defined when used
      xMargin: 10,
      yMargin: 10,
      fill: 'rgb( 219, 255, 219 )',  // This was modified to be more green in color
      lineWidth: 1,
      stroke: 'black'
    },
    CONTROL_PANEL_VERTICAL_SPACING: 10,  // Vertical spacing of labels inside control panels

    VP_NUM_DIGITS: 4,  // Number of digits to round displayed values to in the value panel

    TP_LINE_SEP: 'TP_LINE_SEP',  // Identifier that tells the Toggle Panel to create a line separator

    FBD_BACKGROUND_OPTIONS: {  // Options for the background of the FreeBodyDiagram
      fill: 'rgb( 255, 255, 255 )',
      lineWidth: 1,
      stroke: 'black',
      cornerRadius: 10
    },
    FBD_HORIZONTAL_MARGIN: 5,  // Extra padding to be given to vertical edges of the FBD (greater the value, closer the centers will be)
    FBD_VERTICAL_MARGIN: 20,  // Margin between the edges of the FDB background and the arrows
    FBD_ARROW_CENTER_SPACING: 2,  // Smaller arrows can get swallowed up in the center circles- this pads the arrows' centers to reduce this
    FBD_CENTER_CIRCLE_RADIUS: 8,  // Radius of the center points plotted in the FBD
    // Define colors of the arrows
    FBD_DRAG_FORCE_ARROW_COLOR: 'blue',
    FBD_WEIGHT_FORCE_ARROW_COLOR: 'orange',
    FBD_NET_FORCE_ARROW_COLOR: 'green',
    FBD_NUM_FORCE_DIGITS: 2, // Number of decimals to round force values to before they are used to calculate arrow lengths and displayed on labels
    FBD_FORCE_LABEL_FONT_SIZE: 12,  // Font size of the force labels towards the bottom of the Free Body Diagram
    FBD_FORCE_LABEL_ARROW_PADDING: 10,  // Padding space between labels and the tips of the negative force arrows

    MB_CLOUD_MARGIN_X: 90,  // Minimum horizontal space between the falling object and center of the clouds in the background
    MB_CLOUD_MARGIN_X_VARIANCE: 120,  // Maximum amount of extra horizontal space between the falling object and clouds in the background
    MB_CLOUD_MARGIN_Y: 60,  // Minimum vertical space added between each of the clouds in the moving background
    MB_CLOUD_MARGIN_Y_VARIANCE: 100,  // Maximum amount of extra space added between each of the clouds in the moving background
    MB_CLOUD_SCALE_RANGE: new Range( 0.4, 1.2 ),  // Minimum to maximum values of scales for the clouds in the moving background

    SCREEN_MARGIN_X: 10,  // Distance between any visible component and the right or left edge of the screen
    SCREEN_MARGIN_Y: 10,  // Distance between any visible component and the top or bottom edge of the screen

    CONTROL_PANELS_VERTICAL_SPACING: 18,  // Vertical spacing all of the control panels
    CONTROL_PANELS_HORIZONTAL_SPACING: 10,  // Horizontal spacing of all the control panels
    CONTROL_PANELS_FONT_SIZE: 18,  // Font size of text used in the Control Panels
    CONTROL_PANELS_ALIGNMENT: 'left',  // Alignment of Nodes inside control panels

    GRAPHS_HORIZONTAL_SPACING: 20,  // Horizontal space in between the FBD and PVAGraphs

    CONTROL_BUTTON_RADIUS: 23,  // Radius of each of the Reset, Play/Pause and Step buttons
    CONTROL_BUTTON_STEP_DT: 1 / 60,  // Assume frame rate for manual steps (60th of a sec)
    CONTROL_BUTTON_MARGIN_X: 10,  // Padding on each side of the row of control buttons (larger the number, more condensed they will be)

    VG_CENTER_PADDING: 50,  // Padding between the PVA graphs and the center of the screen- leaves room for the falling objects
    VG_TOP_LEFT_BOUND: new Vector2( 50, 30 ),  // Top left bound of the ValueGraphs, determined empirically, relative to the top left corner of background.
    VG_TIME_INTERVAL: 10,  // Interval of seconds that the maximum plottable time is incremented by when needed
    VG_VALUE_INTERVAL: 30,  // Interval 'number' of the value property that is used to increase the min and max plotable values
    VG_DATA_PLOT_NODE_OPTIONS: {  // Options for the Path node that is used to plot the data on the graph
      stroke: 'black',
      lineWidth: 2
    },
    VG_UPDATE_FREQUENCY: 1,  // Frequency (in seconds) at which to update the graph
    VG_PLOT_EDGE_PADDING: new Vector2( 40, 30 ),  // Horizontal and vertical plot padding- smaller the value the closer the data will get to the edge of the graph
    VG_AXIS_LABEL_FONT_SIZE: 15,  // Font size of the axis labels
    VG_AXIS_LABEL_PADDING: 5,  // Padding on the right and left or top and bottom of an axis label on the graph
    VG_AXIS_LABEL_COUNT: 4,  // Number of labels to create on each axis
    VG_GRAPH_LINE_OPTIONS: {  // Options for the Line nodes that are used to create the graph tick lines
      stroke: 'gray',
      lineWidth: 3
    },
    VG_ACCELERATION_COLOR: 'red',  // Color of the acceleration graph
    VG_VELOCITY_COLOR: 'green',  // Color of the velocity graph
    VG_POSITION_COLOR: 'blue',  // Color of the position graph
    VG_VERTICAL_SPACING: 15,  // Vertical spacing between each graph
    VG_NUM_LABEL_DIGITS: 2,  // Number of digits to round displayed values to on the graphs

    AP_SLIDER_RANGE: new Range( 0, _max_altitude ),
    AP_SLIDER_OPTIONS: {
      majorTickLength: 12,  // Height of major ticks on the slider
      minorTickLength: 5  // Height of minor ticks on the slider
    },

    MODEL_VIEW_TRANSFORM_SCALE: 900,  // scalar between model coordinates and view coordinates

    EARTH_MEAN_RADIUS: 6371009,  // mean radius of the Earth in m
    ACCELERATION_GRAVITY_SEA_LEVEL: -9.80665,  // acceleration due to gravity at sea level in m/s^2

    // Define FallingObject parameters
    BOWLING_BALL: {
      'mass': 7.25,  // in kg, equal to 16 lbs
      'referenceArea':  1.47,  // in m^2, equal to a bowling ball with 8.595" diameter
      'dragCoefficient': 0.5,
      'diameter': 0.1092 // in m
    },

    BADMINTON_SHUTTLECOCK: {
      'mass': 0.00515,  // in kg
      'referenceArea': 0.0033, // in m^2,
      'dragCoefficient': 0.61,
      'diameter': [ 0.064, 0.083 ]  // skirt length in m (view width), total length in m (view height)
    },

    GOLF_BALL: {
      'mass': 0.045,  // in kg
      'referenceArea': 0.00143,  // in m^2
      'dragCoefficient': 0.3,
      'diameter': 0.043  // in m
    },

    PING_PONG_BALL: {
      'mass': 0.0027,  // in kg
      'referenceArea': 0.0013,  // in m^2
      'dragCoefficient': 0.5,
      'diameter': 0.04  // in m
    },

    BASEBALL: {
      'mass': 0.14,  // in kg
      'referenceArea': 0.042,  // in m^2
      'dragCoefficient': 0.3,
      'diameter': 0.0369  // in m
    },

    FOOTBALL: {
      'mass': 0.411,  // in kg
      'referenceArea': 0.023,  // in m^2
      'dragCoefficient': 0.055,
      'diameter': [ 0.171, 0.228 ]  // short diameter in m (width), long diameter in m (view height)
    },

    MODEL_ROCKET: {
      'mass': 0.0402,  // in kg
      'referenceArea': 0.00049,  // in m^2
      'dragCoefficient': 0.75,
      'diameter': [ 0.113, 0.345 ]  // width with fins on in m, height with fins on in m
    },

    SPORTS_CAR: {
      'mass': 283.63,  // in kg
      'referenceArea': 2.04,  // in m^2
      'dragCoefficient': 0.32,
      'diameter': [ 1.82, 4.37 ]  // width of car in m, length of car in m (view height)
    },

    COMBUSTED: {
      'diameter': null  // Will be set to the diameter of the object that is combusted
    },

    // TODO: Define initial values for a ball that has its attributes change with a slider
    DYNAMIC_BALL: {

    }

  };

  fallingObjects.register( 'FallingObjectsConstants', FallingObjectsConstants );

  return FallingObjectsConstants;

} );
