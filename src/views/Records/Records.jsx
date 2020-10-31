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
import { CSVLink, CSVDownload } from "react-csv";


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
} from "__helpers/constants";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { FormErrors } from "components/Login/FormErrors"
import DateFnsUtils from "@date-io/date-fns"


am4core.useTheme(am4themes_animated);
const columns = [
  { id: "air_pollution", label: "Air Quality" },
  { id: "co2", label: "CO2 Value" },
  { id: "tvoc", label: "tVoc Value" },
  { id: "created", label: "Measurement Time" },
  // { id: "created_at", label: "Creation Date" },
];
let csvAirHeaders = [
  { key: "air_pollution", label: "Air Quality" },
  { key: "co2", label: "CO2 Value" },
  { key: "tvoc", label: "tVoc Value" },
  { key: "created", label: "Measurement Time" },
];
const columnsTemp = [
  { id: "humidity", label: "Humidity Level" },
  { id: "pressure", label: "Pressure Value" },
  { id: "temperature", label: "Temperature Value" },
  { id: "created", label: "Measurement Time" },
  // { id: "created_at", label: "Creation Date" },
];
let csvTempHeaders = [
  { key: "humidity", label: "Humidity Level" },
  { key: "pressure", label: "Pressure Value" },
  { key: "temperature", label: "Temperature Value" },
  { key: "created", label: "Measurement Time" },
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
class RecordClass extends React.Component {
  constructor(props) {
    super(props);
    this.dateUtility = new DateFnsUtils();
    this._isMounted = false;
    this.state = {
      value: 0,
      page: 0,
      valueT: 0,
      pageT: 0,
      loading: false,
      rowsPerPageT: RECORD_PER_PAGE,
      rowsPerPage: RECORD_PER_PAGE,
      timeStampVal: new Date().toLocaleTimeString(),
      lastUsers: "30 mins ago",
      currPolution: "Normal",
      lastPollutionTime: "Just Now",
      totalRecords: "3000",
      pollutionData: this.props.campaings ? this.props.campaings : [],
      reduxLoadFlag: false,
      allPData: [],
      allTData: [],
      todayDate: new Date(),
      startDate: null,
      endDate: null,
      minSDate: new Date("10/18/2020"),
      minEDate: new Date(),
      maxSDate: new Date(),
      maxEDate: new Date(),
      formErrors: {
        startDate: "",
        endDate: "",
      },
      startDateValid: false,
      endDateValid: false,

      startDateT: null,
      endDateT: null,
      minSDateT: new Date("10/18/2020"),
      minEDateT: new Date(),
      maxSDateT: new Date(),
      maxEDateT: new Date(),
      formErrorsT: {
        startDateT: "",
        endDateT: "",
      },
      startDateValidT: false,
      endDateValidT: false,
    };
    this.handleGraphData = this.handleGraphData.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.getAllPollData = this.getAllPollData.bind(this);
    this.getAllTempData = this.getAllTempData.bind(this);
    // this.getAllPollData() = this.getAllPollData().bind(this);
    // this.getAllTempData() = this.getAllTempData().bind(this);

    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleStartDateError = this.handleStartDateError.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleEndDateError = this.handleEndDateError.bind(this);
    this.searchPollData = this.searchPollData.bind(this);

    this.handleChangeRowsPerPageT = this.handleChangeRowsPerPageT.bind(this);
    this.handleStartDateT = this.handleStartDateT.bind(this);
    this.handleStartDateErrorT = this.handleStartDateErrorT.bind(this);
    this.handleEndDateT = this.handleEndDateT.bind(this);
    this.handleEndDateErrorT = this.handleEndDateErrorT.bind(this);
    this.searchPollDataT = this.searchPollDataT.bind(this);
  }

  componentDidMount() {
    this.getAllPollData();
    this.getAllTempData();
  }
  getToday(dateValue, server) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    let today = new Date(dateValue);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let mName = monthNames[today.getMonth()];
    const yyyy = today.getFullYear();
    const hh = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    if (server) {
      return `${dd}-${mm}-${yyyy}`;
    }
    return `${dd} ${mName} ${hh}:${min}:${sec}`;
  }
  async getAllPollData() {
    let apiUrl = "http://35.193.238.179:9090/api/pollution/data?page=0&size=2000&sort=created,desc";
    if (this.state.startDateValid) {
      let sdateVal = this.getToday(this.state.startDate, true);
      let edateVal = this.getToday(this.state.endDate, true);
      apiUrl = "http://35.193.238.179:9090/api/pollution/data?from_date=" + sdateVal + "&to_date=" + edateVal + "&page=0&size=2000&sort=created,desc";
    }
    let allPData = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    this.setState({
      allPData: allPData
    })
    console.log(allPData)
  }
  async getAllTempData() {
    let apiUrl = "http://35.193.238.179:9090/api/pollution/data?page=0&size=2000&sort=created,desc";
    if (this.state.startDateValidT) {
      let sdateVal = this.getToday(this.state.startDateT, true);
      let edateVal = this.getToday(this.state.endDateT, true);
      apiUrl = "http://35.193.238.179:9090/api/pollution/data?from_date=" + sdateVal + "&to_date=" + edateVal + "&page=0&size=2000&sort=created,desc";
    }
    let allTData = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    this.setState({
      allTData: allTData
    })
    console.log(allTData)
  }
  handleGraphData() {
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  // componentDidUpdate(oldProps) {
  //   if (oldProps.paddingRight !== this.props.paddingRight) {
  //     this.chart.paddingRight = this.props.paddingRight;
  //   }

  //   if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
  //     let campaings = [];
  //     let userInfo = {};
  //     if (this.props.campaings) {
  //       let campaingsList = this.props.campaings;
  //       campaings = (campaingsList) ? campaingsList : [];
  //       if (this.chart) {
  //         this.chart.data = campaings;
  //       }
  //     }
  //     this.setState({
  //       pollutionData: campaings,
  //     })
  //   }
  // }
  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage
    });
    // setPage(newPage);
  };
  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0
    });
  }
  handleChangePageT = async (event, newPage) => {
    this.setState({
      pageT: newPage
    });
    // setPage(newPage);
  };
  handleChangeRowsPerPageT(event) {
    this.setState({
      rowsPerPageT: +event.target.value,
      pageT: 0
    });
  }

  handleStartDate = value => {
    let startDate = true;
    if (value == null || !this.dateUtility.isValid(value)) {
      startDate = false;
    }
    this.setState(
      {
        startDate: value,
        startDateValid: startDate,
        minEDate: value,
      },
      () => {
        this.validateField("startDate", value);
      }
    );
  };
  handleStartDateError(error, value) {
    this.setState({
      startDateValid: error || value == "" || value == null ? false : true
    });
  }
  handleEndDate = value => {
    let endDate = true;
    if (value == null || !this.dateUtility.isValid(value)) {
      endDate = false;
    }
    this.setState(
      {
        endDate: value,
        endDateValid: endDate,
        maxSDate: value,
      },
      () => {
        this.validateField("endDate", value);
      }
    );
  };
  handleEndDateError(error, value) {
    this.setState({
      endDateValid: error || value == "" || value == null ? false : true
    });
  }

  validateField = (fieldName, fieldValue) => {
    let fieldValidationErrors = this.state.formErrors;
    let startDateValid = this.state.startDateValid;
    let endDateValid = this.state.endDateValid;

    switch (fieldName) {
      case "startDate":
        startDateValid = (fieldValue && fieldValue != "") ? true : false;
        fieldValidationErrors.startDate = !startDateValid
          ? enMsg.startDateRequiredMsg
          : "";
        break;
      case "endDate":
        endDateValid = (fieldValue && fieldValue != "") ? true : false;
        fieldValidationErrors.endDate = !endDateValid
          ? enMsg.endDateRequiredMsg
          : "";
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      startDateValid: startDateValid,
      endDateValid: endDateValid,
    }, this.validateForm);
  }
  validateForm() {
    return (
      this.state.startDateValid &&
      this.state.endDateValid
    )
  }
  searchPollData() {
    this.getAllPollData()
  }

  handleStartDateT = value => {
    let startDate = true;
    if (value == null || !this.dateUtility.isValid(value)) {
      startDate = false;
    }
    this.setState(
      {
        startDateT: value,
        startDateValidT: startDate,
        minEDateT: value,
      },
      () => {
        this.validateFieldT("startDateT", value);
      }
    );
  };
  handleStartDateErrorT(error, value) {
    this.setState({
      startDateValidT: error || value == "" || value == null ? false : true
    });
  }
  handleEndDateT = value => {
    let endDate = true;
    if (value == null || !this.dateUtility.isValid(value)) {
      endDate = false;
    }
    this.setState(
      {
        endDateT: value,
        endDateValidT: endDate,
        maxSDateT: value,
      },
      () => {
        this.validateFieldT("endDateT", value);
      }
    );
  };
  handleEndDateErrorT(error, value) {
    this.setState({
      endDateValidT: error || value == "" || value == null ? false : true
    });
  }

  validateFieldT = (fieldName, fieldValue) => {
    let fieldValidationErrors = this.state.formErrorsT;
    let startDateValid = this.state.startDateValidT;
    let endDateValid = this.state.endDateValidT;

    switch (fieldName) {
      case "startDateT":
        startDateValid = (fieldValue && fieldValue != "") ? true : false;
        fieldValidationErrors.startDate = !startDateValid
          ? enMsg.startDateRequiredMsg
          : "";
        break;
      case "endDateT":
        endDateValid = (fieldValue && fieldValue != "") ? true : false;
        fieldValidationErrors.endDate = !endDateValid
          ? enMsg.endDateRequiredMsg
          : "";
        break;
    }
    this.setState({
      formErrorsT: fieldValidationErrors,
      startDateValidT: startDateValid,
      endDateValidT: endDateValid,
    }, this.validateFormT);
  }
  validateFormT() {
    return (
      this.state.startDateValidT &&
      this.state.endDateValidT
    )
  }
  searchPollDataT() {
    this.getAllTempData()
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
      allPData,
      allTData,
    } = this.state;
    return (
      <div className="recordFormRow">
        <span className="box-with-bg">
          {/* <NotificationContainer/> */}
          <div className="recordFormHead white-text">Air Quality Records</div>
          <div className="full-width text-right">
            <div className="recordFormCol widthauto">
              <FormControl className="rec-inputs white-text">
                <MuiPickersUtilsProvider
                  variant="outlined"
                  utils={DateFnsUtils}
                >
                  <KeyboardDatePicker

                    label="Start Date"
                    format="MM/dd/yyyy"
                    margin="normal"
                    className=""
                    id="start-date-picker-dialog"
                    InputLabelProps={{
                      className: "required-label white-text"
                    }}
                    InputProps={{ autoComplete: "off" }}
                    name="estDate"
                    animateYearScrolling={true}
                    value={this.state.startDate}
                    minDate={this.state.minSDate}
                    maxDate={this.state.maxSDate}
                    minDateMessage={enMsg.startMinDate}
                    maxDateMessage={enMsg.startMaxDate}
                    onChange={this.handleStartDate}
                    onError={this.handleStartDateError}
                    className="KeyboardDatePicker invoice_picker"
                    invalidDateMessage={enMsg.invalidDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                      className: "date-picker-span"
                    }}
                    size="small"
                  />
                </MuiPickersUtilsProvider>
                <FormErrors
                  show={!this.state.startDateValid}
                  formErrors={this.state.formErrors}
                  fieldName="startDate"
                />
              </FormControl>
            </div>
            <div className="recordFormCol widthauto">
              <FormControl >
                <MuiPickersUtilsProvider
                  // variant="outlined"
                  utils={DateFnsUtils}

                >
                  <KeyboardDatePicker

                    label="End Date"
                    format="MM/dd/yyyy"
                    margin="normal"
                    className=""
                    id="start-date-picker-dialog"
                    InputLabelProps={{
                      className: "required-label white-text"
                    }}
                    InputProps={{ autoComplete: "off" }}
                    name="estDate"
                    animateYearScrolling={true}
                    value={this.state.endDate}
                    minDate={this.state.minEDate}
                    maxDate={this.state.maxEDate}
                    minDateMessage={enMsg.endMinDate}
                    maxDateMessage={enMsg.endMaxDate}
                    onChange={this.handleEndDate}
                    onError={this.handleEndDateError}
                    className="KeyboardDatePicker invoice_picker"
                    invalidDateMessage={enMsg.invalidDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                      className: "date-picker-span"
                    }}
                  />
                </MuiPickersUtilsProvider>
                <FormErrors
                  show={!this.state.startDateValid}
                  formErrors={this.state.formErrors}
                  fieldName="startDate"
                />
              </FormControl>
            </div>
            <div className="recordFormCol widthauto">
              <Button
                className="client newbtn greenbtn"
                type="button"
                onClick={() => this.searchPollData()}
                disabled={!this.validateForm() || this.state.loading}
              >
                <p>
                  {this.state.loading && (
                    <CircularProgress
                      size={24}
                      className="buttonProgress"
                      color="secondary"
                    />
                  )}
              Search
            </p>
              </Button>
            </div>
            <div className="recordFormCol widthauto">
              <h4 className={this.camph}>&nbsp;{(allPData && allPData.length) ? <CSVLink data={allPData} headers={csvAirHeaders} className="tblDownloadBtn cm2" filename={"airPollution.csv"}><i className="fa fa-download"></i></CSVLink> : ""}</h4>
            </div>
          </div>
          <div className="full-width">
            <GridContainer>
              <CardBody>
                <Paper className={(classes.root, this.cust_table_cover)}>
                  <div className={(classes.tableWrapper, this.cust_table)}>
                    <div className="table-respopnsive">
                      <Table>
                        <TableHead className={this.tableh}>
                          <TableRow>
                            {columns.map(column => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody key="TableBody">
                          {typeof this.state.allPData === "object" &&
                            this.state.allPData.length
                            ? this.state.allPData
                              .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                              )
                              .map(row => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.adNetworkId}
                                  >
                                    {columns.map(column => {
                                      const value = row[column.id];
                                      if (column.id == "dateCreated") {
                                        let newDate = new Date(value).toUTCString();
                                        return (
                                          <TableCell key={column.id}>
                                            {newDate}
                                          </TableCell>
                                        );
                                      }
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                        >
                                          {column.format &&
                                            typeof value === "number"
                                            ? value
                                            : (value) ? value : "0"}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })
                            : null}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={PER_PAGE_OPTIONS}
                    component="div"
                    count={
                      typeof this.state.allPData === "object" &&
                        this.state.allPData.length
                        ? this.state.allPData.length
                        : 0
                    }
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    backIconButtonProps={{
                      "aria-label": "previous page"
                    }}
                    nextIconButtonProps={{
                      "aria-label": "next page"
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </Paper>
              </CardBody>
            </GridContainer>
          </div>
        </span>
        <span className="box-with-bg">
          <div className="recordFormRow">
            <div className="recordFormHead white-text">Climate Records</div>
            <div className="full-width text-right">
              <div className="recordFormCol widthauto">
                <FormControl >
                  <MuiPickersUtilsProvider
                    variant="outlined"
                    utils={DateFnsUtils}
                  >
                    <KeyboardDatePicker

                      label="Start Date"
                      format="MM/dd/yyyy"
                      margin="normal"
                      className=""
                      id="start-date-picker-dialog"
                      InputLabelProps={{
                        className: "required-label white-text"
                      }}
                      InputProps={{ autoComplete: "off" }}
                      name="estDate"
                      animateYearScrolling={true}
                      value={this.state.startDateT}
                      minDate={this.state.minSDateT}
                      maxDate={this.state.maxSDateT}
                      minDateMessage={enMsg.startMinDate}
                      maxDateMessage={enMsg.startMaxDate}
                      onChange={this.handleStartDateT}
                      onError={this.handleStartDateErrorT}
                      className="KeyboardDatePicker invoice_picker"
                      invalidDateMessage={enMsg.invalidDate}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                        className: "date-picker-span"
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <FormErrors
                    show={!this.state.startDateValid}
                    formErrors={this.state.formErrors}
                    fieldName="startDate"
                  />
                </FormControl>
              </div>
              <div className="recordFormCol widthauto">
                <FormControl >
                  <MuiPickersUtilsProvider
                    // variant="outlined"
                    utils={DateFnsUtils}

                  >
                    <KeyboardDatePicker

                      label="End Date"
                      format="MM/dd/yyyy"
                      margin="normal"
                      className=""
                      id="start-date-picker-dialog"
                      InputLabelProps={{
                        className: "required-label white-text"
                      }}
                      InputProps={{ autoComplete: "off" }}
                      name="estDate"
                      animateYearScrolling={true}
                      value={this.state.endDateT}
                      minDate={this.state.minEDateT}
                      maxDate={this.state.maxEDateT}
                      minDateMessage={enMsg.endMinDate}
                      maxDateMessage={enMsg.endMaxDate}
                      onChange={this.handleEndDateT}
                      onError={this.handleEndDateErrorT}
                      className="KeyboardDatePicker invoice_picker"
                      invalidDateMessage={enMsg.invalidDate}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                        className: "date-picker-span"
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <FormErrors
                    show={!this.state.startDateValid}
                    formErrors={this.state.formErrors}
                    fieldName="startDate"
                  />
                </FormControl>
              </div>
              <div className="recordFormCol widthauto">
                <Button
                  className="client newbtn greenbtn"
                  type="button"
                  onClick={() => this.searchPollDataT()}
                  disabled={!this.validateFormT() || this.state.loading}
                >
                  <p>
                    {this.state.loading && (
                      <CircularProgress
                        size={24}
                        className="buttonProgress"
                        color="secondary"
                      />
                    )}
                Search
                </p>
                </Button>
              </div>
              <div className="recordFormCol widthauto">
                <h4 className={this.camph}>&nbsp;{(allTData && allTData.length) ? <CSVLink data={allTData} headers={csvTempHeaders} className="tblDownloadBtn cm2" filename={"climateRecords.csv"}><i className="fa fa-download"></i></CSVLink> : ""}</h4>
              </div>
            </div>
          </div>
          <GridContainer>
            <CardBody>
              <Paper className={(classes.root, this.cust_table_cover)}>
                <div className={(classes.tableWrapper, this.cust_table)}>
                  <div className="table-respopnsive">
                    <Table>
                      <TableHead className={this.tableh}>
                        <TableRow>
                          {columnsTemp.map(column => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody key="TableBody">
                        {typeof this.state.allTData === "object" &&
                          this.state.allTData.length
                          ? this.state.allTData
                            .slice(
                              this.state.pageT * this.state.rowsPerPageT,
                              this.state.pageT * this.state.rowsPerPageT +
                              this.state.rowsPerPageT
                            )
                            .map(row => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.adNetworkId}
                                >
                                  {columnsTemp.map(column => {
                                    const value = row[column.id];
                                    if (column.id == "dateCreated") {
                                      let newDate = new Date(value).toUTCString();
                                      return (
                                        <TableCell key={column.id}>
                                          {newDate}
                                        </TableCell>
                                      );
                                    }
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.format &&
                                          typeof value === "number"
                                          ? column.format(value)
                                          : (value) ? value : "unknown"}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })
                          : null}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <TablePagination
                  rowsPerPageOptions={PER_PAGE_OPTIONS}
                  component="div"
                  count={
                    typeof this.state.allTData === "object" &&
                      this.state.allTData.length
                      ? this.state.allTData.length
                      : 0
                  }
                  rowsPerPage={this.state.rowsPerPageT}
                  page={this.state.pageT}
                  backIconButtonProps={{
                    "aria-label": "previous page"
                  }}
                  nextIconButtonProps={{
                    "aria-label": "next page"
                  }}
                  onChangePage={this.handleChangePageT}
                  onChangeRowsPerPage={this.handleChangeRowsPerPageT}
                  color="#ffffff"
                />
              </Paper>
            </CardBody>
          </GridContainer>
        </span>
      </div>
    );
  }
}

RecordClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Record = connect(
  mapStateToProps, mapDispatchToProps
)(RecordClass);

// export default Form;
export default withStyles(dashboardStyle)(Record);