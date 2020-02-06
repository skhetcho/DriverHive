/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// firebase configuration
import firebase from '../../db_conf/fbConf';
import Message from './chat/Message/Message';
// styles
import './styles.css'
import './Form.css';


// core components
import Header from "components/Header/Header.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";


export default class Chat extends React.Component {
    constructor() {
        super();
        this.setState.bind(this);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            emailError: "",
            toggleModal: false,
            keyboardAppear: false,
            userEmailVerified: true,
            loading: true,
            Loggedin: false,

            userName: 'Guest',
            message: '',
            list: [],
        }
        this.messageRef = firebase.database().ref().child('messages');
        this.listenMessages();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({ 'userName': nextProps.user.displayName });
        }
    }
    handleChange(event) {
        this.setState({ message: event.target.value });
    }
    handleSend() {
        if (this.state.userEmailVerified == true) {
            if (this.state.message) {
                var newItem = {
                    userName: this.state.userName,
                    message: this.state.message,
                }
                this.messageRef.push(newItem);
                this.setState({ message: '' });
            }
        }
        else {
            alert("Please verify your email!")
        }
    }
    handleKeyPress(event) {
        if (event.key !== 'Enter') return;
        this.handleSend();
    }
    listenMessages() {
        this.messageRef
            .limitToLast(10)
            .on('value', message => {
                this.setState({
                    list: Object.values(message.val()),
                    loading: false,
                });
            });
    }
    componentWillMount() {
        var that = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({Loggedin: true})
                if (user.emailVerified) {
                    firebase.firestore().collection("UserRegistration").get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            console.log(doc.id, " => ", doc.data());
                            if (doc.data().email == user.email) {
                                that.setState({ userName: doc.data().name })
                            }
                        });
                    });
                }
                else {
                    that.setState({ userEmailVerified: false })
                }
            } else {
                that.props.history.push('/login');
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

    render() {


        const { classes, ...rest } = this.props;
        const { SW } = this.state;
        const dashboardRoutes = [];
        return (
            <div style={{ background: 'linear-gradient(0deg, rgba(218,16,91,1) 0%, rgba(0,212,255,1) 100%)' }}>
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
                <div style={{ minHeight: "100%", width: '100%', margin: 0, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: window.innerWidth <= 458 ? 155 : 129, justifyContent: 'center' }}>
                        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', maxWidth: 500, marginRight: 15, marginLeft: 15 }}>
                            <CardHeader hashKey={"FirstStep"} color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Chat Board</CardHeader>
                            <CardBody>
                                <div style={this.state.loading ? { display: 'flex' } : { display: 'none' }} class="Loader">
                                    <div class="sk-circle">
                                        <div class="sk-circle1 sk-child"></div>
                                        <div class="sk-circle2 sk-child"></div>
                                        <div class="sk-circle3 sk-child"></div>
                                        <div class="sk-circle4 sk-child"></div>
                                        <div class="sk-circle5 sk-child"></div>
                                        <div class="sk-circle6 sk-child"></div>
                                        <div class="sk-circle7 sk-child"></div>
                                        <div class="sk-circle8 sk-child"></div>
                                        <div class="sk-circle9 sk-child"></div>
                                        <div class="sk-circle10 sk-child"></div>
                                        <div class="sk-circle11 sk-child"></div>
                                        <div class="sk-circle12 sk-child"></div>
                                    </div>
                                </div>
                                <div className="form">
                                    <div className="form__message">
                                        {this.state.list.map((item, index) =>
                                            <Message key={index} message={item} />
                                        )}
                                    </div>
                                    <div className="form__row">
                                        <input
                                            className="form__input"
                                            type="text"
                                            placeholder="Type message"
                                            value={this.state.message}
                                            onChange={this.handleChange.bind(this)}
                                            onKeyPress={this.handleKeyPress.bind(this)}
                                        />
                                        <button
                                            className="form__button"
                                            onClick={this.handleSend.bind(this)}
                                        >
                                            send
                                        </button>
                                    </div>
                                </div>
                                <p> <a style={{ fontWeight: 'bold' }} onClick={() => this.props.history.push("/sign-out")}>SignOut</a></p>
                            </CardBody>
                        </Card>

                    </div>
                </div>
            </div>
        );

    }
}
Chat.propTypes = {
    classes: PropTypes.object
};