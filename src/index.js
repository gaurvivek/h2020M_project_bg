/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {
  /* BrowserRouter as */ Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

// core components
import Admin from "layouts/Admin.jsx";
import Login from "components/Login/Login.jsx";
import Signup from "components/Signup/Signup.jsx";

import "assets/css/material-dashboard-react.css?v=1.7.0";
// import Dashboard from "views/Dashboard/Dashboard";
// import Profile from "views/Profile/Profile";
import ForgotPassword from "components/Login/ForgotPassword";
import ResetPassword from "components/Login/ResetPassword";
import baseRoutes from "base-routes";
import Page404 from "components/Login/Page404";
import { PrivateRoute } from "components/PrivateRoute";

import DashboardPage from "views/Dashboard/Dashboard";

import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { NotificationContainer } from "react-notifications";
import index from "./js/index";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store/index";

const Notification = () => {
  return (
    <Provider store={store}>
      <div> 
        <NotificationContainer/>
        {/* <p>API_URL: {window._env_.API_URL}</p> */}
        <Router history={hist}>
          <Switch>
            <PrivateRoute path={baseRoutes.dashboard.path} component={Admin} />
            <Route path={baseRoutes.dashboard.path} component={DashboardPage} />
            {/* <Route path={baseRoutes.login.path} component={Login} /> */}
            {/* <Route path={baseRoutes.signup.path} component={Signup} /> */}
            {/* <Route
              path={baseRoutes.forgotPassword.path}
              component={ForgotPassword}
            /> */}
            {/* <Route
              path={baseRoutes.resetPassword.path}
              component={ResetPassword}
            /> */}
            {/* <Route path={baseRoutes.profile.path} component={Profile} />       */}
            <PrivateRoute path={baseRoutes.admin.path} component={Admin} />
            <Redirect from="/" to={baseRoutes.dashboard.path} unusedData={"unusedData"} />
            <Route component={Page404} />
            {/* <Route path="/rtl" component={RTL} /> */}
          </Switch>
        </Router>
        <React.Fragment key={new Date().getTime()}>
          {/* <ReactNotification /> */}
        </React.Fragment>
      </div>
    </Provider>
  );
};
const hist = createBrowserHistory();
if (navigator.storage && navigator.storage.persist)
  navigator.storage.persisted().then(persistent=>{
    if (persistent)
      console.log("Storage will not be cleared except by explicit user action");
    else
      console.log("Storage may be cleared by the UA under storage pressure.");
  });
  // if (localStorage && !localStorage.getItem('size')) {
  //   var i = 0;
  //   try {
  //       // Test up to 10 MB
  //       for (i = 250; i <= 10000; i += 250) {
  //           localStorage.setItem('test', new Array((i * 1024) + 1).join('a'));
  //       }
  //   } catch (e) {
  //       localStorage.removeItem('test');
  //       localStorage.setItem('size', i - 250);
  //       alert(i - 250);            
  //   }
  // }

ReactDOM.render(<Notification />, document.getElementById("root"));
