/*!

* Coded by DriverHive

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// firebase configuration
import firebase from '../../db_conf/fbConf';


// core components
import Header from "components/Header/Header.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";


// 3rd party components to be usedZ
import StepWizard from 'react-step-wizard';
import FileUploader from "react-firebase-file-uploader";


export default class DriverPage extends React.Component {
    constructor() {
        super();
        this.setState.bind(this);
        this.state = {

            toggleModal: false,
            keyboardAppear: false,
            userID: "",
            LicenceStorage: "",
            InsuranceStorage: "",
            PhotoStorage: "",
            SecoundIDStorage: "",
            firebasevbal: "",
            firebaseInsurance: "",
            firebasePhoto: "",
            firebaseSecoundID: "",
            Loggedin: false,

        }
    }
    componentWillMount() {
        var that = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({ userID: user.uid, LicenceStorage: `${user.uid}` + "/Licence/", InsuranceStorage: user.uid + "/Insurance/", PhotoStorage: user.uid + "/Photo/", SecoundIDStorage: user.uid + "/SecoundaryID/", Loggedin: true })
                var p = firebase.storage().ref(that.state.LicenceStorage);
                var insuranceStore = firebase.storage().ref(that.state.InsuranceStorage);
                var photoStore = firebase.storage().ref(that.state.PhotoStorage);
                var secoundIDStore = firebase.storage().ref(that.state.SecoundIDStorage);
                that.setState({ firebasevbal: p, firebaseInsurance: insuranceStore, firebasePhoto: photoStore, firebaseSecoundID: secoundIDStore })
                //console.log(that.state.SecoundIDStorage)
                //that.props.history.push('/welcome');              
            }
            else {
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
    setInstance = SW => this.setState({ SW })
    handleUploadSuccess = filename => {
        var that = this;

        firebase.functions().httpsCallable('UploadFrontLicence')({ file: filename })
            .then(response => {
                const p = JSON.parse(response.data);
                var newStr = encodeURIComponent(p.name)
                const filecheck = filename.substr(filename[0], filename.indexOf('.'));

                if (filecheck == 'Flicence') {
                    that.setState({ avatarURL: "https://firebasestorage.googleapis.com/v0/b/driverhive.appspot.com/o/" + newStr + "?alt=media&token=" + p.downloadTokens })
                }
                if (filecheck == 'Blicence') {
                    that.setState({ avatarURLBack: "https://firebasestorage.googleapis.com/v0/b/driverhive.appspot.com/o/" + newStr + "?alt=media&token=" + p.downloadTokens })
                }
                if (filecheck == 'Insurance') {
                    that.setState({ avatarURLInsurance: "https://firebasestorage.googleapis.com/v0/b/driverhive.appspot.com/o/" + newStr + "?alt=media&token=" + p.downloadTokens })
                }
                if (filecheck == 'Photo') {
                    that.setState({ avatarURLPhoto: "https://firebasestorage.googleapis.com/v0/b/driverhive.appspot.com/o/" + newStr + "?alt=media&token=" + p.downloadTokens })
                }
                if (filecheck == 'Secondary') {
                    that.setState({ avatarURLSecoundID: "https://firebasestorage.googleapis.com/v0/b/driverhive.appspot.com/o/" + newStr + "?alt=media&token=" + p.downloadTokens })
                }
            })
            .catch((error) => console.log('Error: ', error));
    };

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
                            <CardHeader hashKey={'FirstStep'} color="danger" style={{ fontSize: 18, textAlign: 'center' }}>Driver Registration</CardHeader>
                            <StepWizard
                                isHashEnabled
                                instance={this.setInstance}
                            >
                                <Card hashKey={'FirstStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Upload your class 4 driver's licence front and back photos</p>
                                    </div>
                                </Card>
                                <Card hashKey={'SecondStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Upload your car insurance front-side photo</p>
                                    </div>
                                </Card>
                                <Card hashKey={'ThirdStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Take your photo as a selfie from your shoulders and up</p>
                                    </div>
                                </Card>
                                <Card hashKey={'FourthStep'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 0, padding: 0, borderRadius: 0 }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 300, margin: 10 }}>Upload the front side of a secondary ID</p>
                                    </div>
                                </Card>
                            </StepWizard>
                            <CardBody>
                                <StepWizard
                                    isHashEnabled
                                    instance={this.setInstance}
                                >
                                    <div hashKey={'FirstStep'} style={{ width: '100%', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flex: 1 }}>
                                            <div style={{ flex: 1 }}>
                                                {this.state.avatarURL && <img src={this.state.avatarURL} style={{ objectFit: 'contain' }} height='150' width='150' />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                {this.state.avatarURLBack && <img src={this.state.avatarURLBack} style={{ objectFit: 'contain' }} height='150' width='150' />}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', paddingTop: 25, paddingBottom: 25 }}>
                                            <label style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor', marginRight: 10, textAlign: 'center' }}>
                                                Front Image
                                            <FileUploader
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    name="avatar"
                                                    filename={'Flicence'}
                                                    storageRef={this.state.firebasevbal}
                                                    onUploadStart={this.handleUploadStart}
                                                    onUploadError={this.handleUploadError}
                                                    onUploadSuccess={this.handleUploadSuccess}
                                                    onProgress={this.handleProgress}
                                                />
                                            </label>
                                            <label style={{ flex: 1, backgroundColor: '#4caf50', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor', marginLeft: 10, textAlign: 'center' }}>
                                                Back Image
                                            <FileUploader
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    name="avatar"
                                                    filename={'Blicence'}
                                                    storageRef={this.state.firebasevbal}
                                                    onUploadStart={this.handleUploadStart}
                                                    onUploadError={this.handleUploadError}
                                                    onUploadSuccess={this.handleUploadSuccess}
                                                    onProgress={this.handleProgress}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div hashKey={"SecondStep"}>
                                        <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', justifySelf: 'center', textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                            <div>
                                                {this.state.avatarURLInsurance && <img src={this.state.avatarURLInsurance} style={{ objectFit: 'contain' }} height='150' width='150' />}
                                            </div>
                                            <div>
                                                <label style={{ backgroundColor: '#4caf50', color: 'white', paddingRight: 30, paddingLeft: 30, paddingTop: 10, paddingBottom: 10, borderRadius: 4, pointer: 'cursor', marginRight: 10, textAlign: 'center' }}>
                                                    Front Image
                                            <FileUploader
                                                        style={{ display: 'none' }}
                                                        accept="image/*"
                                                        name="avatar"
                                                        filename={'Insurance'}
                                                        storageRef={this.state.firebaseInsurance}
                                                        onUploadStart={this.handleUploadStart}
                                                        onUploadError={this.handleUploadError}
                                                        onUploadSuccess={this.handleUploadSuccess}
                                                        onProgress={this.handleProgress}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div hashKey={"ThirdStep"}>
                                        <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', justifySelf: 'center', textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                            <div>
                                                {this.state.avatarURLPhoto && <img src={this.state.avatarURLPhoto} style={{ objectFit: 'contain' }} height='150' width='150' />}
                                            </div>
                                            <div>
                                                <label style={{ backgroundColor: '#4caf50', color: 'white', paddingRight: 30, paddingLeft: 30, paddingTop: 10, paddingBottom: 10, borderRadius: 4, pointer: 'cursor', marginRight: 10, textAlign: 'center' }}>
                                                    Personal Photo
                                            <FileUploader
                                                        style={{ display: 'none' }}
                                                        accept="image/*"
                                                        name="avatar"
                                                        filename={'Photo'}
                                                        storageRef={this.state.firebasePhoto}
                                                        onUploadStart={this.handleUploadStart}
                                                        onUploadError={this.handleUploadError}
                                                        onUploadSuccess={this.handleUploadSuccess}
                                                        onProgress={this.handleProgress}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div hashKey={"FourthStep"}>
                                        <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', justifySelf: 'center', textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                            <div>
                                                {this.state.avatarURLSecoundID && <img src={this.state.avatarURLSecoundID} style={{ objectFit: 'contain' }} height='150' width='150' />}
                                            </div>
                                            <div>
                                                <label style={{ backgroundColor: '#4caf50', color: 'white', paddingRight: 30, paddingLeft: 30, paddingTop: 10, paddingBottom: 10, borderRadius: 4, pointer: 'cursor', marginRight: 10, textAlign: 'center' }}>
                                                    Front Image
                                            <FileUploader
                                                        style={{ display: 'none' }}
                                                        accept="image/*"
                                                        name="avatar"
                                                        filename={'Secondary'}
                                                        storageRef={this.state.firebaseSecoundID}
                                                        onUploadStart={this.handleUploadStart}
                                                        onUploadError={this.handleUploadError}
                                                        onUploadSuccess={this.handleUploadSuccess}
                                                        onProgress={this.handleProgress}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </StepWizard>
                                {(SW) && <InstanceDemo SW={SW} />}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}
const InstanceDemo = ({ SW }) => (SW.state.activeStep === 0 ?
    <div>
        <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={SW.nextStep}>Next</Button>
    </div>
    :
    SW.state.activeStep === 3 ?
        <div>
            <Button fullWidth color="success" style={{ justifyContent: 'center' }} onClick={SW.nextStep}>Complete</Button>
            <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={SW.previousStep}>Previous</Button>
        </div>
        :
        <div>
            <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={SW.nextStep}>Next</Button>
            <Button fullWidth color="primary" style={{ justifyContent: 'center' }} onClick={SW.previousStep}>Previous</Button>
        </div>
);

DriverPage.propTypes = {
    classes: PropTypes.object
};