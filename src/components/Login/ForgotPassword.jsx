import React, { Component } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

import "assets/css/login.css";
import logo from "assets/img/logo.png";
import baseRoutes from "base-routes";
import { FormErrors } from "./FormErrors";
import { apiPath } from "api";

import fetch from "isomorphic-fetch";

import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import {
  NotificationOptions,
  EMAIL_REGEX,
  INVALID_DATA_POST,
  OK_SUCCESS_STATUS
} from "__helpers/constants";
import enMsg from "__helpers/locale/en/en";
import CircularProgress from "@material-ui/core/CircularProgress";
// import { Button, FormGroup, FormControl, InputLabel } from "react-bootstrap";
// import "./Login.css";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailValid: false,
      formErrors: { username: "", password: "" },
      showNotification: {},
      apiPath: apiPath.forgotPassword,
      loading: false
    };
    this.notificationID = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0;
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(EMAIL_REGEX);
        fieldValidationErrors.email = emailValid ? "" : enMsg.inValidEmail;
        break;
      default:
        emailValid = false;
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid
      },
      this.validateForm
    );
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    const data = {
      email: this.state.email
    };
    let showNotification = {};
    try {
      const response = await fetch(`${this.state.apiPath + this.state.email}`, {
        method: "GET", // make it POST later when there is live api
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(data), // remove comment later when there is live api
        data: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === INVALID_DATA_POST) {
            showNotification = {
              title: enMsg.requestFailed,
              message: enMsg.emailNotExist,
              type: "danger"
            };

            console.log("Login Failed.", response);
          } else if (response.ok && response.status === OK_SUCCESS_STATUS) {
            showNotification = {
              title: enMsg.optSent,
              message: `OTP is sent to ${this.state.email}`,
              type: "success"
            };
            return response.json();
          } else {
            showNotification = {
              title: enMsg.requestFailed,
              message: enMsg.emailNotExist,
              type: "danger"
            };
            console.log("Login failed.", response);
          }
        })
        .then(data => {
          if (!data.length) {
            showNotification = {
              title: enMsg.requestFailed,
              message: enMsg.emailNotExist,
              type: "danger"
            };
          }
          // if (data.length){
          //   showNotification = {
          //     title: enMsg.successTitle,
          //     message: enMsg.resetLinkOTPsend,
          //     type: "success"
          //   };
          // }
          // this.props.history.push(basePath + baseRoutes.resetPassword.path);
          return response;
        })
        .catch(error => {
          console.log(error);
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
    console.log(showNotification);
    if (
      showNotification !== undefined &&
      showNotification.title !== undefined &&
      showNotification.message !== undefined &&
      showNotification.type !== undefined
    ) {
      this.notificationID = store.removeNotification(this.notificationID);
      if (this.notificationID === undefined) {
        let notifiaciton = {
          title: showNotification.title,
          message: showNotification.message,
          type: showNotification.type
        };
        notifiaciton = Object.assign(NotificationOptions, notifiaciton);
        this.notificationID = store.addNotification(notifiaciton);
      }
    }

    this.setState({ loading: false });
  }

  render() {

    return (
      <div className="login-outer-cover">
        <div className="login-cover">
          <div className="login-inner-cover">
            <ReactNotification />
            <div className="logo-content">
              <img src={logo} alt="logo" />
            </div>
            <div className="green-header">Forgot Password</div>
            <div className="login-content">
              <div className="Login">
                <form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    {/* <InputLabel>Email Address</InputLabel> */}
                    <TextField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={this.state.email}
                      data-validators="isRequired,isAlpha"
                      onChange={event => this.handleUserInput(event)}
                    />
                    <FormErrors
                      show={!this.state.emailValid}
                      formErrors={this.state.formErrors}
                      fieldName="email"
                    />
                  </FormGroup>

                  {/* <FormGroup controlId="password" bsSize="large">                
                <TextField label="Password" type="password"  name="name" value="" data-validators="isRequired,isAlpha" onChange={this.handleChange}/> 
              </FormGroup> */}
                  <div className="action-btns">
                    <Button
                      // variant="contained"
                      color="primary"
                      className={this.state.loading ? "buttonSuccess" : ""}
                      disabled={this.state.loading || !this.validateForm()}
                      type="submit"
                    >
                      SUBMIT
                      {this.state.loading && (
                        <CircularProgress
                          size={24}
                          className="buttonProgress"
                        />
                      )}
                    </Button>
                    <Button
                      className="back-btn"
                      color="secondary"
                      type="button"
                    >
                      <Link
                        color="textSecondary"
                        underline="none"
                        className="cancel-back-btn"
                        to={baseRoutes.login.path}
                      >
                        Back
                      </Link>
                    </Button>
                    {/* <Link
                      className="forgot-link"
                      href={baseRoutes.login.path}
                      to={baseRoutes.login.path}
                    >
                      {baseRoutes.login.pathName}
                    </Link> */}
                  </div>

                  <div className="signup-cover">
                    <Link
                      href={baseRoutes.signup.path}
                      to={baseRoutes.signup.path}
                    >
                      {baseRoutes.signup.pathName}
                    </Link>
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
