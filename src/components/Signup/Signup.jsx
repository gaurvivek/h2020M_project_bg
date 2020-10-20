import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  FormGroup,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Input,
  CircularProgress
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import { Link } from "react-router-dom";
import logo from "assets/img/front-logo.png";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import "assets/css/signup.css";
import { FormErrors } from "components/Login/FormErrors";
import {
  EMAIL_REGEX,
  ZIP_CODE_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_PATTERN,
  DIGIT_ONLY,
  ZIPCODE_REGEX,
  MIN_AGE_YEARS,
  PHONE_NO_INVALID_LENGTH,
  genderType,
  APPLICATION_ROLES,
  NotificationOptions,
  INVALID_DATA_POST,
  STATUS_CREATED,
  MAX_PASSWORD_LENGTH
} from "__helpers/constants";

import PhoneNumber from "awesome-phonenumber";
import { apiPath } from "api";

import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { userService } from "_services/user.service";
import ReactNotification from "react-notifications-component";
import { basePath, baseRoutes } from "base-routes";

import enMsg from "__helpers/locale/en/en";
import DatePicker from "react-date-picker";
import { clientTokenHeader } from "__helpers/auth-header";
import { NotificationContainer } from "react-notifications";

class Signup extends React.Component {
  maxDate = new Date();
  constructor(props) {
    super(props);
    this.maxDate.setYear(this.maxDate.getFullYear() - MIN_AGE_YEARS);
    this.dateUtility = new DateFnsUtils();

    this.maxDateForMessage = this.dateUtility.format(
      this.maxDate,
      "MM/dd/yyyy"
    );
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      id: null,
      firstName: "",
      mInit: "",
      lastName: "",
      middleName: "",
      phone: "",
      dob: null,
      gender: "",
      zipcode: "",
      imageRef: "",
      role: "merchant",

      companyName: "",
      address: "",
      city: "",
      state: "",
      businessType: "",
      formErrors: {
        email: "",
        password: "",
        confirmPassword: "",
        id: "",
        firstName: "",
        mInit: "",
        lastName: "",
        middleName: "",
        phone: "",
        dob: "",
        gender: "",
        zipcode: "",
        imageRef: "",
        role: "merchant",

        companyName: "",
        address: "",
        city: "",
        state: "",
        businessType: "",
      },
      emailValid: false,
      passwordValid: false,
      confirmPasswordValid: false,
      firstNameValid: false,
      lastNameValid: false,
      /* optional fields default is valid */
      zipcodeValid: false,
      dobValid: true,
      phoneValid: true,
      roleValid: true,
      loading: false,

      companyNameValid: false,
      addressValid: false,
      cityValid: false,
      stateValid: false,
      businessTypeValid: false,
    };

    this._isMounted = false;
    this.apiPath = apiPath.signup;
    this.clientAuthToken = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleZipCodeInput = this.handleZipCodeInput.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
  }

  handlephoneNumber = e => {
    const name = e.target.name;
    let value = e.target.value;
    const phoneNumberValidation = new PhoneNumber(e.target.value).toJSON();

    let formErrors = this.state.formErrors;
    let phoneNumberValid = true;
    let error = "";

    if (value.trim().length) {
      switch (phoneNumberValidation.possibility) {
        // case "is-possible":
        //   error = "";
        //   if (
        //     phoneNumberValidation.number.significant &&
        //     phoneNumberValidation.number.significant.length ==
        //       PHONE_NO_INVALID_LENGTH
        //   ) {
        //     error = enMsg.phoneTooShort;
        //   }
        //   break;
        case "invalid-country-code":
          error = enMsg.phoneInvalidCountryCode;
          break;
        case "too-long":
          error = enMsg.phoneTooLong;
          break;
        case "too-short":
          error = enMsg.phoneTooShort;
          break;
        case "unknown":
          error = enMsg.phoneUnknown;
          break;
        default:
          phoneNumberValidation.valid = true;
      }
      phoneNumberValid = phoneNumberValidation.valid;
    }
    formErrors.phone = error;
    // if(phoneNumberValidation.number.international !== undefined){
    //   value  = phoneNumberValidation.number.international;
    // }
    this.setState({
      [name]: value,
      formErrors: formErrors,
      phoneValid: phoneNumberValid
    });
  };

  handlePasswordInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (value.length > MAX_PASSWORD_LENGTH) {
      return true;
    }

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  resetForm = () => {
    const node = ReactDOM.findDOMNode(this);
    node.querySelector("#signUpForm").reset();
    this.setState({
      email: "",
      password: "",
      confirmPassword: "",
      id: "",
      firstName: "",
      mInit: "",
      lastName: "",
      middleName: "",
      phone: "",
      dob: null,
      gender: "",
      zipcode: "",
      imageRef: "",
      emailValid: false,
      passwordValid: false,
      confirmPasswordValid: false,
      firstNameValid: false,
      lastNameValid: false,
      /* optional fields default is valid */
      zipcodeValid: false,
      dobValid: true,
      phoneValid: true,
      roleValid: true,

      companyName: "",
      address: "",
      city: "",
      state: "",
      businessType: "",        
      companyNameValid: false,
      addressValid: false,
      cityValid: false,
      stateValid: false,
      businessTypeValid: false 
    });
    const labelNodes = node.querySelectorAll(
      ".MuiInputLabel-shrink.MuiFormLabel-filled:not(.disabled-field-label)"
    );

    if (typeof labelNodes == "object") {
      labelNodes.forEach(function(currentValue, currentIndex, listObj) {
        return currentValue.classList.remove(
          "MuiInputLabel-shrink",
          "MuiFormLabel-filled"
        );
      });
    }

    // const errorNodes = node.querySelectorAll("p.error-class");
    // if (typeof errorNodes == "object") {
    //   errorNodes.forEach(function(currentValue, currentIndex, listObj) {
    //     currentValue.innerHtml = "&nbsp;";
    //   });
    // }
  };

  componentDidMount = async () => {
    this.clientAuthToken = await userService.generateClientAouth();
    this._isMounted = true;
    const spinner = document.getElementById('loadingSpinner');
    if (spinner && !spinner.hasAttribute('hidden')) {
      spinner.setAttribute('hidden', 'true');
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleZipCodeInput = e => {
    const value = e.target.value;
    if (value.length > ZIP_CODE_LENGTH) {
      return true;
    }
    if (value.trim() == "" || value.match(DIGIT_ONLY)) {
      this.setState({ zipcode: value }, () => {
        this.validateField("zipcode", value);
      });
    }
  };
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let zipcodeValid = this.state.zipcodeValid;
// Create adnetwork data
    let companyNameValid = this.state.companyNameValid;
    let addressValid = this.state.addressValid;
    let cityValid = this.state.cityValid;
    let stateValid = this.state.stateValid;
    let businessTypeValid = this.state.businessTypeValid;

    switch (fieldName) {
      case "email":
        emailValid = value.trim().match(EMAIL_REGEX);
        fieldValidationErrors.email = emailValid ? "" : enMsg.inValidEmail;
        break;

      case "password":
        let errorMessage = "";
        passwordValid = true;
        if (value.trim().length < MIN_PASSWORD_LENGTH) {
          errorMessage = enMsg.shortPassword;
          passwordValid = false;
        } else if (!value.trim().match(PASSWORD_PATTERN)) {
          errorMessage = enMsg.passwordPatternValidation;
          passwordValid = false;
        } else if (this.state.confirmPassword === value) {
          confirmPasswordValid = true;
        }
        fieldValidationErrors.password = errorMessage;
        break;

      case "confirmPassword":
        errorMessage = "";
        confirmPasswordValid = true;
        if (value.trim().length && this.state.password !== value) {
          confirmPasswordValid = false;
          errorMessage = enMsg.confirmPasswordValidation;
        }
        fieldValidationErrors.confirmPassword = errorMessage;
        break;

      case "firstName":
        firstNameValid = value.trim().length ? true : false;
        fieldValidationErrors.firstName = firstNameValid
          ? ""
          : enMsg.firstNameRequired;
        break;

      case "lastName":
        lastNameValid = value.trim().length ? true : false;
        fieldValidationErrors.lastName = lastNameValid
          ? ""
          : enMsg.lastNameRequired;
        break;
      case "zipcode_lock":
        zipcodeValid = false;
        let error = "";
        if (
          value.trim().length &&
          value.match(DIGIT_ONLY) &&
          value.trim().length != ZIP_CODE_LENGTH
        ) {
          error = enMsg.zipCodeMinLengthError;
        } else if (value.trim().length && !value.match(ZIPCODE_REGEX)) {
          error = enMsg.invalidZipCode;
        } else {
          zipcodeValid = true;
        }
        fieldValidationErrors.zipcode = error;
        break;
        
        case "zipcode":
          zipcodeValid = true;
          zipcodeValid = value.match(ZIPCODE_REGEX);
          if (value.match(DIGIT_ONLY) && value.trim().length != ZIP_CODE_LENGTH) {
            fieldValidationErrors.zipcode = enMsg.zipCodeMinLengthError;
          } else if (!value.match(ZIPCODE_REGEX)) {
            fieldValidationErrors.zipcode = enMsg.invalidZipCode;
          }
          break;

      case "companyName":
        companyNameValid = value.trim().length ? true : false;
        fieldValidationErrors.companyName = enMsg.companyNameRequired;
        break;
      case "address":
        addressValid = value.trim().length ? true : false;
        fieldValidationErrors.address = enMsg.addressRequired;
        break;
      case "city":
        cityValid = value.trim().length ? true : false;
        fieldValidationErrors.city = enMsg.cityRequired;
        break;
      case "state":
        stateValid = value.trim().length ? true : false;
        fieldValidationErrors.state = enMsg.stateRequired;
        break;
      case "businessType":
        businessTypeValid = value.trim().length ? true : false;
        fieldValidationErrors.businessType = enMsg.businessNameeRequired;
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
        confirmPasswordValid: confirmPasswordValid,
        firstNameValid: firstNameValid,
        lastNameValid: lastNameValid,
        zipcodeValid: zipcodeValid,
        companyNameValid: companyNameValid,
        addressValid: addressValid,
        cityValid: cityValid,
        stateValid: stateValid,
        businessTypeValid: businessTypeValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    return (
      this.state.emailValid &&
      this.state.passwordValid &&
      this.state.confirmPasswordValid &&
      this.state.firstNameValid &&
      this.state.lastNameValid &&
      this.state.zipcodeValid &&
      this.state.phoneValid &&
      this.state.dobValid &&
      this.state.companyNameValid &&
      this.state.addressValid &&
      this.state.cityValid &&
      this.state.stateValid &&
      this.state.businessTypeValid
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleDateChange = event => {
    const name = "dob";
    let value = event;
    let dobValid = true;

    if (event != null && !this.dateUtility.isValid(event)) {
      dobValid = false;
    }
    this.setState({
      [name]: value,
      dobValid: dobValid
    });
  };

  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault();

    const adnetworkData = {
      companyName: this.state.companyName,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
      busbusinessType: this.state.businessType,
    };
    let adnetworkArr = [adnetworkData];
    let dob = this.state.dob;
    if (dob && this.dateUtility.isValid(dob)) {
      dob = this.dateUtility.format(new Date(dob), "yyyy-MM-dd");
    }
    const data = {
      roles: APPLICATION_ROLES,
      adNetworks: [],
      user: {
        // id: this.state.id,
        // confirmPassword: this.state.confirmPassword,
        email: this.state.email,
        password: this.state.password,
        fName: this.state.firstName,
        mInit: this.state.middleName,
        lName: this.state.lastName,
        mName: this.state.middleName,
        phone: this.state.phone,
        dob: dob,
        gender: this.state.gender,
        zipCode: this.state.zipcode,
        imageRef: this.state.imageRef
        // roleValid: this.state.role
      },
      adNetworks: [adnetworkData],
    };
    let showNotification = {};
    try {
      const response = await fetch(this.apiPath, {
        method: "POST",
        headers: clientTokenHeader(),
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.status == INVALID_DATA_POST) {
            showNotification = {
              title: enMsg.signUpFailedTitle,
              message: response.errorMessage,
              type: "danger"
            };

          } else if (response.status === STATUS_CREATED) {
            showNotification = {
              title: enMsg.successSignUpTitle,
              message: enMsg.successSignUp,
              type: "success"
            };
            this.props.history.push(basePath + baseRoutes.login.path);
          } else {
            showNotification = {
              title: enMsg.signUpFailedTitle,
              message: response,
              type: "danger"
            };
          }
          return response.json();
        })
        .then(response => {
          showNotification = {
            title: enMsg.signUpFailedTitle,
            message: response.errorMessage,
            type: "danger"
          };
          if (response && response.user !== undefined) {
            //   do not store token as of now
            // let user = {
            //   authdata: window.btoa(data.email + ":" + data.password),
            //   accessToken: response.accessToken
            // };

            // localStorage.setItem("user", JSON.stringify(user));
            // const { from } = this.props.location.state || {
            //   from: { pathname: "/" }
            // };
            showNotification = {
              title: enMsg.successSignUpTitle,
              message: enMsg.successSignUp,
              type: "success"
            };
            this.props.history.push(basePath + baseRoutes.login.path);
          }
        })
        .catch(error => {
          showNotification = {
            title: enMsg.signUpFailedTitle,
            message: enMsg.networkFailedError,
            type: "danger"
          };

          return response;
        });

      // throw new Error(error);
    } catch (error) {
      showNotification = {
        title: enMsg.signUpFailedTitle,
        message: enMsg.networkFailedError,
        type: "danger"
      };
    }

    if (
      showNotification !== undefined &&
      showNotification.title !== undefined &&
      showNotification.message !== undefined &&
      typeof showNotification.message === "string" &&
      showNotification.type !== undefined
    ) {
      this.notificationID = store.removeNotification(this.notificationID);
      if (this.notificationID == undefined) {
        let notifiaciton = {
          title: showNotification.title,
          message: showNotification.message,
          type: showNotification.type
        };
        // debugger;
        notifiaciton = Object.assign(NotificationOptions, notifiaciton);
        this.notificationID = store.addNotification(notifiaciton);
      }
      userService.showNotification(showNotification)
    }
    this._isMounted && this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;
    const stylebtn = { color: "#fff !important" };
    return (
      <div className="login-outer-cover">
        {/* <NotificationContainer/> */}
        {/* <ReactNotification /> */}
        <div className="login-cover gray-bg-color">
          <div className="login-inner-cover">
            <div className="logo-content loginLogoMain">
              <div className="loginLogoInner">
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className="green-header">Signup</div>
            <div className="login-content">
              <div className="Login">
                <form id="signUpForm" noValidate onSubmit={this.handleSubmit}>
                  <GridContainer>
                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="First Name"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="firstName"
                          autoComplete="off"
                          value={this.state.firstName}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.firstNameValid}
                          formErrors={this.state.formErrors}
                          fieldName="firstName"
                        />
                      </FormGroup>
                    </GridItem>
                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Middle Name"
                          type="text"
                          name="middleName"
                          value={this.state.middleName}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.middleNameValid}
                          formErrors={this.state.formErrors}
                          fieldName="middleName"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Last Name"
                          InputLabelProps={{ className: "required-label" }}
                          name="lastName"
                          autoComplete="off"
                          value={this.state.lastName}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.lastNameValid}
                          formErrors={this.state.formErrors}
                          fieldName="lastName"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Email"
                          InputLabelProps={{ className: "required-label" }}
                          name="email"
                          value={this.state.email}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.emailValid}
                          formErrors={this.state.formErrors}
                          fieldName="email"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Password"
                          InputLabelProps={{ className: "required-label" }}
                          type="password"
                          name="password"
                          value={this.state.password}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handlePasswordInput}
                          inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                        />
                        <FormErrors
                          show={!this.state.passwordValid}
                          formErrors={this.state.formErrors}
                          fieldName="password"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Confirm Password"
                          InputLabelProps={{ className: "required-label" }}
                          type="password"
                          name="confirmPassword"
                          value={this.state.confirmPassword}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handlePasswordInput}
                          inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                        />
                        <FormErrors
                          show={!this.state.confirmPasswordValid}
                          formErrors={this.state.formErrors}
                          fieldName="confirmPassword"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <TextField
                          label="Phone"
                          name="phone"
                          autoComplete="off"
                          value={this.state.phone}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handlephoneNumber}
                        />
                        <FormErrors
                          show={!this.state.phoneValid}
                          formErrors={this.state.formErrors}
                          fieldName="phone"
                        />
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            // variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-dialog"
                            label="DOB"
                            name="dob"
                            value={this.state.dob}
                            maxDate={this.maxDate}
                            maxDateMessage={`Date should not be after ${this.maxDateForMessage}`}
                            onChange={this.handleDateChange}
                            className="KeyboardDatePicker"
                            invalidDateMessage={enMsg.invalidDate}
                            // closeAfterSelect={true}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                              className: "date-picker-span"
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup className="select-gender">
                        <FormControl>
                          <InputLabel htmlFor="gender">Gender</InputLabel>
                          <Select
                            id="gender"
                            color="secondary"
                            name="gender"
                            autoComplete="off"
                            value={this.state.gender}
                            width="100px"
                            onChange={event => this.handleUserInput(event)}
                            input={<Input id="gender" />}
                          >
                            <MenuItem value="">Select Gender</MenuItem>
                            {genderType
                              ? Object.keys(genderType).map((item, key) => {
                                  return (
                                    <MenuItem value={item} key={key}>
                                      {genderType[item]}
                                    </MenuItem>
                                  );
                                })
                              : null}
                          </Select>
                          <FormErrors
                            show={!this.state.genderValid}
                            formErrors={this.state.formErrors}
                            fieldName="gender"
                          />
                        </FormControl>
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6}>
                      <FormGroup className={"profile-role"}>
                        <FormControl>
                          <InputLabel
                            className="disabled-field-label required-label"
                            htmlFor="role"
                          >
                            Role
                          </InputLabel>
                          <Select
                            id="role"
                            color="secondary"
                            name="role"
                            value={this.state.role}
                            // width="100px"
                            style={{
                              color: "#000"
                            }}
                            required={true}
                            disabled={true}
                            onChange={this.handleUserInput}
                            input={<Input id="roleInput" />}
                            inputProps={{
                              disabled: true
                            }}
                          >
                            <MenuItem value="">Role</MenuItem>
                            <MenuItem value="merchant" selected>
                              Merchant
                            </MenuItem>
                          </Select>
                          <FormErrors
                            show={!this.state.roleValid}
                            formErrors={this.state.formErrors}
                            fieldName="role"
                          />
                        </FormControl>
                      </FormGroup>
                    </GridItem>

                    <GridItem md={6} xs={6} style={{display:"none"}}>
                      <FormGroup className={"image-ref-group"}>
                        <TextField
                          label="Image Ref"
                          name="name"
                          value={this.state.imageRef}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.imageRefValid}
                          formErrors={this.state.formErrors}
                          fieldName="imageRef"
                        />
                      </FormGroup>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem md={12} xs={12}>
                      <div className="green-header" style={{top:"0", margin:"30px auto"}}>AdNetwork</div>
                    </GridItem>
                    <GridItem md={6} xs={6}>
                      <FormGroup className={"signup-zip"}>
                        <TextField
                          label="Zip Code"
                          name="zipcode"
                          InputLabelProps={{ className: "required-label" }}
                          value={this.state.zipcode}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleZipCodeInput}
                          inputProps={{ maxLength: ZIP_CODE_LENGTH }}
                        />
                        <FormErrors
                          show={!this.state.zipcodeValid}
                          formErrors={this.state.formErrors}
                          fieldName="zipcode"
                        />
                      </FormGroup>
                    </GridItem>
                    <GridItem md={6} xs={6}>
                      <FormGroup className={"cusForm"}>
                        <TextField
                          label="Company Name"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="companyName"
                          autoComplete="off"
                          value={this.state.companyName}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.companyNameValid}
                          formErrors={this.state.formErrors}
                          fieldName="companyName"
                        />
                      </FormGroup>
                    </GridItem>
                    <GridItem md={6} xs={6}>
                    <FormGroup className={"cusForm"}>
                        <TextField
                          label="City"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="city"
                          autoComplete="off"
                          value={this.state.city}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.cityValid}
                          formErrors={this.state.formErrors}
                          fieldName="city"
                        />
                      </FormGroup>  
                    </GridItem>
                    <GridItem md={6} xs={6}>
                      <FormGroup className={"cusForm"}>
                        <TextField
                          label="Address"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="address"
                          autoComplete="off"
                          value={this.state.address}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.addressValid}
                          formErrors={this.state.formErrors}
                          fieldName="address"
                        />
                      </FormGroup>  
                    </GridItem>
                    <GridItem md={6} xs={6}>
                      <FormGroup className={"cusForm"}>
                        <TextField
                          label="State"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="state"
                          autoComplete="off"
                          value={this.state.state}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.stateValid}
                          formErrors={this.state.formErrors}
                          fieldName="state"
                        />
                      </FormGroup>  
                    </GridItem>
                    <GridItem md={6} xs={6}>
                     <FormGroup className={"cusForm"}>
                        <TextField
                          label="BusinessType"
                          InputLabelProps={{ className: "required-label" }}
                          type="text"
                          name="businessType"
                          autoComplete="off"
                          value={this.state.business}
                          data-validators="isRequired,isAlpha"
                          onChange={this.handleUserInput}
                        />
                        <FormErrors
                          show={!this.state.businessTypeValid}
                          formErrors={this.state.formErrors}
                          fieldName="businessType"
                        />
                      </FormGroup>  
                    </GridItem>

                    
                  </GridContainer>

                  <div className="login-forgot">
                    <Button
                      color="primary"
                      className={this.state.loading ? "buttonSuccess" : ""}
                      disabled={this.state.loading || !this.validateForm()}
                      type="submit"
                    >
                      Signup
                      {this.state.loading && (
                        <CircularProgress
                          size={24}
                          className="buttonProgress"
                        />
                      )}
                    </Button>
                    <Button
                      color="primary"
                      onClick={this.resetForm}
                      type="button"
                    >
                      Reset
                    </Button>
                    <Link to={baseRoutes.login.path}>
                      <Button
                        color="secondary"
                        className="back-btn"
                        style={stylebtn}
                        type="button"
                      >
                        Back
                      </Button>
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

export default Signup;
