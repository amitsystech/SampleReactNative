/**
 * # Hapi.js
 *
 * This class interfaces with Hapi.com using the rest api
 * see [http://hapijs.com/api](http://hapijs.com/api)
 *
 */
'use strict'

/**
 * ## Imports
 *
 * Config for defaults and underscore for a couple of features
 */
import CONFIG from './config'
import { Alert, NetInfo } from 'react-native';

var errorString = {
  'asyncCallsFailure':'Error in fetching your account information. Please check your internet connection or try again later.',

};



var status = ''
var shouldCallApi = true;


export default class Hapi {
  /**
   * ## Hapi.js client
   *
   *
   * @throws tokenMissing if token is undefined
   */

  constructor (token) {

    this.API_BASE_URL = CONFIG.backend.hapiLocal
          ? CONFIG.HAPI.local.url
          : CONFIG.HAPI.remote.url


          NetInfo.isConnected.addEventListener('change', function(isConnected){
            if (!isConnected) {
              shouldCallApi = false;
            }
            else{
              shouldCallApi = true;
            }
          });
  }

  handleError(error,errorStr){
    if(error instanceof TypeError ){
      this.showAlert('Oops! Something went wrong. We\'re unable to process your request right now. Please try again later.')
      return ;
    }
    if(error.error_msg != null){
      this.showAlert(String(error.error_msg[0]))
    }
    else {
      this.showAlert(String(errorString[errorStr]))
    }
  }



  /**
   * ### Error Alert
   */
  showAlert(alertTitle, alertMessage, alertButtonText){
    if (status == '500') {
      status = ''
    }
    else {
    Alert.alert(
      alertTitle,
      alertMessage, [
        { text: alertButtonText, onPress: this._onPressFromSimpleAlert },
      ]
    );
    }
  }


   async simpleGetCall(urlEndpoint,handleErrorString,...args){
     console.log('simpleGetCall',args);
     for(var i=0;i<args.length;i++){
       urlEndpoint += args[i] + '/';
     }
     return await this._fetch({
       method: 'GET',
       url: urlEndpoint,
       body: null
     })
     .then((res) => {

       if (res.status === 200 || res.status === 201) {
         return res.json
       } else {
         throw (res.json)
       }
     })
     .catch((error) => {
        if(handleErrorString.length > 0) this.handleError(error,handleErrorString);
       throw (error)
     })
   }

   

  async login (data) {

    console.log(
      'data=', data
    );
    return await this._fetch({
      method: 'POST',
      url: '/api/users/login/',
      body: data
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        this.handleError(error,'login');
        throw (error)
      })
  }

  /**
   * ### logout
   * prepare the request and call _fetch
   */
  async logout () {

    return await this._fetch({
      method: 'GET',
      url: '/api/users/logout/',
      body: null
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201) ||
            (res.status === 400 && res.code === 209)) {
          return {}
        } else {
          throw new Error({code: res.statusCode, error: res.message})
        }
      })
      .catch((error) => {
        this.handleError(error,'logout');
        throw (error)
      })
  }
  /**
   * ### resetPassword
   * the data is already in a JSON format, so call _fetch
   *
   * @param data
   * {email: "barton@foo.com"}
   *
   * @returns empty object
   *
   * if error:  {code: xxx, error: 'message'}
   */
  async resetPassword (data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/resetPasswordRequest',
      body: data
    })
      .then((response) => {
        if ((response.status === 200 || response.status === 201)) {
          return {}
        } else {
          var res = JSON.parse(response._bodyInit)
          throw (res)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }


  


   async getProfileImage (user_id) {

     var url_path = this.urlWithUserId('api/v1/users/', user_id)
     url_path = url_path + "/image"

     return await this._fetch({
       method: 'GET',
       url: url_path
     })
       .then((res) => {
         if ((res.status === 200 || res.status === 201)) {
           return res.json
         } else {
           throw (res.json)
         }
       })
       .catch((error) => {
         throw (error)
       })
   }

  timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        promise.then(resolve);
        setTimeout(function () {
            reject(new Error({error_msg:['Timeout after '+ms+' ms']})); // (A)
        }, ms);
    });
}


  /**
   * ### _fetch
   * A generic function that prepares the request to Parse.com or Hapi
   *
   * @returns object:
   *  {code: response.code,
   *   status: response.status,
   *   json: response.json()
   */
  async _fetch (opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts)

    var reqOpts = {
      method: opts.method,
      headers: {
      }
    }




    reqOpts.headers['Accept'] = 'application/json'
    reqOpts.headers['Content-Type'] = 'application/json'


    if (this._sessionToken) {
      reqOpts.headers['X-Authorization'] = this._sessionToken
    } else{
      reqOpts.headers['X-Authorization'] = ''
    }

    if (opts.method === 'PATCH') {
      reqOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body)
    }

    let url = this.API_BASE_URL + opts.url
    let res = {}

    var response;
    if(shouldCallApi){
      response = await fetch(url, reqOpts)
    }
    else{
      response = null;
      response = {
        status:0,
        json:{
          error_msg:['You do not seem to have internet connectivity. Please check your connection and try again.']
        }
      }
      return response;
    }



    console.log("response", response);

    res.headers = response.headers
    res.status = response.status



    res.code = response.code

    if (res.status == '500') {
      this.showAlert('Internal server error')
      res.json = {Failure : 'Internal server error'}
      status = res.status
      return res;
    }
    else if(response.status != 204){
      return response.json()
        .then((json) => {
          res.json = json
          return res
        })
    }
    else{
      res.json = {success : 'Logged out successfully.'}
      return res;
    }
  }

async _fetchCard (opts,token) {
  opts = _.extend({
    method: 'GET',
    url: null,
    body: null,
    callback: null
  }, opts)

  var reqOpts = {
    method: opts.method,
    headers: {
    }
  }

  reqOpts.headers['Accept'] = 'application/json'
  reqOpts.headers['Content-Type'] = 'application/json'

  reqOpts.headers['Authorization'] = 'Bearer ' + token

  if (this._sessionToken) {
    reqOpts.headers['X-Authorization'] = this._sessionToken
  } else{
    reqOpts.headers['X-Authorization'] = ''
  }

  if (opts.method === 'PATCH') {
    reqOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  if (opts.body) {
    reqOpts.body = JSON.stringify(opts.body)
  }

  let url = opts.url
  let res = {}


  console.log("url", url);
  console.log("param", reqOpts);

  var response;
  if(shouldCallApi){
    response = await fetch(url, reqOpts)
  }
  else{
    response = {
      status:0,
      json:{
        error_msg:['You do not seem to have internet connectivity. Please check your connection and try again.']
      }
    }
    return response;
  }

  res.headers = response.headers
  res.status = response.status
  res.code = response.code
  if(response.status != 204){
    return response.json()
      .then((json) => {
        res.json = json
        return res
      })
  }
  else{
    res.json = {success : 'Logged out successfully.'}
    return res;
  }
}

  urlWithUserId (sub_url, user_id){

     var sub_url_part = sub_url;
     var url_path = sub_url_part.concat(user_id);

     return url_path;
 }

};
