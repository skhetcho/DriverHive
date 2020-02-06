/*!

* Coded by DriverHive

*/

import React from "react";
import firebase from '../../db_conf/fbConf';

export default class SignUp extends React.Component {
  componentWillMount() {
    var that = this;
    firebase.auth().signOut().then(function () {

      that.props.history.push('/');

    }).catch(function (error) {
      // An error happened.
    });
  }
  render() {
    return (
      <div></div>
    )

  }
}