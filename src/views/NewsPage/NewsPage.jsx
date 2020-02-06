/*!

* Coded by DriverHive

#   Note: this.state.key is NOT the key from the blogs_x.json file
    it's from the blogFileCounter.json
    we are storing each blogs_X.json JSON output
    in its corresponding state based on its file coult
    Like:
    this.state = {
        1: [ <blogs_1.json output>
            ...
        ]
        2: [ <blogs_2.json output>
            ...
        ]
        ...
    } 


#   Posts in the JSON file are arranged from 
    the oldest "first entry"
    to the newest "last entry" 
    to a range from 1 - 10 post per file.

#   We are reversing the order of the posts
    from the parsed file because we want to
    show the most recent blog posts first to
    the users, hence we called the key number
    in the blogs file which is element 0 like:
    [
        {
            key: <number of posts in this file>
        },
        blogs: [
            {
                ...
            }
        ]
    ]
    and reverse requesting the post in the mapping section

#   As you notice we are requesting this.state[this.state.key]
    to dynamically request the content of blogs_X.json content
    from its corresponding state.

#   To reverse:
    mappping index i:
    i = 0, 1, 2, 3 ... this.state[this.state.key][0].key - 1
    if we assumned that blogs_1.json has 3 posts "this.state[this.state.key][0].key = 3"
    then:
    i = 0, 1, 2

    therefore if we want to request the last content (ex. "title" of last post)
    we would do:
        this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].title
    this means:
    1) go to this.state of the corresponding blogs_X.json state based on key (ex. 1 for blogs_1.json)
        this.state.1
    2) get to the second entry
        this.state.1[1]
    3) get the "blogs" element wihin the second entry
        this.state.1[1].blogs
    4) get the entry corresponing content with the mapping index i (ex. if it was the first loop which mean i = 0)
    since we assumed that blogs_1 has 3 posts
    then:
        this.state.1[1].blogs[3 - (0 + 1)]
    5) this would return the content of this.state.1[1].blogs[2] according to our structure
    therefore if we want to request title we do:
    this.state.1[1].blogs[3 - (0 + 1)].title
    which is:
    this.state.1[1].blogs[2].title
    6) repeat this process until i = this.state[this.state.key][0].key - 1
    last loop should be:
    this.state.1[1].blogs[3 - (2 + 1)].title
    which is:
    this.state.1[1].blogs[0].title

*/

import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// firebase configuration
import firebase from '../../db_conf/fbConf';


// styles
import './styles.css'


// core components
import Header from "components/Header/Header.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

export default class NewsPage extends React.Component {
    constructor() {
        super();
        this.setState.bind(this);
        this.state = {
            key: null,
            loading: true,
            keyboardAppear: false,
            userEmailVerified: true,
            Loggedin: false,

        }
    }
    componentWillMount() {
        var that = this;
        firebase.storage('gs://driverhive-blogs')
            .ref("blogFileCounter.json")
            .getDownloadURL()
            .then(url => {
                fetch(`https://cors-anywhere.herokuapp.com/${url}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(keyJson => {
                        // store blogs counter "which is the last file in our db for blogs_X.json"
                        // in this.state.key
                        this.setState({ key: keyJson.key });
                    }).then(() => {
                        this.fetchNews(this.state.key);
                    })
                    .catch((error) => console.log(error))
            }).then(() => {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        that.setState({ Loggedin: true, }, () => {
                            if (user.emailVerified === false) {
                                that.setState({ userEmailVerified: false })
                            }
                        })
                    }
                });
            })
    }
    componentDidMount() {
        let _initialWindownSize = window.innerHeight;
        let keyboardAppearCondition = false;
        var that = this;
        function reportWindowSize() {
            if (window.innerHeight !== _initialWindownSize) {
                keyboardAppearCondition = true;
            }
            else {
                keyboardAppearCondition = false;
            }
            that.setState({ keyboardAppear: keyboardAppearCondition })
        }
        window.onresize = reportWindowSize;
    }

    // dynamically get the content of the last blogs_xxx.json news
    fetchNews(key) {
        // Create a reference to the file we want to download
        firebase.storage('gs://driverhive-blogs')
            .ref(`blogs_${key}.json`)
            .getDownloadURL()
            .then(url => {
                fetch(`https://cors-anywhere.herokuapp.com/${url}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(Json => {
                        // store the returned json in a corresponding name
                        // based on the file count:
                        // ex. if blogs_1.json then 1: [] which is this.state.1
                        this.setState({ [key]: Json, loading: false });
                    })
                    .catch((error) => console.log(error))
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
    // _moreArticles = () => {
    //     console.log("executed")
    //     return (
    //         <Card style={{ maxWidth: 500, marginRight: 15, marginLeft: 15, cursor: 'pointer' }}>
    //             <CardBody>
    //                 <h4>xxxxxx</h4>
    //                 <p>zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz</p>
    //                 <p><small>ddd</small></p>
    //             </CardBody>
    //         </Card>
    //     )
    // }



    render() {
        const { classes, ...rest } = this.props;
        const dashboardRoutes = [];
        return (
            <div style={{ background: 'linear-gradient(0deg, rgba(218,16,91,1) 0%, rgba(0,212,255,1) 100%)' }} >
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
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: window.innerWidth <= 458 ? 155 : 129, justifyContent: 'center', flexDirection: 'column', marginRight: 15, marginLeft: 15 }}>
                        {/* <Button onClick={() => console.log(this.state[this.state.key][0].key)}>json</Button> */}
                        {
                            this.state[this.state.key] && [...Array(parseInt(this.state[this.state.key][0].key))].map((e, i) =>
                                <Card key={i} onClick={() => window.open(this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].url, "_blank")} style={{ maxWidth: 500, cursor: 'pointer' }}>
                                    <img style={{ maxHeight: 250, width: '100%', objectFit: 'cover', borderTopLeftRadius: 6, borderTopRightRadius: 6 }} src={this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].image} alt="Card-img-cap" />
                                    <CardBody>
                                        <p><small>{this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].date}</small></p>
                                        <h4>{this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].title}</h4>
                                        <p>{this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].description}</p>
                                        <p><small>{this.state[this.state.key][1].blogs[this.state[this.state.key][0].key - (i + 1)].source}</small></p>
                                    </CardBody>
                                </Card>
                            )

                        }
                        <Button style={this.state.loading ? { display: 'none' } : { display: 'flex', marginBottom: 15}} onClick={() => this.setState({loading: true})}color="primary">More</Button>
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
                    </div>
                </div>
            </div >
        );
    }
}
NewsPage.propTypes = {
    classes: PropTypes.object
};