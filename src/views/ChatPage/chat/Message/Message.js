import React, { Component } from 'react';
import firebase from '../../../../db_conf/fbConf';
import './Message.css';
export default class Message extends Component {
  constructor() {
    super();
    this.setState.bind(this);
    this.state = {
      name: "",
    }

  }
  componentWillMount() {
    var that = this;
    //here need to be implement backend firebase
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.firestore().collection("UserRegistration").get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().email == user.email) {
              that.setState({ name: doc.data().name })
            }
          });
        });
      }
    });
  }
  render() {
    return (

      <div className={this.state.name == this.props.message.userName ? "messageSessionUser" : "message"}>
        <span className="message__author">
          {this.props.message.userName}:
                </span>
        {this.props.message.message}
      </div>
    )
  }
}