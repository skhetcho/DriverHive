/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// firebase configuration
import firebase from '../../db_conf/fbConf';

// styles
import './styles.css'

// assets
import Email from '../../assets/img/email.png';


// core components
import Header from "components/Header/Header.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import TextInput from 'components/TextInput/TextInput.jsx';
import Modal from "components/Modal/Modal.jsx";





// 3rd party components to be usedZ
import StepWizard from 'react-step-wizard';


export default class SignUp extends React.Component {
    constructor() {
        super();
        this.setState.bind(this);
        this.state = {
            keyboardAppear: false,
            modalTitle: "",
            modalDescription: "",
            toggleModal: React.createRef(),
        }
    }
    componentWillMount() {
        var that = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.props.history.push('/GetInfo');
            }
        });
    }
    componentDidMount() {
        // firebase.auth().onAuthStateChanged(function(user) {
        //     if (user) {
        //         that.props.history.push('/welcome');              
        //     } 
        //   });
        let _initialWindownSize = window.innerHeight;
        let keyboardAppearCondition = false;
        var that = this;
        function reportWindowSize() {
            if (window.innerHeight != _initialWindownSize) {
                keyboardAppearCondition = true;
            }
            else {
                keyboardAppearCondition = false;
            }
            that.setState({ keyboardAppear: keyboardAppearCondition })
        }
        window.onresize = reportWindowSize;
    }
    checkuserThenSendEmailVerification() {
        firebase
            .auth()
            .onAuthStateChanged(function (user) {
                user.sendEmailVerification()
                    .then(function () {
                        firebase
                            .auth()
                            .signOut()
                            .then(function () {
                                var userRef = firebase.auth().currentUser;
                            }).catch(function (error) {
                            });
                    }).catch(function (error) {
                    });
            });
    }
    setInstance = SW => this.setState({ SW })
    validate = () => {
        const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
        if (regEmail.test(document.getElementById("email").value) === false) {
            return false;
        }
        else {
            return true;
        }
    }
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this._signUp();
        }
    }

    //here need to be implement backend firebase
    _signUp() {
        //check validation
        const isValid = this.validate();
        if (isValid) {
            var that = this;
            firebase
                .auth()
                .createUserWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value)
                .then(function (user) {

                    firebase.firestore()
                        .collection("UserRegistration")
                        .add({
                            name: document.getElementById("name").value,
                            username: document.getElementById("username").value,
                            email: document.getElementById("email").value,
                            uid: user.user.uid
                        })
                        .catch((error) => {
                        })
                }).then(() => {
                    that.checkuserThenSendEmailVerification();
                }).then(() => {
                    //switch card
                    const switchCard = this.state.SW;
                    switchCard.nextStep();
                }).catch(function (error) {
                    if (error.code === "auth/weak-password") {
                        that.setState({
                            modalTitle: "Weak Password",
                            modalDescription: "Your password must be at least 6 characters long"
                        }, () => that.state.toggleModal.current.toggleModal(true))
                    }
                    else if (error.code === "auth/email-already-in-use") {
                        that.setState({
                            modalTitle: "Email Already Exists",
                            modalDescription: "This email already exists. Either login or reset your password by contacting us"
                        }, () => that.state.toggleModal.current.toggleModal(true))
                    }
                });
        }

    }

    render() {
        const { classes, ...rest } = this.props;
        const { SW } = this.state;
        const dashboardRoutes = [];
        return (
            <div style={{ background: 'linear-gradient(0deg, rgba(218,16,91,1) 0%, rgba(0,212,255,1) 100%)' }}>
                <Header
                    color="transparent"
                    routes={dashboardRoutes}
                    brand="Driver Hive"
                    rightLinks={<HeaderLinks />}
                    fixed
                    changeColorOnScroll={{
                        height: 80,
                        color: "white"
                    }}
                    {...rest}
                />
                <div style={{ minHeight: "100%", width: '100%', margin: 0, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: window.innerWidth <= 458 ? 155 : 129, justifyContent: 'center' }}>
                        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', maxWidth: 500, marginRight: 15, marginLeft: 15 }}>
                            <StepWizard
                                isHashEnabled
                                instance={this.setInstance}
                            >
                                <CardHeader hashKey={'FirstStep'} color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Account Registration</CardHeader>
                                <CardHeader hashKey={'FinalStep'} color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Email Sent</CardHeader>

                            </StepWizard>

                            <StepWizard
                                isHashEnabled
                                instance={this.setInstance}
                            >
                                <Card hashKey={'FirstStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Let's get you account created</p>
                                    </div>
                                </Card>
                                <Card hashKey={'FinalStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Check your email for a <p style={{ fontWeight: 'bold' }}>confirmation link</p></p>
                                    </div>
                                </Card>
                            </StepWizard>
                            <CardBody>
                                <StepWizard
                                    isHashEnabled
                                    instance={this.setInstance}
                                >
                                    <div hashKey={'FirstStep'}>
                                        <div style={{ margin: 15 }}>
                                            <TextInput
                                                id="name"
                                                name="name"
                                                label="Full name"
                                                value=''
                                                locked={false}
                                                active={false}
                                                onKeyPress={this._handleKeyDown}
                                            />
                                        </div>
                                        <div style={{ margin: 15 }}>
                                            <TextInput
                                                id="username"
                                                name="username"
                                                label="Username"
                                                mandatoryUserName={true}
                                                value=''
                                                locked={false}
                                                active={false}
                                                onKeyPress={this._handleKeyDown}
                                            />
                                        </div>
                                        <div style={{ margin: 15 }}>
                                            <TextInput
                                                id="email"
                                                name="email"
                                                fieldType="email"
                                                label="Email address"
                                                value=''
                                                locked={false}
                                                active={false}
                                                onKeyPress={this._handleKeyDown}
                                            />
                                        </div>
                                        <div style={{ margin: 15 }}>
                                            <TextInput
                                                id="password"
                                                name="password"
                                                fieldType="password"
                                                label="Password"
                                                value=''
                                                locked={false}
                                                active={false}
                                                onKeyPress={this._handleKeyDown}

                                            />
                                        </div>
                                    </div>
                                    <div hashKey={"FinalStep"}>
                                        <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', justifySelf: 'center', textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                            <img src={Email} style={{ height: 100 }} />
                                        </div>
                                    </div>
                                </StepWizard>

                                {(SW) && SW.state.activeStep === 0 ?

                                    <div>
                                        <p>Already have an account? <a style={{ fontWeight: 'bold' }} onClick={() => this.props.history.push("/login")}>Login</a></p>
                                        <Button fullWidth color="success" style={{ justifyContent: 'center' }} onClick={() => this._signUp()} >Create</Button>
                                    </div>
                                    :
                                    <div>
                                        <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={() => this.props.history.push("/login")}>Sign in</Button>
                                    </div>

                                }
                            </CardBody>
                        </Card>

                    </div>
                </div>
                <Modal
                    ref={this.state.toggleModal}
                    open={false}
                    title={this.state.modalTitle}
                    description={this.state.modalDescription}
                    onlySuccessButton={this.state.modalDescription.indexOf("already") > -1 ? true : false}
                    onlyCloseButton={this.state.modalDescription.indexOf("already") > -1 ? true : false}
                    successButtonText={this.state.modalDescription.indexOf("already") > -1 ? "Login" : ""}
                    closeButtonText={this.state.modalDescription.indexOf("already") > -1 ? "Reset Password" : "Close"}
                    successButtonFunction={this.state.modalDescription.indexOf("already") > -1 ? () => this.props.history.push("/login") : {}}
                    closeButtonFunction={this.state.modalDescription.indexOf("already") > -1 ? () => this.props.history.push("/contact-page") : {}}
                />
            </div>
        );
        //}
    }
}


SignUp.propTypes = {
    classes: PropTypes.object
};