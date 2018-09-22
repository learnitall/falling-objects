// Copyright 2018, University of Colorado Boulder

/**
 * Panel that displays information about the currently selected falling object, such
 * as its mass, drag coefficient and reference area
 *
 * @author Ryan Drew
 */
define( function( require) {
  'use strict';

  // modules
  var fallingObjects = require( 'FALLING_OBJECTS/fallingObjects' );
  var FallingObjectsConstants = require( 'FALLING_OBJECTS/common/FallingObjectsConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern0Label1ValueString = require( 'string!FALLING_OBJECTS/pattern.0Label.1Value' );
  var pattern0Label1Value2UnitsString = require( 'string!FALLING_OBJECTS/pattern.0Label.1Value.2Units' );
  var massString = require( 'string!FALLING_OBJECTS/mass' );
  var referenceAreaString = require( 'string!FALLING_OBJECTS/referenceArea' );
  var dragCoefficientString = require( 'string!FALLING_OBJECTS/dragCoefficient' );
  var kgString = require( 'string!FALLING_OBJECTS/kg' );
  var m2String = require( 'string!FALLING_OBJECTS/m2' );

  /**
   * Construct the value panel
   *
   * @param {FallingObjectsModel} fallingObjectsModel - used to pull selectedFallingObjectNameProperty and FallingObject attribute values
   * @param {number} maxWidth - width of the value panel
   */
  function ValuePanel( fallingObjectsModel, maxWidth ) {

    // Make a call to the super
    Node.call( this );
    var self = this;

    // Defined below for convenience in this constructor
    var controlPanelOptions = FallingObjectsConstants.CONTROL_PANEL_OPTIONS;
    var controlPanelsFontSize = FallingObjectsConstants.CONTROL_PANELS_FONT_SIZE;

    // Create font and options for our labels
    var labelFont = new PhetFont( { size: controlPanelsFontSize } );
    var labelTextNodeMaxWidth = maxWidth - ( 2 * controlPanelOptions.xMargin );
    var labelTextNodeOptions = {
      font: labelFont,
      maxWidth: labelTextNodeMaxWidth
    };

    /**
     * Small auxiliary function to automate the process of creating a label
     *
     * @param {string} attributeName - key name of the attribute for the FallingObject to set the label to (i.e. 'mass', 'referenceArea')
     * @param {string} patternString - pattern string that will be used with StringUtils to construct the label's text
     * @param {string} labelString - will be subbed into the 'label' key in the patternString
     * @param {string} unitsString - will be subbed into the 'units' key in the patternString
     */
    var createNewLabel = function( attributeName, patternString, labelString, unitsString ) {

      // Create a blank text for the label
      var labelTextNode = new Text( '', labelTextNodeOptions );

      // Using a nested link here- first pull the appropriate attribute property from the selected falling object
      // Then create a link on that attribute property so that whenever its value is updated, the label is updated
      // as well
      fallingObjectsModel.selectedFallingObjectNameProperty.link( function( selectedFallingObjectName ) {

        // Pull the attribute
        var attributeProperty = fallingObjectsModel.selectedFallingObject[ attributeName ];
        // Link so the label gets updated on changes
        attributeProperty.link( function( attributeValue ) {
          // Deal with special cases that don't fit the generic label builder
          if ( attributeName === 'positionProperty' ) {
            // Pull the y component of the vector
            attributeValue = attributeValue.y;
          }
          labelTextNode.setText(
            StringUtils.fillIn( patternString, {
              label: labelString,
              value: fallingObjectsModel.roundValue( attributeValue, FallingObjectsConstants.VP_NUM_DIGITS ),
              units: unitsString
            } )
          );
        } );

      } );

      // Place the labelTextNode into a VBox, containing an HStrut that will always push the containing
      // panel to the maxWidth
      var labelNode = new VBox( {
        align: FallingObjectsConstants.CONTROL_PANELS_ALIGNMENT,
        children: [
          labelTextNode,
          new HStrut( labelTextNodeMaxWidth )
        ]
      } );

      return labelNode;

    };

    // Construct our labels
    var massLabel = createNewLabel( 'massProperty', pattern0Label1Value2UnitsString, massString, kgString );
    var referenceAreaLabel = createNewLabel( 'referenceAreaProperty', pattern0Label1Value2UnitsString, referenceAreaString, m2String );
    var dragCoefficientLabel = createNewLabel( 'dragCoefficientProperty', pattern0Label1ValueString, dragCoefficientString );

    // Create a VBox to add all the elements
    var labelVBox = new VBox( {
      resize: true,
      align: FallingObjectsConstants.CONTROL_PANELS_ALIGNMENT,
      spacing: FallingObjectsConstants.CONTROL_PANELS_VERTICAL_SPACING,
      children: [
        massLabel,
        referenceAreaLabel,
        dragCoefficientLabel
      ]
    } );

    // Create a panel for the background color and placement of all the controls
    var panelOptions = FallingObjectsConstants.CONTROL_PANEL_OPTIONS;
    // Set the width of the panel to the maxWidth given
    panelOptions.minWidth = maxWidth;
    var valuePanel = new Panel( labelVBox, panelOptions );

    // Create a link that will hide/show the panel based on the showValuesProperty
    fallingObjectsModel.showValuesProperty.link( function( showValues ) {
      self.setVisible( showValues );
    } );

    // Finally, add it as a child
    this.addChild( valuePanel );
  }

  fallingObjects.register( 'ValuePanel', ValuePanel );

  return inherit( Node, ValuePanel );

} );