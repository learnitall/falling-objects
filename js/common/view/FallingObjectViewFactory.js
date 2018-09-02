// Copyright 2018, University of Colorado Boulder

/**
 * Factory for creating the image pieces of FallingObjectNodes for FallingObjects
 * Based off of the ProjectileObjectViewFactory from projectile motion
 *
 * @author Ryan Drew
 */
define( function ( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );

  // images
  var badmintonShuttlecockImage = require( 'image!FALLING_OBJECTS/badminton_shuttlecock.svg' );
  var baseballImage = require( 'image!FALLING_OBJECTS/baseball.png' );
  var combustedImage = require( 'image!FALLING_OBJECTS/combusted.png' );
  var footballImage = require( 'image!FALLING_OBJECTS/football.png' );
  var modelRocketImage = require( 'image!FALLING_OBJECTS/model_rocket.svg' );
  var sportsCarImage = require( 'image!FALLING_OBJECTS/sports_car.svg' );

  /**
   * Defines helper functions that create and/or hold preset images
   */
  function FallingObjectViewFactory( ) {

    /**
    * Functions to create nodes that look like the given falling objects.
    * @public
    *
    * @param {number} diameter - diameter of the object in model coordinates
    * @returns {Node}
    */

    this.createBowlingBall = function( diameter, options ) {
      // Add in fill and stroke to options
      options = _.extend( {
        fill: 'black',
        stroke: 'gray'
      }, options );

      return new Circle( diameter / 2, options );
    };

    this.createCombusted = function( diameter, options ) {
      // Need to apply a 180 degree rotation to the image so it stands vertical
      options = _.extend( {
        rotation: -Math.PI / 2
      }, options );

      return new Image( combustedImage, options );
    }

    this.createFootball = function( diameter, options ) {
      // We just need to apply a 90 degree rotation to the image so it stands vertical
      options = _.extend( {
        rotation: Math.PI / 2
      }, options );

      return new Image( footballImage, options );
    };

    this.createGolfBall = function( diameter, options ) {
      // Add in fill and stroke to options
      options = _.extend( {
        fill: 'white',
        stroke: 'gray'
      }, options );

      return new Circle( diameter / 2, options );
    };

    this.createModelRocket = function( diameter, options ) {
      // We just need to apply a 180 degree rotation to the image so it stands vertical
      options = _.extend( {
        rotation: Math.PI
      }, options );

      return new Image( modelRocketImage, options );
    };

    this.createPingPongBall = function( diameter, options ) {
      // Add in fill and stroke to options
      options = _.extend( {
        fill: 'orange',
        stroke: 'gray'
      }, options );

      return new Circle( diameter / 2, options );
    };

    this.createSportsCar = function( diameter, options ) {
      // The car is so large in comparison to the other objects (which are mainly just balls),
      // we need to shrink it down in size
      options = _.extend( {
        scale: 1 / 5  // determined empirically
      }, options );

      return new Image( sportsCarImage, options );
    };

    /**
     * Backend dictionary that translates falling object names to their associated view (i.e. image or node construction function)
     * @private
     */
    this._nameToImage = {
      // images
      'BADMINTON_SHUTTLECOCK': badmintonShuttlecockImage,
      'BASEBALL': baseballImage,
      // constructed nodes
      'BOWLING_BALL': this.createBowlingBall,
      'COMBUSTED': this.createCombusted,
      'FOOTBALL': this.createFootball,
      'GOLF_BALL': this.createGolfBall,
      'MODEL_ROCKET': this.createModelRocket,
      'PING_PONG_BALL': this.createPingPongBall,
      'SPORTS_CAR': this.createSportsCar
    };
  }

  fallingObjects.register( 'FallingObjectViewFactory', FallingObjectViewFactory );

  return inherit( Object, FallingObjectViewFactory, {

    /**
     * Constructs a view node for the given falling object name, scaling based on model dimensions
     * @public
     *
     * @param {string} fallingObjectName - name of the falling object to construct a view for (should be from string! plugin)
     * @param {ModelViewTransform2} - modelViewTransform - the coordinate transform between model coordinates and view coordinates
     * @returns {Node}
     */
    constructView: function( fallingObjectName, modelViewTransform ) {

      // First format the given falling object name so it can be used properly
      fallingObjectName = FallingObjectsConstants.stringToConstantsName( fallingObjectName );

      // Get the model dimensions for the object and scale them to view coordinates
      // Notation in FallingObjectsConstants is underscore notation, but all caps
      var modelDiameter = FallingObjectsConstants[ fallingObjectName ].diameter;

      // modelDiameter is either an array or single variable, depending on the type of dimensions represented
      // For an example, see the difference in FallingObjectsConstants between GOLF_BALL and FOOTBALL
      var viewDiameter;
      var viewHeight;
      var viewWidth;
      if ( typeof modelDiameter === 'number' ) {
        viewDiameter = modelViewTransform.modelToViewDeltaX( modelDiameter );
        viewWidth = viewHeight = viewDiameter;
      }
      else {
        viewWidth = modelViewTransform.modelToViewDeltaX( modelDiameter[ 0 ] );  // DeltaX and Y will both just multiply by scale factor
        viewHeight = modelViewTransform.modelToViewDeltaY( modelDiameter[ 1 ] );
        viewDiameter = [ viewWidth, viewHeight ];
      }

      // Construct a generic options dictionary for node construction
      var options = {
        centerX: 0,
        centerY: 0,
        maxHeight: viewHeight,
        maxWidth: viewWidth
      };

      // Get the object's image or node construction function
      var objectView = this._nameToImage[ fallingObjectName ];

      // Put everything together
      if ( typeof objectView === 'object' ) {  // assume objectView is an image
        return new Image( objectView, options );
      }
      else {  // otherwise assume its a constructor function, and pass in the viewDiameter
        return objectView( viewDiameter, options );
      }
    }

  } );

} );
