/**
 * Powered by Systango
 * http://www.systango.com
 */

 'use strict';

 import React, { Component, PropTypes } from 'react';
 import { DeviceEventEmitter, Dimensions, Image, ScrollView, Text, TouchableOpacity, Alert, StatusBar, Platform, StyleSheet} from 'react-native';
 import { Container, Content, InputGroup, Input, Icon, View, List, ListItem , Button} from 'native-base';
 import styles from './styles';
 import SpinLoader from '../loaders/SpinLoader';
 import myTheme from '../../themes/base-theme';
 // import ScreenService from '../Screen/screenService.js'
 import {reduxForm} from 'redux-form'
 import dismissKeyboard from 'dismissKeyboard'
 import {Keyboard} from 'react-native';
 import { navObj } from '../../AppNavigator';

 import { bindActionCreators } from 'redux'
 import { connect } from 'react-redux';
 import * as routeActions from '../../actions/route';
 import { Hoshi } from 'react-native-textinput-effects';

 
 var _this;
 var _keyboardWillShowSubscription, _keyboardWillHideSubscription;


 class LoginPage extends Component {


  render() {
    return (
     <Container>
         <Content>
            <View>
            <Text>
               Welcome to app Food-e
            </Text>
            </View>
         </Content>
     </Container>
    );
  }
}




function mapStateToProps (state) {
  return {
   
  }
}

function mapDispatchToProps (dispatch) {
  return {
    
  }
}

export default connect(null, null)(LoginPage);
