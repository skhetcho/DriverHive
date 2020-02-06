/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes

// firebase configuration
import firebase from '../../db_conf/fbConf';

// styles
import './styles.css'


// core components
import Header from "components/Header/Header.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import TextInput from 'components/TextInput/TextInput.jsx';
import Button from "components/CustomButtons/Button.jsx";
import Modal from "components/Modal/Modal.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";



export default class Login extends React.Component {
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
                that.props.history.push('/');
            }
        });
    }
    componentDidMount() {
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
            this._login();
        }
    }

    _login() {
        //check validation
        const isValid = this.validate();
        if (isValid) {
            const that = this;
            firebase
                .auth()
                .signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value)
                .then(function (user) {
                    that.props.history.push('/');
                }).catch(error => {
                    if (error.code === "auth/user-not-found") {
                        that.setState({
                            modalTitle: "User Not Found",
                            modalDescription: "Please make sure you entered the correct email address"
                        }, () => that.state.toggleModal.current.toggleModal(true))
                    }
                    else if (error.code === "auth/wrong-password"){
                        that.setState({
                            modalTitle: "Invalid Password",
                            modalDescription: "You have entered an incorrect password"
                        }, () => that.state.toggleModal.current.toggleModal(true))
                    }
                })
        }
    }
    render() {
        const { classes, ...rest } = this.props;
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
                            <CardHeader color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Sign In</CardHeader>
                            <Card hashKey={'FirstStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Dive in DriverHive</p>
                                </div>
                            </Card>
                            <CardBody>
                                <div>
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
                                <p>Don't have an account? <a style={{ fontWeight: 'bold' }} onClick={() => this.props.history.push("/sign-up")}>Create New</a></p>
                                <div>
                                    <Button fullWidth color="success" style={{ justifyContent: 'center' }} onClick={() => this._login()} >Login</Button>
                                </div>
                            </CardBody>
                        </Card>

                    </div>
                </div>
                <Modal
                    ref={this.state.toggleModal}
                    open={false}
                    title={this.state.modalTitle}
                    description={this.state.modalDescription}
                    onlySuccessButton={false}
                    onlyCloseButton={false}
                />
            </div>
        );
    }
}
Login.propTypes = {
    classes: PropTypes.object
};