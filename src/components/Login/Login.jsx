import React, { Component, useReducer } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

import "assets/css/login.css";
import logo from "assets/img/front-logo.png";

import { basePath, baseRoutes } from "base-routes";
import { FormErrors } from "./FormErrors";
import fetch from "isomorphic-fetch";

import { apiPath } from "api";

import { store } from "react-notifications-component";
import { userService } from "_services/user.service";
import enMsg from "__helpers/locale/en/en";
import { NotificationOptions, EMAIL_REGEX } from "__helpers/constants";
import { clientTokenHeader } from "__helpers/auth-header";
import { NotificationContainer } from "react-notifications";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import ReactNotifications from 'react-browser-notifications';
import { CLIENT_TOKEN_LIFETIME } from "__helpers/constants";
class AdblockDetect extends Component {
  state = {
    usingAdblock: false,
  }

  componentDidMount() {
    this.setState({ usingAdblock: this.fakeAdBanner.offsetHeight === 0 });
  }

  render() {
    if (this.state.usingAdblock === true) {
      return this.props.children;
    }

    return (
      <div
        ref={r => (this.fakeAdBanner = r)}
        style={{ height: '1px', width: '1px', visiblity: 'none', pointerEvents: 'none' }}
        className="adBanner"
      />
    );
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props);

    let userInfo = JSON.parse(localStorage.getItem("user"));
    let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
    let currentTimeStamp = new Date().getTime();
    let timeFlag = false;
    if(!userInfo ||!tokenTimeStamp){
      userService.logout();
    }else{
      timeFlag = (currentTimeStamp - tokenTimeStamp) < CLIENT_TOKEN_LIFETIME;
    }
    userService.logout();
    this._isMounted = false; 
    this.state = {
      email: "",
      username: "",
      password: "",
      grantType: "",
      scope: "",
      formErrors: { username: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      apiPath: apiPath.login,
      loading: false,
      showNotification: {},
      open: true,
      other: undefined,
      accessToken: (userInfo && userInfo.accessToken) ? userInfo.accessToken : [],
      tokenTimeStamp: (tokenTimeStamp) ? tokenTimeStamp : currentTimeStamp,
      timeFlag: timeFlag,
    };
    this.clientAuthToken = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
  }

  handleChange = event => {
    // this.setState({
    //   [event.target.id]: event.target.value
    // });
  };

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(EMAIL_REGEX);
        fieldValidationErrors.email = emailValid ? "" : enMsg.inValidEmail;
        break;
      case "password":
        let error = "";
        passwordValid = true;
        if (!value.trim().length) {
          passwordValid = false;
          error = enMsg.passwordRequired;
        } else if (value.length < 6) {
          passwordValid = false;
          error = enMsg.shortPassword;
        }
        fieldValidationErrors.password = error;
        break;
      default:
        emailValid = true;
        passwordValid = true;
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    return this.state.emailValid && this.state.passwordValid;
  }
  showNotifications() {
    // If the Notifications API is supported by the browser
    // then show the notification
    // if(this.n.supported()) this.n.show();
  }

  componentDidMount = () => {
    this._isMounted = true; 
    userService.generateClientAouth();
    const spinner = document.getElementById('loadingSpinner');
    if (spinner && !spinner.hasAttribute('hidden')) {
      spinner.setAttribute('hidden', 'true');
    }
    this.showNotifications();
    let currentTimeStamp = new Date().getTime();
    let timeFlag = (currentTimeStamp - this.state.tokenTimeStamp) < CLIENT_TOKEN_LIFETIME;
    if(this.state.accessToken && this.state.timeFlag){
      
    }

  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillMount = () => {
    const req = null;
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  };

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    //    logErrorToMyService(error, info);
  }
  handleCloseDialog = e => {
    // this.setState({
    //   open: false,
    // })
    window.location.reload();
  };

  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    const data = {
      username: this.state.email,
      password: this.state.password,
      grantType: "password",
      scope: "user"
    };

    let showNotification = {};

    try {
      const response = await fetch(this.state.apiPath, {
        method: "POST",
        // mode: "no-cors", // cors, *cors, same-origin"
        headers: clientTokenHeader(),
        body: JSON.stringify(data),
        data: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === 400) {
            showNotification = {
              title: enMsg.loginFailedTitle,
              message: enMsg.inValidCredentials,
              type: "danger"
            };
          } else if (response.ok) {
            let accessToken = response.headers.get("Authorization");

            if (accessToken !== undefined) {
              let userData = window.btoa(data.username + ":" + data.password);
              // userData = window.btoa(userData);
              let user = {
                authdata: window.btoa(userData),
                accessToken: accessToken
              };
              
              localStorage.setItem("user", JSON.stringify(user));
              window.location.replace(baseRoutes.dashboard.path);
              // this.props.history.push(baseRoutes.dashboard.path);
              return;
            }
          } else {
            showNotification = {
              title: enMsg.loginFailedTitle,
              message: enMsg.inValidCredentials,
              type: "danger"
            };
            let error = new Error(response.statusText);
          }
          // return response.json();
          return response.text();
        })
        .then(response => {
          return true;
        })
        .catch(error => {
          showNotification = {
            title: enMsg.loginFailedTitle,
            message: enMsg.networkFailedError,
            type: "danger"
          };

          return response;
        });

      // throw new Error(error);
    } catch (error) {
      showNotification = {
        title: enMsg.loginFailedTitle,
        message: enMsg.networkFailedError,
        type: "danger"
      };
    }

    if (
      showNotification !== undefined &&
      showNotification.title !== undefined &&
      showNotification.message !== undefined &&
      showNotification.type !== undefined
    ) {
      this.notificationID = store.removeNotification(this.notificationID);
      if (this.notificationID == undefined) {
        let notifiaciton = {
          title: showNotification.title,
          message: showNotification.message,
          type: showNotification.type
        };
        notifiaciton = Object.assign(NotificationOptions, notifiaciton);
        this.notificationID = store.addNotification(notifiaciton);
      }
      userService.showNotification(showNotification)
    }

    this._isMounted && this.setState({ loading: false });
    /* set notification config */
    // this.setState({ showNotification: showNotification });
    // this.forceUpdate();
  }
  render() {
    return (
      <div className="login-outer-cover">
        <ReactNotifications
          onRef={ref => (this.n = ref)} // Required
          title="ASG" // Required
          body="Welcome as ASG application"
          icon="icon.png"
          tag="welcome"
          timeout="1000"
          onClick={event => this.handleClick(event)}
        />
        {/* <NotificationContainer/> */}
        <div className="login-cover gray-bg-color">
          <AdblockDetect>
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              aria-labelledby="confirmation-dialog-title"
              open={this.state.open}
              {...this.state.other}
              className={"change-pass-dialog profile-content addBlockPopup"}
            >
              <DialogTitle id="confirmation-dialog-title">
                <div className="green-header warning-header" style={{top:"0"}}><i class="material-icons">block</i> AdBlocker Detected</div>
              </DialogTitle>
              <DialogContent className="addBlockContent">
                <p className="addBlockDesc">Please disable adblocker and reload page to access. We dont display ads on our network.</p>               
                <div className="addBlockbtn">
                  <Button
                    className="refreshBtn"
                    color="primary"
                    type="button"
                    onClick={this.handleCloseDialog}><i className="material-icons">refresh</i> Refresh
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </AdblockDetect>
          <div className="login-inner-cover">            
            <div className="logo-content loginLogoMain">
              <div className="loginLogoInner">
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className="green-header">Login</div>
            <div className="login-content">
              <div className="Login">
                <form onSubmit={this.handleSubmit} noValidate>
                  <FormGroup>
                    {/* <InputLabel>Email Address</InputLabel> */}
                    <TextField
                      label="Email Address"
                      type="email"
                      name="email"
                      data-validators="isRequired,isAlpha"
                      onChange={event => this.handleUserInput(event)}
                      value={this.state.email}
                    />
                    <FormErrors
                      show={!this.state.emailValid}
                      formErrors={this.state.formErrors}
                      fieldName="email"
                    />
                  </FormGroup>

                  <FormGroup>
                    <TextField
                      label="Password"
                      type="password"
                      name="password"
                      data-validators="isRequired,isAlpha"
                      onChange={event => this.handleUserInput(event)}
                      value={this.state.password}
                    />
                    <FormErrors
                      show={!this.state.passwordValid}
                      formErrors={this.state.formErrors}
                      fieldName="password"
                    />
                  </FormGroup>
                  <div className="action-btns">
                    <Button
                      // variant="contained"
                      color="primary"
                      className={this.state.loading ? "buttonSuccess" : ""}
                      disabled={this.state.loading || !this.validateForm()}
                      type="submit"
                    >
                      Login
                      {this.state.loading && (
                        <CircularProgress
                          size={24}
                          className="buttonProgress"
                        />
                      )}
                    </Button>
                    <div className="signup-cover loginPageLink">
                      <Link
                        href={baseRoutes.signup.path}
                        to={baseRoutes.signup.path}
                      >
                        {baseRoutes.signup.pathName}
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
