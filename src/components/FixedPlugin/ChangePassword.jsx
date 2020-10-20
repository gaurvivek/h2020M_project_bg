import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { FormGroup, TextField, CircularProgress } from "@material-ui/core";
import { FormErrors } from "components/Login/FormErrors";
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_PATTERN,
  NotificationOptions,
  FORBIDDEN_STATUS,
  INVALID_DATA_POST,
  NO_DATA_FOUND,
  SECURITY_ERROR,
  MAX_PASSWORD_LENGTH,
  NO_CONTENT_STATUS
} from "__helpers/constants";
import enMsg from "__helpers/locale/en/en";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { apiPath } from "api";
import { authHeader } from "__helpers/auth-header";
// const styles = theme => ({
//   root: {
//     width: "100%",
//     maxWidth: 760,
//     backgroundColor: theme.palette.background.paper
//   },
//   paper: {
//     width: "80%",
//     maxHeight: 435
//   }
// });

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    this.state = {
      open: false,
      other: undefined,
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
      loading: false,
      formErrors: {
        newPassword: "",
        oldPassword: "",
        confirmPassword: ""
      },
      oldPasswordValid: false,
      newPasswordValid: false,
      confirmPasswordValid: false,
      formValid: false
    };
    this.apiPath = apiPath.profileChangePassword;

    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // const { onClose, value: valueProp, open, ...other } = props;
    // const [value, setValue] = React.useState(valueProp);
    // const radioGroupRef = React.useRef(null);
  }

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let newPasswordValid = this.state.newPasswordValid;
    let oldPasswordValid = this.state.oldPasswordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let errorMessage = "";

    switch (fieldName) {
      case "oldPassword":
        oldPasswordValid = true;
        if (value.trim().length < MIN_PASSWORD_LENGTH) {
          errorMessage = enMsg.shortPassword;
          oldPasswordValid = false;
        }
        // else if (!value.trim().match(PASSWORD_PATTERN)) {
        //   errorMessage = enMsg.passwordPatternValidation;
        //   oldPasswordValid = false;
        // }
        fieldValidationErrors.oldPassword = errorMessage;
        break;
      case "newPassword":
        let errorMessage = "";
        newPasswordValid = true;
        if (value.trim().length < MIN_PASSWORD_LENGTH) {
          errorMessage = enMsg.shortPassword;
          newPasswordValid = false;
        } else if (!value.trim().match(PASSWORD_PATTERN)) {
          errorMessage = enMsg.passwordPatternValidation;
          newPasswordValid = false;
        } else if (this.state.confirmPassword === value) {
          confirmPasswordValid = true;
        }
        fieldValidationErrors.newPassword = errorMessage;
        break;

      case "confirmPassword":
        errorMessage = "";
        confirmPasswordValid = true;
        if (value.trim().length && this.state.newPassword !== value) {
          confirmPasswordValid = false;
          errorMessage = enMsg.confirmPasswordValidation;
        }
        fieldValidationErrors.confirmPassword = errorMessage;
        break;
      default:
    }
    const formValid = newPasswordValid && confirmPasswordValid;
    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValid: formValid,
        newPasswordValid: newPasswordValid,
        oldPasswordValid: oldPasswordValid,
        confirmPasswordValid: confirmPasswordValid
      },
      this.validateForm
    );
  };

  validateForm() {
    return (
      this.state.formValid &&
      this.state.newPasswordValid &&
      this.state.oldPasswordValid &&
      this.state.confirmPasswordValid
    );
  }

  handleEntering = () => {
    // if (radioGroupRef.current != null) {
    //   radioGroupRef.current.focus();
    // }
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.open !== this.state.open) {
      this.setState({
        open: this.props.open
      });
    }
  }

  componentDidMount() {}

  handleCloseDialog = e => {
    this.props.handleChangePasswordDialog();
  };

  resetForm = () => {
    const node = this.formRef.current;
    node.reset();
    const labelNodes = node.querySelectorAll(
      ".MuiInputLabel-shrink.MuiFormLabel-filled:not(.Mui-disabled)"
    );

    this.setState({
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
      loading: false,
      formErrors: {
        newPassword: "",
        oldPassword: "",
        confirmPassword: ""
      },
      oldPasswordValid: false,
      newPasswordValid: false,
      confirmPasswordValid: false,
      formValid: false
    });
  };
  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    const data = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    };

    let showNotification = {};
    try {
      const response = await fetch(this.apiPath, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log(response, response.status == INVALID_DATA_POST);
          if (response.status == INVALID_DATA_POST) {
            showNotification = {
              title: enMsg.failedTitle,
              message: response.responseText,
              type: "danger"
            };
          } else if (
            response.status == SECURITY_ERROR ||
            response.status == FORBIDDEN_STATUS
          ) {
            showNotification = {
              title: enMsg.failedTitle,
              message: response.responseText,
              type: "danger"
            };
            // this.handleCloseDialog();
          } else if (response.status == NO_CONTENT_STATUS) {
            // fetch(this.apiPathProfile, {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(data)
            // });
            showNotification = {
              title: enMsg.successTitle,
              message: enMsg.successPasswordChange,
              type: "success"
            };
            this.handleCloseDialog();
            this.resetForm();
          } else {
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.noDataFound,
              type: "danger"
            };
          }
          return true;
        })
        .catch(error => {
          console.log(error);
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.networkFailedError,
            type: "danger"
          };

          return response;
        });

      // throw new Error(error);
    } catch (error) {
      console.log(error);
      showNotification = {
        title: enMsg.failedTitle,
        message: enMsg.networkFailedError,
        type: "danger"
      };
    }
    console.log(
      showNotification.title,
      showNotification.message,
      showNotification.type
    );
    if (
      showNotification !== undefined &&
      showNotification.title !== undefined &&
      showNotification.message !== undefined &&
      showNotification.type !== undefined
    ) {
      this.notificationID = store.removeNotification(this.notificationID);
      if (this.notificationID == undefined) {
        let notifiaciton = {
          id: new Date().getTime(),
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

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (value.length > MAX_PASSWORD_LENGTH) {
      return true;
    }
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        PaperProps={{
          className: "change-password-dialogue"
        }}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        PaperProps={{
          className: "change-password-dialogue"
        }}
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        open={this.state.open}
        {...this.state.other}
        className={"change-pass-dialog profile-content"}
      >
        <form ref={this.formRef} onSubmit={this.handleSubmit} noValidate>
          <DialogTitle id="confirmation-dialog-title">
            Change Password
          </DialogTitle>
          <DialogContent /* dividers */>
            <FormGroup>
              <TextField
                label="Old Password"
                InputLabelProps={{ className: "required-label" }}
                name="oldPassword"
                type="password"
                autoComplete="off"
                data-validators="isRequired,isAlpha"
                onChange={this.handleUserInput}
                value={this.state.oldPassword}
                inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
              />
              <FormErrors
                show={!this.state.oldPasswordValid}
                formErrors={this.state.formErrors}
                fieldName="oldPassword"
              />
            </FormGroup>
            <FormGroup>
              <TextField
                label="New Password"
                InputLabelProps={{ className: "required-label" }}
                name="newPassword"
                type="password"
                autoComplete="off"
                data-validators="isRequired,isAlpha"
                onChange={this.handleUserInput}
                value={this.state.newPassword}
                inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
              />
              <FormErrors
                show={!this.state.newPasswordValid}
                formErrors={this.state.formErrors}
                fieldName="newPassword"
              />
            </FormGroup>
            <FormGroup>
              <TextField
                label="Confirm Password"
                InputLabelProps={{ className: "required-label" }}
                name="confirmPassword"
                type="password"
                autoComplete="off"
                data-validators="isRequired,isAlpha"
                onChange={this.handleUserInput}
                value={this.state.confirmPassword}
                inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
              />
              <FormErrors
                show={!this.state.confirmPasswordValid}
                formErrors={this.state.formErrors}
                fieldName="confirmPassword"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <div className="form-button-cover">
              <Button
                className={this.state.loading ? "buttonSuccess" : ""}
                disabled={this.state.loading || !this.validateForm()}
                type="submit"
              >
                Change
                {this.state.loading && (
                  <CircularProgress size={24} className="buttonProgress" />
                )}
              </Button>
              <Button
                className="back-btn"
                color="secondary"
                type="button"
                onClick={this.handleCloseDialog}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

ChangePassword.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
  // value: PropTypes.string.isRequired
};

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper
//   },
//   paper: {
//     width: "80%",
//     maxHeight: 435
//   }
// }));

// function ChangePassword1() {
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("Dione");

//   const handleClose = newValue => {
//     setOpen(false);

//     if (newValue) {
//       setValue(newValue);
//     }
//   };

//   return (
//     <div className={classes.root}>
//       <List component="div" role="list">
//         <ListItem button divider disabled role="listitem">
//           <ListItemText primary="Interruptions" />
//         </ListItem>
//         <ListItem
//           button
//           divider
//           aria-haspopup="true"
//           aria-controls="ringtone-menu"
//           aria-label="phone ringtone"
//           onClick={handleClickListItem}
//           role="listitem"
//         >
//           <ListItemText primary="Phone ringtone" secondary={value} />
//         </ListItem>
//         <ListItem button divider disabled role="listitem">
//           <ListItemText
//             primary="Default notification ringtone"
//             secondary="Tethys"
//           />
//         </ListItem>
//         <ChangePasswordRaw
//           classes={{
//             paper: classes.paper
//           }}
//           id="ringtone-menu"
//           keepMounted
//           open={open}
//           onClose={handleClose}
//           value={value}
//         />
//       </List>
//     </div>
//   );
// }
