import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import advert from "assets/img/advert.png";
import assetsIcon from "assets/img/assets.png";
import vendor from "assets/img/vendor.png";
import featured from "assets/img/featured.png";
import clock from "assets/img/clock.png";
import enMsg from "__helpers/locale/en/en";
import AddAlert from "@material-ui/icons/AddAlert";
import { Chart } from "react-google-charts";
import SwitchToggle from './SwitchToggle';


import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    // styles,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Link as MaterialLink,
    CircularProgress,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    Input,
    Snackbar,
    LinearProgress,
    TextField,
} from "@material-ui/core";
import CardBody from "components/Card/CardBody.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { userService } from "_services/user.service";
import {
} from "__helpers/constants";
import { SELECTED_CAMPAIGN } from "__helpers/constants";
import { connect } from "react-redux";
import moment from "moment";
import {
    ANALYTICS_CSV_DATA, ANALYTICS_CSV_ADVERTISEMENT_DATA,
    PER_PAGE_OPTIONS,
    RECORD_PER_PAGE,
    EMAIL_REGEX,
    ALERT_NOTIFICATION,
    MAIL_NOTIFICATION,
} from "__helpers/constants";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { FormErrors } from "components/Login/FormErrors"
import DateFnsUtils from "@date-io/date-fns"


am4core.useTheme(am4themes_animated);
const columns = [
    { id: "pollution", label: "Air Quality" },
    { id: "co2", label: "CO2 Value" },
    { id: "tvoc", label: "tVoc Value" },
    { id: "created", label: "Measurement Time" },
    // { id: "created_at", label: "Creation Date" },
];
const columnsTemp = [
    { id: "humidity", label: "Humidity Level" },
    { id: "pressure", label: "Pressure Value" },
    { id: "temperature", label: "Temperature Value" },
    { id: "created", label: "Measurement Time" },
    // { id: "created_at", label: "Creation Date" },
];
const ref = React.createRef();
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4, 2]
};
function mapDispatchToProps(dispatch) {
    return {
        // addArticle: article => dispatch(addArticle(article))
    };
}
const mapStateToProps = state => {
    // console.log("StateVal "+JSON.stringify(state));
    return {
        userInfo: state.userInfo,
        timestamp: state.timestamp,
        campaings: state.campaings,
        reduxLoadFlag: state.reduxLoadFlag,
    };
};
class SettingClass extends React.Component {
    constructor(props) {
        super(props);
        let alertNotificationValue = JSON.parse(localStorage.getItem(ALERT_NOTIFICATION));
        let mailNotificationObj = JSON.parse(localStorage.getItem(MAIL_NOTIFICATION));
        this.dateUtility = new DateFnsUtils();
        this._isMounted = false;
        this.state = {
            loading: false,
            // tvoc: "50",
            tvoc: mailNotificationObj && mailNotificationObj.tvoc ? mailNotificationObj.tvoc : "50",
            co2: mailNotificationObj && mailNotificationObj.co2 ? mailNotificationObj.co2 : "400",
            email: mailNotificationObj && mailNotificationObj.email ? mailNotificationObj.email : "",
            // co2: "400",
            // email: "",
            formErrors: {
                email: "",
            },
            emailValid: mailNotificationObj && mailNotificationObj.email ? true : false,
            alert: alertNotificationValue ? true : false,
            isSubs: mailNotificationObj && mailNotificationObj.email ? true : false,
        };
        this.saveSubscription = this.saveSubscription.bind(this)
    }

    componentDidMount() {
    }
    handleUserInput = e => {
        const name = e.target.name;
        const value = e.target.value;
        // case "email":
        // emailValid = value.match(EMAIL_REGEX);
        // fieldValidationErrors.email = emailValid ? "" : enMsg.inValidEmail;
        // break;

        if (value.match(EMAIL_REGEX)) {
            let formErrors = this.state.formErrors
            formErrors.email = "";
            this.setState({
                formErrors: formErrors,
                emailValid: true,
            })
        } else {
            let formErrors = this.state.formErrors
            formErrors.email = "Please enter valid email";
            this.setState({
                formErrors: formErrors,
                emailValid: false,
            })
        }
        this.setState({ [name]: value });
    };
    handleUserInputAll = e => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({ [name]: value });
        let mailNotificationObj = JSON.parse(localStorage.getItem(MAIL_NOTIFICATION));
        if (!mailNotificationObj)
            mailNotificationObj = {}
        mailNotificationObj[name] = value
        localStorage.setItem(MAIL_NOTIFICATION, JSON.stringify(mailNotificationObj));
    };
    saveSubscription() {
        if (this.state.emailValid) {
            let formErrors = this.state.formErrors
            formErrors.email = "";
            this.setState({
                formErrors: formErrors,
                emailValid: true,
            })
            let dataObj = {
                tvoc: this.state.tvoc,
                co2: this.state.co2,
                email: this.state.email,
            }
            localStorage.setItem(MAIL_NOTIFICATION, JSON.stringify(dataObj));
            let showNotification = {}
            if (this.state.isSubs) {
                showNotification = {
                    title: "Mail",
                    message: "Mail subscription updtaed",
                    type: "success"
                };
            } else {
                showNotification = {
                    title: "Mail",
                    message: "Mail notification subscription started",
                    type: "success"
                };
            }

            userService.showNotification(showNotification)
        } else {
            let formErrors = this.state.formErrors
            formErrors.email = "Please enter valid email";
            this.setState({
                formErrors: formErrors,
                emailValid: false,
            })
        }
    }
    subsAlert() {
        let alert = !this.state.alert;
        this.setState({
            alert: alert,
        })
        localStorage.setItem(ALERT_NOTIFICATION, JSON.stringify(alert));
        let showNotification = {}
        if (alert) {
            showNotification = {
                title: "Alerts",
                message: "Alert notification enabled",
                type: "success"
            };
        } else {
            showNotification = {
                title: "Alerts",
                message: "Alert notification disabled",
                type: "info"
            };
        }

        userService.showNotification(showNotification)
        let mailNotificationObj = JSON.parse(localStorage.getItem(MAIL_NOTIFICATION));
        if (!mailNotificationObj)
            mailNotificationObj = {}
        mailNotificationObj.tvoc = this.state.tvoc
        mailNotificationObj.co2 = this.state.co2
        localStorage.setItem(MAIL_NOTIFICATION, JSON.stringify(mailNotificationObj));
    }
    render() {
        const { classes } = this.props;
        const test = "test-cover";
        const test1 = "test-cover1";
        const test2 = "test-cover2";
        const test3 = "test-cover3";
        const test4 = "test-cover4";
        const clock_cover = "clock-cover";
        const styletest = { padding: "23px" };
        const styletest1 = { padding: "21px 24px" };
        const styletest2 = {
            padding: "20px 23px",
            background: "linear-gradient(60deg, #1666ca, #3c86e1)",
            boxShadow:
                "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(168, 198, 234,.4)"
        };
        const styletest3 = {
            padding: "19px 25px",
            background: "linear-gradient(60deg, #05b0c5, #20c2d6)",
            boxShadow:
                "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(209, 240, 244,.4)"
        };
        const styletest4 = {
            background: "linear-gradient(60deg, #932aad, #a742b9)",
            boxShadow:
                "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(214, 176, 224,.4)"
        };
        const clock_style = {
            width: "15px",
            height: "15px",
            position: "relative",
            top: "3px",
            marginRight: "3px"
        };

        const {
            currPolution,
            lastPollutionTime,
            totalRecords,
            pollutionData,
        } = this.state;
        return (
            <div className="recordFormRow">
                {/* <NotificationContainer/> */}
                <div className="recordFormHead white-text mb-20">Customize Alerts</div>
                
            <span className="box-with-bg">
                <div className="recordFormHead white-text">Threshold Values</div>
                <GridContainer>
                    <div className="dashTimePanel dashTimePanel2">
                        <FormGroup className="setting_cards fix-height p-10">
                            <TextField
                                label="tVoc"
                                select
                                InputLabelProps={{ className: "required-label" }}
                                name="tvoc"
                                autoComplete="off"
                                // value={this.state.tvoc}
                                data-validators="isRequired,isAlpha"
                                // onChange={this.handleUserInput}
                                variant="filled"
                                size="small"
                                margin="dense"
                                SelectProps={{
                                    multiple: false,
                                    value: this.state.tvoc,
                                    onChange: this.handleUserInputAll
                                }}
                            >
                                <MenuItem
                                    value={"50"}
                                >
                                    More than 50
                                </MenuItem>
                                <MenuItem
                                    value={"325"}
                                >
                                    More than 325
                                </MenuItem>
                                <MenuItem
                                    value={"500"}
                                >
                                    More than 500
                                </MenuItem>
                                <MenuItem
                                    value={"1000"}
                                >
                                    {"More than  1000"}
                                </MenuItem>
                            </TextField>
                        </FormGroup>
                        <FormGroup className="setting_cards fix-height p-10">
                            <TextField
                                label="co2"
                                select
                                InputLabelProps={{ className: "required-label" }}
                                name="co2"
                                autoComplete="off"
                                // value={this.state.co2}
                                data-validators="isRequired,isAlpha"
                                // onChange={this.handleUserInput}
                                variant="filled"
                                size="small"
                                margin="dense"
                                SelectProps={{
                                    multiple: false,
                                    value: this.state.co2,
                                    onChange: this.handleUserInputAll
                                }}
                            >
                                <MenuItem
                                    value={"400"}
                                >
                                    More than 400
                                </MenuItem>
                                <MenuItem
                                    value={"1000"}
                                >
                                    More than 1000
                                </MenuItem>
                                <MenuItem
                                    value={"2000"}
                                >
                                    More than 2000
                                </MenuItem>
                                <MenuItem
                                    value={"10000"}
                                >
                                    {"More than 2000"}
                                </MenuItem>
                            </TextField>
                        </FormGroup>
                    </div>
                </GridContainer>
                </span>
                <span className="box-with-bg">
                <div className="recordFormHead white-text">Show Alerts</div>
                <GridContainer>
                    <GridItem xs={12} sm={4}>
                        <Card className={`dash-tiles setting_cards p-10 allertonoff`}>
                            <CardHeader color="success" stats icon>
                                <h5 className={"white-text left-text"}>Alert Message</h5>
                                <SwitchToggle
                                    // id={subscriber.id}
                                    status={this.state.alert}
                                    clickHandler={() => this.subsAlert()}
                                />
                            </CardHeader>
                        </Card>
                    </GridItem>
                </GridContainer>
                </span>
                <span className="box-with-bg">
                <div className="recordFormHead white-text">Subscribe Alerts</div>
                <GridContainer>
                    <div className="dashTimePanel dashTimePanel2">
                        <FormGroup className="full-width setting_cards p-10">
                            <TextField
                                label="email"
                                InputLabelProps={{ className: "required-label" }}
                                name="email"
                                text="email"
                                autoComplete="off"
                                // value={this.state.email}
                                data-validators="isRequired,isAlpha"
                                // onChange={this.handleUserInput}
                                variant="filled"
                                size="small"
                                margin="dense"
                                value={this.state.email}
                                onChange={this.handleUserInput}
                            />
                            <FormErrors
                                show={!this.state.emailValid}
                                formErrors={this.state.formErrors}
                                fieldName="email"
                            />
                        </FormGroup>
                        <div className="recordFormCol">
                            <Button
                                className="client newbtn greenbtn"
                                type="button"
                                onClick={() => this.saveSubscription()}
                                disabled={this.state.loading}
                            >
                                <p className="">
                                    {this.state.loading && (
                                        <CircularProgress
                                            size={24}
                                            className="buttonProgress"
                                            color="secondary"
                                        />
                                    )}
                                    {
                                        this.state.isSubs
                                            ?
                                            "Update"
                                            :
                                            "Subscribe"
                                    }
                                </p>
                            </Button>
                                <p className="p-10"></p>
                        </div>
                    </div>
                </GridContainer>
                </span>
            </div>
        );
    }
}

SettingClass.propTypes = {
    classes: PropTypes.object.isRequired
};

const Setting = connect(
    mapStateToProps, mapDispatchToProps
)(SettingClass);

// export default Form;
export default withStyles(dashboardStyle)(Setting);