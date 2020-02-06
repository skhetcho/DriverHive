/*!

=========================================================
* Material Kit React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.7.0";

// pages for this product
import LandingPage from "views/LandingPage/LandingPage.jsx";
import EventsPage from "views/EventsPage/EventsPage.jsx";
import DriverPage from "views/DriverPage/DriverPage.jsx";
import Login from "views/Auth/Login.jsx";
import SignUp from "views/Auth/SignUp.jsx";
import ContactPage from "views/ContactPage/ContactPage.jsx";
import CommunityPage from "views/CommunityPage/CommunityPage.jsx";
import NewsPage from "views/NewsPage/NewsPage.jsx";
import ChatPage from "views/ChatPage/ChatPage.jsx";
import SignOut from "views/Auth/SignOut.jsx";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/events" component={EventsPage}/>
      <Route path="/driver-reg" component={DriverPage}/>
      <Route path="/login" component={Login}/>
      <Route path="/sign-up" component={SignUp}/>
      <Route path="/sign-out" component={SignOut}/>
      <Route path="/contact-page" component={ContactPage}/>
      <Route path="/community" component={CommunityPage}/>
      <Route path="/news" component={NewsPage}/>
      <Route path="/chat" component={ChatPage}/>
      <Route path="/" component={LandingPage}/>
    </Switch>
  </Router>,
  document.getElementById("root")
);
