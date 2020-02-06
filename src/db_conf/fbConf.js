//driver-hive
import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyANsHHL4eTf5oxS0psPWhT83MzywqcqRzs",
    authDomain: "driverhive.firebaseapp.com",
    databaseURL: "https://driverhive.firebaseio.com",
    projectId: "driverhive",
    storageBucket: "driverhive.appspot.com",
    messagingSenderId: "324038327377",
    appId: "1:324038327377:web:020f432b4bba845a"
}
const Firebase = firebase.initializeApp(config);
export default Firebase;