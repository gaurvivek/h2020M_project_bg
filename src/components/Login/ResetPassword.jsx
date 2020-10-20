import React, { Component } from "react";
import {
  Button,
  FormGroup,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { Link } from "react-router-dom";

import "assets/css/login.css";
import logo from "assets/img/logo.png";
import { FormErrors } from "./FormErrors";
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_PATTERN,
  DIGIT_ONLY,
  OPT_LENGTH,
  MAX_PASSWORD_LENGTH
} from "__helpers/constants";
import baseRoutes from "base-routes";
import enMsg from "__helpers/locale/en/en";
import { NotificationOptions } from "__helpers/constants";
import { apiPath } from "api";
import fetch from "isomorphic-fetch";

import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { basePath } from "base-routes";
// import { Button, FormGroup, FormControl, InputLabel } from "react-bootstrap";
// import "./Login.css";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirmPassword: "",
      optNumber: "",
      formErrors: {
        password: "",
        confirmPassword: "",
        optNumber: ""
      },
      apiPath: apiPath.resetPassword,
      passwordValid: false,
      confirmPasswordValid: false,
      optNumberValid: false,
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDigits = this.handleDigits.bind(this);
  }

  validateForm() {
    return (
      this.state.passwordValid &&
      this.state.confirmPasswordValid &&
      this.state.optNumberValid
    );
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    if (value.length > MAX_PASSWORD_LENGTH) {
      return true;
    }
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  handleDigits = event => {
    const name = event.target.name;
    const value = event.target.value;

    if (value.trim() == "" || value.match(DIGIT_ONLY)) {
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    }
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let optNumberValid = this.state.optNumberValid;
    switch (fieldName) {
      case "password":
        passwordValid = true;
        let errorMessage = "";

        if (value.length < MIN_PASSWORD_LENGTH) {
          passwordValid = false;
          errorMessage = enMsg.shortPassword;
        } else if (!value.match(PASSWORD_PATTERN)) {
          errorMessage = enMsg.passwordPatternValidation;
          passwordValid = false;
        }
        fieldValidationErrors.password = errorMessage;
        break;

      case "confirmPassword":
        fieldValidationErrors.confirmPassword = "";
        confirmPasswordValid = true;
        if (
          value.length &&
          this.state.password.length &&
          this.state.password !== value
        ) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword =
            enMsg.confirmPasswordValidation;
        }
        break;
      case "optNumber":
        optNumberValid = value.length == OPT_LENGTH;
        fieldValidationErrors.optNumber = optNumberValid ? "" : enMsg.OTPLength;
        break;
      default:
        passwordValid = true;
        confirmPasswordValid = true;
        optNumberValid = true;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        passwordValid: passwordValid,
        confirmPasswordValid: confirmPasswordValid,
        optNumberValid: optNumberValid
      },
      this.validateForm
    );
  }

  async handleSubmit(event) {
    this.setState({ loading: true });

    event.preventDefault();

    const data = {
      email: this.state.email,
      pssword: this.state.password
    };
    let showNotification = {};
    try {
      const response = await fetch(this.state.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(response => {
          alert(response.status == 403);
          if (
            response.status == 400 ||
            response.status == 403 ||
            response.status == 404
          ) {
            console.log("Login Failed.", response);
            showNotification = {
              title: enMsg.successResetPasswordTitle,
              message: enMsg.successResetPassword,
              type: "danger"
            };
            this.props.history.push(basePath + baseRoutes.login.path);
          } else if (response.ok) {
            showNotification = {
              title: enMsg.successResetPasswordTitle,
              message: enMsg.successResetPassword,
              type: "success"
            };
            this.props.history.push(basePath + baseRoutes.login.path);
            return response.json();
          } else {
            console.log("Login failed.", response);
            // https://github.com/developit/unfetch#caveats
            let error = new Error(response.statusText);

            // error.response = response;
            // return Promise.reject(error);
          }
        })
        .catch(error => {
          showNotification = {
            title: enMsg.failUpdateTitle,
            message: enMsg.networkFailedError,
            type: "danger"
          };
          console.error(
            "You have an error in your code or there are Network issues.",
            error
          );
          // return response;
        });

      // throw new Error(error);
    } catch (error) {
      showNotification = {
        title: enMsg.failUpdateTitle,
        message: enMsg.networkFailedError,
        type: "danger"
      };
      console.error(
        "You have an error in your code or there are Network issues.",
        error
      );
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
      //window.location.reload();
    }
    /* stop loading */
    this.setState({ loading: true });
  }

  render() {
    return (
      <div className="login-outer-cover">
        <div className="login-cover">
          <div className="login-inner-cover">
            <ReactNotification key="forgot-password-notification" />
            <div className="logo-content">
              <img src={logo} alt="logo" />
            </div>
            <div className="green-header">Reset Password</div>
            <div className="login-content">
              <div className="Login">
                <form
                  onSubmit={this.handleSubmit}
                  id="reset-paasword-form"
                  noValidate
                >
                  <FormGroup>
                    {/* <InputLabel>Password</InputLabel> */}
                    <TextField
                      label="New Password*"
                      type="password"
                      name="password"
                      value={this.state.password}
                      data-validators="isRequired,isAlpha"
                      onChange={this.handleChange}
                      inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                    />
                    <FormErrors
                      show={!this.state.passwordValid}
                      formErrors={this.state.formErrors}
                      fieldName="password"
                    />
                  </FormGroup>
                  <FormGroup>
                    {/* <InputLabel>Password</InputLabel> */}
                    <TextField
                      label="Confirm Password*"
                      type="password"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      data-validators="isRequired,isAlpha"
                      onChange={this.handleChange}
                      inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                    />
                    <FormErrors
                      show={!this.state.confirmPasswordValid}
                      formErrors={this.state.formErrors}
                      fieldName="confirmPassword"
                    />
                  </FormGroup>
                  <FormGroup>
                    {/* <InputLabel>Password</InputLabel> */}
                    <TextField
                      label="OTP*"
                      type="text"
                      name="optNumber"
                      value={this.state.optNumber}
                      data-validators="isRequired,isAlpha"
                      onChange={this.handleDigits}
                      inputProps={{ maxLength: OPT_LENGTH }}
                    />
                    <FormErrors
                      show={!this.state.optNumberValid}
                      formErrors={this.state.formErrors}
                      fieldName="optNumber"
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
                      Reset Password
                      {this.state.loading && (
                        <CircularProgress
                          size={24}
                          className="buttonProgress"
                        />
                      )}
                    </Button>

                    <Link
                      className="forgot-link"
                      href={baseRoutes.forgotPassword.path}
                      to={baseRoutes.forgotPassword.path}
                    >
                      {baseRoutes.forgotPassword.pathName}
                    </Link>

                    <div className="signup-cover">
                      <Link
                        href={baseRoutes.login.path}
                        to={baseRoutes.login.path}
                      >
                        {baseRoutes.login.pathName}
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
