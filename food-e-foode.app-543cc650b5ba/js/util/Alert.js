/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
'use strict'

/**
* ## Imports
*
*/
import SimpleAlert from 'react-native-simpledialog-android'
import _ from 'underscore'
import React, { Component} from 'react';
//import { Alert} from 'react-native';

var Alert = class AlertClass extends Component {
  /**
   * ## ErrorAlert
   * setup to support testing
   */
  /**
   * ### checkErro
   * determine if there is an error and how deep it is.  Take the
   * deepest level as the message and display it
   */

   _onPositiveButtonPress(obj) {
     console.log('yes button press', obj);
     obj.callBack(0);
   }

   _onNegativeButtonPress(obj) {
      obj.callBack(1);
   }

  showAlert (obj) {

    let message = ''
    let title = ''
    let buttons = []

    if (!_.isNull(obj) && !_.isUndefined(obj.title)) {

      if (!_.isUndefined(obj.message)) {
        message = obj.message
      } else {
        message = 'Unknown'
      }

      if (!_.isUndefined(obj.title)) {
        title = obj.title
      } else {
        title = 'Unknown'
      }

      // if (!_.isUndefined(obj.positiveButton)) {
      //   buttons[0] = { type: SimpleAlert.POSITIVE_BUTTON, text: obj.positiveButton, onPress:_onPositiveButtonPress(obj) }
      // } else {
      //   buttons[0] = { type: SimpleAlert.POSITIVE_BUTTON, text: 'Ok', onPress: _onPositiveButtonPress() }
      // }
      //
      // if (!_.isUndefined(obj.negativeButton)) {
      //   buttons[1] = { type: SimpleAlert.NEGATIVE_BUTTON, text: obj.negativeButton, onPress: this._onNegativeButtonPress(obj) }
      // }

      SimpleAlert.alert(
          title,
          message,
          [{type: SimpleAlert.POSITIVE_BUTTON, text: 'Ok', onPress:this._onPositiveButtonPress(obj)}]
      );
    }
  }
}

module.exports = Alert
