/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components


// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// core components
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import TextInput from 'components/TextInput/TextInput.jsx'
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

// map
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

// firebase configuration
import firebase from '../../db_conf/fbConf';

const dashboardRoutes = [];
class EventsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            userEmailVerified: true,
            Loggedin: false,
            clearInput:
            {
                name: React.createRef(),
                email: React.createRef(),
                phone: React.createRef(),
            },
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
        const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; //or any other regexp;
        if (regEmail.test(document.getElementById("email").value) === false) {
            return false;
        }
        if (regPhone.test(document.getElementById("phone").value) === false) {
            return false;
        }
        else {
            return true;
        }
    }
    _handleSubmit = (event) => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            const db = firebase.firestore();
            db
                .collection("eventRegistration")
                .add({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    phone: document.getElementById("phone").value,
                })
                .then(() => {
                    Object.keys(this.state.clearInput).map(i => {
                        return (this.state.clearInput[i].current.clearInput());
                    });
                })
                .catch((error) => {
                    console.log("_handleSubmit error: " + error)
                });
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
                        <GridItem xs={12} sm={12} md={7} style={{ textAlign: 'center', alignItems: 'center', paddingTop: 100, flexDirection: 'column', display: 'relative' }}>
                            <Card style={{ width: "100%", height: 350 }}>
                                <div>
                                    <div style={{ height: 350 }}>
                                        <Map google={this.props.google} zoom={16} style={{ borderTopLeftRadius: 7, borderTopRightRadius: 6 }} initialCenter={{
                                            lat: 49.23818,
                                            lng: -123.05011
                                        }}>

                                            <Marker onClick={this.onMarkerClick}
                                                name={'Current location'} />
                                        </Map>
                                    </div>
                                    <Card style={{ flexDirection: 'row', width: "100%", margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>Event Location</p>
                                                <p style={{ marginLeft: 10, fontSize: 14 }}>Coming soon...</p>
                                            </div>
                                            {/* <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>Date &amp; Time</p>
                                                <p style={{ marginLeft: 10, fontSize: 14 }}>Wed, July 24, 6:00 PM - 9 PM</p>
                                            </div> */}
                                        </div>
                                        {/* <div style={{ flex: 1 }}>
                                            <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <p style={{ fontSize: 16, fontWeight: 'bold' }}>Agenda</p>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <ArrowForwardIosIcon style={{ fontSize: 7 }} /> TO DO ONE
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <ArrowForwardIosIcon style={{ fontSize: 7 }} /> TO DO TWO
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <ArrowForwardIosIcon style={{ fontSize: 7 }} /> TO DO THREE
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div> */}
                                    </Card>
                                </div>
                            </Card>

                        </GridItem>
                        <GridItem xs={12} sm={12} md={5} style={{ display: 'flex', alignItems: 'center', paddingTop: window.innerWidth <= 458 ? 155 : 129 }}>
                            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                                <CardHeader color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Event Form</CardHeader><Card hashKey={'FirstStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Register here to attend the event. We will be in touch with you for your ticket. Registered now to attend out upcoming event.</p>
                                    </div>
                                </Card>
                                <CardBody>
                                    <div style={{ margin: 15 }}>
                                        <TextInput
                                            ref={this.state.clearInput.name}
                                            id="name"
                                            name="name"
                                            value=''
                                            label="Full name"
                                            locked={false}
                                            active={false}
                                        />
                                    </div>
                                    <div style={{ margin: 15 }}>
                                        <TextInput
                                            ref={this.state.clearInput.email}
                                            id="email"
                                            name="email"
                                            value=''
                                            label="Email address"
                                            fieldType="email"
                                            locked={false}
                                            active={false}
                                        />
                                    </div>
                                    <div style={{ margin: 15 }}>
                                        <TextInput
                                            ref={this.state.clearInput.phone}
                                            id="phone"
                                            name="phone"
                                            fieldType="phone"
                                            value=''
                                            label="Phone number"
                                            locked={false}
                                            active={false}
                                        />
                                    </div>
                                    <div style={{ margin: 15 }}>
                                        <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={this._handleSubmit}>Register</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        );
    }
}

EventsPage.propTypes = {
    classes: PropTypes.object
};

export default GoogleApiWrapper({
    apiKey: ("AIzaSyDmddl39YzIYGaeDHZmFmso83qVSaawh9M")
})(EventsPage)