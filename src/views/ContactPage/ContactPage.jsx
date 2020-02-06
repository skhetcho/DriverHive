/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';

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
import TextField from '@material-ui/core/TextField';


// map
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

// firebase configuration
import firebase from '../../db_conf/fbConf';

const dashboardRoutes = [];
class ContactPage extends React.Component {
    constructor() {
        super();
        this.state = {
            userEmailVerified: true,
            Loggedin: false,
            toggleModal: false,
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
                    if (user.emailVerified == false) {
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
        var that = this;
        const isValid = this.validate();
        if (isValid) {
            const db = firebase.firestore();
            const userRef = db
                .collection("contactRequests")
                .add({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    phone: document.getElementById("phone").value,
                    message: document.getElementById("message").value
                })
                .then(() => {
                    Object.keys(this.state.clearInput).map(i => {
                        this.state.clearInput[i].current.clearInput()
                    })
                    document.getElementById("message").value = "";
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
                        <GridItem xs={12} sm={12} md={7} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', paddingTop: 100, flexDirection: 'column', display: 'relative' }}>
                            <Card style={{ width: "100%", height: 350 }}>
                                <div>
                                    <div style={{ height: 350 }}>
                                        <Map google={this.props.google} zoom={16} style={{ borderTopLeftRadius: 7, borderTopRightRadius: 6 }} initialCenter={{
                                            lat: 49.2383593,
                                            lng: -123.049624119305
                                        }}>

                                            <Marker onClick={this.onMarkerClick}
                                                name={'Current location'} />
                                        </Map>
                                    </div>
                                    <Card style={{ flexDirection: 'row', width: "100%", margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <table>
                                                    <tr>
                                                        <Button href="https://www.google.com/maps/place/2725+Kingsway,+Vancouver,+BC+V5R+5H4" target="_blank" color="primary" round><LocationOnIcon /> 2725 Kingsway, Vancouver, B.C.</Button>
                                                        {/* <td style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                            <PhoneIcon style={{ fontSize: 15, marginBottom: 10 }} />
                                                            <p style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10, }}></p>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <Button color="primary" round><ScheduleIcon /> Mon - Fri: 9AM - 5PM</Button>
                                                        {/* <td style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <EmailIcon style={{ fontSize: 15, marginBottom: 10 }} />
                                                            <p style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10, }}></p>
                                                        </td> */}
                                                    </tr>
                                                </table>
                                            </div>
                                            {/* <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}> */}


                                            {/* <a style={{ color: '#d35400', display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Button color="primary" round><LocationOnIcon />2725 Kingsway, Vancouver, B.C.</Button> */}

                                            {/* <LocationOnIcon style={{ fontSize: 15, marginBottom: 10 }} />
                                                    <p style={{ marginLeft: 10, fontSize: 15, fontWeight: 'bold' }}>
                                                        2725 Kingsway, Vancouver, B.C.
                                                    </p> */}
                                            {/* </a>
                                            </div>
                                            <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <a style={{ color: '#d35400', display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Button color="primary" round><ScheduleIcon />Mon - Fri: 9AM - 5PM</Button>
                                                </a>
                                            </div> */}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ textAlign: 'left', marginLeft: 18, marginTop: 10 }}>
                                                <table>
                                                    <tr>
                                                        <Button href="tel:+16044094331" color="primary" round><PhoneIcon /> +1 604-409-4331</Button>
                                                        {/* <td style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                            <PhoneIcon style={{ fontSize: 15, marginBottom: 10 }} />
                                                            <p style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10, }}></p>
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <Button href="mailto:contact@driverhive.ca" color="primary" round><EmailIcon /> contact@driverhive.ca</Button>
                                                        {/* <td style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <EmailIcon style={{ fontSize: 15, marginBottom: 10 }} />
                                                            <p style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10, }}></p>
                                                        </td> */}
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Card>

                        </GridItem>
                        <GridItem xs={12} sm={12} md={5} style={{ display: 'flex', alignItems: 'center', paddingTop: window.innerWidth <= 458 ? 155 : 129 }}>
                            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                                <CardHeader color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Contact Form</CardHeader>
                                <CardBody>
                                    <div style={{ margin: 15 }}>
                                        <TextInput
                                            ref={this.state.clearInput.name}
                                            id="name"
                                            name="name"
                                            type="texts"
                                            value=""
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
                                            value=""
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
                                            value=""
                                            label="Phone number"
                                            locked={false}
                                            active={false}
                                        />
                                    </div>
                                    <div style={{ margin: 15 }}>
                                        <TextField
                                            style={{ width: '100%' }}
                                            id="message"
                                            label="Message"
                                            multiline
                                            rows="3"
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </div>
                                    <div style={{ margin: 15 }}>
                                        <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={this._handleSubmit}>Send</Button>
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

ContactPage.propTypes = {
    classes: PropTypes.object
};

export default GoogleApiWrapper({
    apiKey: ("AIzaSyDmddl39YzIYGaeDHZmFmso83qVSaawh9M")
})(ContactPage)