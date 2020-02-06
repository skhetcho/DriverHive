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
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";



// media assets
import News from '../../assets/img/news.png';
import Chat from '../../assets/img/chat.png';

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";


const dashboardRoutes = [];

class CommunityPage extends React.Component {
  constructor() {
    super();
    // this.setState.bind(this);
    this.state = {
      email: "",
      userEmailVerified: true,
      Loggedin: false,
    }
  }
  componentWillMount() {
    var that = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState({ Loggedin: true, }, () => {
          if (user.emailVerified == false) {
            that.setState({ userEmailVerified: false })
          }
        })
      }
    });
  }
  _handleButton(pageName) {
    this.props.history.push(pageName);
  }

  _handleChange(id) {
    this.setState({ [id]: document.getElementById(id).value });
  }
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
  validate = () => {
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
    if (regEmail.test(document.getElementById("email").value) === false) {
      return false;
    }
    else {
      return true;
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ minHeight: window.innerHeight, background: 'linear-gradient(0deg, rgba(218,16,91,1) 0%, rgba(0,212,255,1) 100%)' }}>
        {this.state.userEmailVerified == false ? <div style={{ position: 'fixed', paddingTop: 79, zIndex: 16, width: '100%' }}>
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
            <GridItem xs={12} sm={12} md={6} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100 }}>
              <Card className={classes.textCenter}>
                <CardHeader color="danger" style={{ fontSize: 18 }}>News &amp; Articles</CardHeader>
                <CardBody>
                  <img src={News} style={{ height: 100 }} />
                  <h4 style={{ fontWeight: 'bold' }}>Get Informed Quickly</h4>
                  <p>
                    Press <span style={{ fontWeight: 'bold' }}>More</span> To get the latest news, publications about the Taxi industry and ride-sharing.<br />Stay tuned!
                  </p>
                  <Button color="primary" onClick={() => this._handleButton("news")}>More</Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100 }}>
              <Card className={classes.textCenter}>
                <CardHeader color="danger" style={{ fontSize: 18 }}>Connect</CardHeader>
                <CardBody>
                  <img src={Chat} style={{ height: 100 }} />
                  <h4 style={{ fontWeight: 'bold' }}>Live Chat with Others</h4>
                  <p>
                    Press <span style={{ fontWeight: 'bold' }}>Chat</span> and start connecting with other drivers and people who are interesting in the Taxi and ride sharing industry
                  </p>
                  <Button color="primary" onClick={() => this._handleButton("chat")}>Start</Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <input type="checkbox" id="example-five-checkbox" />
        <label id="example-five" for="example-five-checkbox">@credit</label>
      </div>
    );
  }
}

CommunityPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(CommunityPage);