/**
 * # AppAuthToken.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux  & the config file
 */
import store from 'react-native-simple-store'
import CONFIG from './config'
import Constants  from './constants'
import {NativeModules} from 'react-native'

export default class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * set the key from the config
   */
  constructor () {
    this.SESSION_HEADER = CONFIG.PARSE.SESSION_HEADER
  }

  /**
   * ### storeSessionToken
   * Store the session key
   */
  storeSessionToken (sessionHeader,userType,userName,userProfileImage,userAddress) {
    console.log('sessionToken',userName,userProfileImage);
    return store.save(this.SESSION_HEADER, {
      sessionHeader: sessionHeader,
      user:userType,
      userName:userName,
      userProfileImage: userProfileImage,
      userAddress: userAddress
    })
  }

  /**
   * ### getSessionToken
   * @param {Object} sessionToken the currentUser object from Parse.com
   *
   * When Hot Loading, the sessionToken  will be passed in, and if so,
   * it needs to be stored on the device.  Remember, the store is a
   * promise so, have to be careful.
   */
  getSessionToken (sessionHeader) {
    if (sessionHeader) {

      return store.save(this.SESSION_HEADER, {
        sessionHeader: sessionHeader,
        user:sessionHeader
      }).then(() => {

        return store.get(this.SESSION_HEADER)
      })
    }
    return store.get(this.SESSION_HEADER)
  }

  /**
   * ### storeRatingInfo
   * Store the rating information
   */
  storeRatingInfo (ratingInfo) {
    // console.log('rating information',ratingInfo);
    return store.save(Constants.RATING, ratingInfo)
  }

  saveThisNotification (notificationObject) {
    console.log('rating information',notificationObject);
    return store.save(Constants.NOTIFICATION_OBJECT, notificationObject)
  }

  getNotifcationObject(){
    return store.get(Constants.NOTIFICATION_OBJECT)
  }


  /*
  * Get rating information
  */
  getRatingInfo() {
    return store.get(Constants.RATING);
  }

  /*
  * Save device token
  */
  saveDeviceToken(deviceToken) {
    store.save(Constants.DEVICETOKEN, deviceToken)
  }

  getDeviceToken () {
    // console.log('getDeviceToken' + getDeviceToken());
    return store.get(Constants.DEVICETOKEN);
  }

  saveDeviceMode () {
    let deviceMode = 'debug'//NativeModules.RNScheme.deviceMode
    var mode = ''
    if (deviceMode == 'debug') {
      mode = 'development'
    }
    else {
      mode = 'distribution'
    }
    store.save(Constants.DEVICEMODE, mode)
  }

  /*
  * Get DeviceMode
  */
  getDeviceMode () {
      return store.get(Constants.DEVICEMODE);
  }
  /**
   * ### deleteSessionToken
   * Deleted during log out
   */
  deleteSessionToken () {
    return store.delete(this.SESSION_HEADER)
  }
}
