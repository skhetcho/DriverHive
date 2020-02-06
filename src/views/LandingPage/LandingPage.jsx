/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// firebase configuration
import firebase from '../../db_conf/fbConf';

// styles
import './styles.css'

// core components
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import TextInput from 'components/TextInput/TextInput.jsx';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";



// media assets
import Calendar from '../../assets/img/calendar.png';
import Friendship from '../../assets/img/friendship.png';
import Car from '../../assets/img/car.png';


import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";


const dashboardRoutes = [];

class LandingPage extends React.Component {
  constructor() {
    super();
    // this.setState.bind(this);
    this.state = {
      email: "",
      ThankYouButton: false,
      userEmailVerified: true,
      Loggedin: false,
      clearInput: React.createRef(),
    }
  }
  componentWillMount() {
    var that = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState({ Loggedin: true, }, () => {
          if (user.emailVerified === false) {
            that.setState({ userEmailVerified: false })
          }
        })
      }
    });
  }
  _handleButton(pageName) {
    this.props.history.push(pageName);
  }


  _handleChange(event, id) {
    this.setState({ [id]: event.target.value });
  }

  validate = () => {
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
    if (regEmail.test(document.getElementById("email").value) === false) {
      return false;
    }
    else {
      return true;
    }
  }
  callWithoutArgument = () => {
    //Calling a function of other class (without arguments)
    var onrequest = new TextInput().onRequest();
    onrequest();
  };
  sendEmailForVerification() {
    firebase
      .auth()
      .onAuthStateChanged(function (user) {
        user.sendEmailVerification()
          .catch((error) => {
            console.log(error)
          })
      });
  }
  _handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    // var that = this;
    if (isValid) {
      this.setState({ ThankYouButton: true }, () => {
        const db = firebase.firestore();
        db
          .collection("subscribers")
          .add({
            email: document.getElementById("email").value,
          })
          .then(() => {
            this.state.clearInput.current.clearInput()
          })
          .catch((error) => {
            console.log("_handleSubmit error: " + error)
          });
      })
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ minHeight: window.innerHeight, background: 'linear-gradient(0deg, rgba(218,16,91,1) 0%, rgba(0,212,255,1) 100%)' }}>
        {this.state.userEmailVerified === false ? <div style={{ position: 'fixed', paddingTop: 79, zIndex: 16, width: '100%' }}>
          <SnackbarContent
            message={
              <div style={{ flexDirection: 'column' }}>
                <span>
                  <b>INFO ALERT: </b>Please verify your email by clicking the link we sent to your email or click the button to resend you an email!
                </span>
                <Button color="success" style={{ marginLeft: 10 }} onClick={() => this.sendEmailForVerification()} >Resend</Button>
              </div>
            }
            color="warning"
            height={10}
          />
        </div> :
          <div></div>
        }
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Driver Hive"
          rightLinks={<HeaderLinks isLogged={this.state.Loggedin} />}
          fixed
          changeColorOnScroll={{
            height: 80,
            color: "white"
          }}
          {...rest}
        />
        <div>
          <GridContainer style={{ minHeight: "100%", width: '100%', margin: 0 }}>
            <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100 }}>
              <Card className={classes.textCenter}>
                <CardHeader color="danger" style={{ fontSize: 18 }}>Community</CardHeader>
                <CardBody>
                  <img src={Friendship} alt="friendship" style={{ height: 100 }} />
                  <h4 style={{ fontWeight: 'bold' }}>Stay Involved with The Community</h4>
                  <p>
                    Press <span style={{ fontWeight: 'bold' }}>Engage</span> to learn more about the latest news, updates on ride sharing in BC and stay on top of eveything new on there. Connect now!
                  </p>
                  <Button color="primary" onClick={() => this._handleButton("community")}>Engage</Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100 }}>
              <Card className={classes.textCenter}>
                <CardHeader color="danger" style={{ fontSize: 18 }}>Drive</CardHeader>
                <CardBody>
                  <img src={Car} alt="car" style={{ height: 100 }} />
                  <h4 style={{ fontWeight: 'bold' }}>Become a Ride Sharing Driver</h4>
                  <p>
                    Press <span style={{ fontWeight: 'bold' }}>Start</span> and proceed with your easy step-by-step application to apply across all ride sharing companies like Uber and Lyft
                  </p>
                  <Button color="primary" onClick={() => this._handleButton("driver-reg")}>Start</Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100 }}>
              <Card className={classes.textCenter}>
                <CardHeader color="danger" style={{ fontSize: 18 }}>Engage</CardHeader>
                <CardBody>
                  <img src={Calendar} alt="calendar" style={{ height: 100 }} />
                  <h4 style={{ fontWeight: 'bold' }}>Attend our Informative Event</h4>
                  <p>
                    Press <span style={{ fontWeight: 'bold' }}>Attend</span> and registration to attend our events for ride sharing drivers to learn what you need to know to get started
                  </p>
                  <Button color="primary" onClick={() => this._handleButton("events")}>Attend</Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <div style={{ width: '100%', margin: 0, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', maxWidth: 500, flexDirection: 'row' }}>
                <div style={{ flex: 3 / 4, padding: 15 }}>
                  <TextInput
                    ref={this.state.clearInput}
                    id="email"
                    name="email"
                    fieldType="email"
                    label="Email address"
                    value=''
                    locked={false}
                    active={false}
                  />
                </div>
                <div style={{ flex: 1 / 4, paddingTop: 15, paddingBottom: 15, paddingRight: 15 }}>
                  <Button color={this.state.ThankYouButton ? "success" : "danger"} onClick={this._handleSubmit}>{this.state.ThankYouButton ? "Thank You" : "Subscribe"}</Button>
                </div>
              </Card>

            </div>
          </div>
        </div>
        <input type="checkbox" id="example-five-checkbox" />
        <label id="example-five" for="example-five-checkbox">@credit</label>
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(LandingPage);
