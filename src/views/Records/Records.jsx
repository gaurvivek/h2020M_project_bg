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

const columns = [
  { id: "pollutionLevel", label: "Pollution Level" },
  { id: "co2", label: "CO2 Value" },
  { id: "tVoc", label: "tVoc Value" },
  { id: "timestamp", label: "Measurement Time" },
  { id: "dateCreated", label: "Creation Date" },
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
    reduxLoadFlag: state.reduxLoadFlag,
  };
};
class RecordsClass extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      value: 0,
      page: 0,
      loading: false,
      rowsPerPage: RECORD_PER_PAGE,
      timeStampVal: new Date().toLocaleTimeString(),
      lastUsers: "30 mins ago",
      currPolution: "Normal",
      lastPollutionTime: "Just Now",
      totalRecords: "3000",
      pollutionData: [],
    };
  }

  componentDidMount() {
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
      <div>
        {/* <NotificationContainer/> */}
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <Card className={"dash-tiles"}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success" className={test} style={styletest}>
                  <img src={featured} alt="logo" />
                </CardIcon>
                <p className={classes.cardCategory}>Current Pollution</p>
                <h3 className={classes.cardTitle}>{currPolution}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <img
                    src={clock}
                    className={clock_cover}
                    style={clock_style}
                    alt="time"
                  />
                  <span>{lastPollutionTime}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Card className={"dash-tiles"}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger" className={test1} style={styletest1}>
                  <img src={advert} alt="logo" />
                </CardIcon>
                <p className={classes.cardCategory}>Number of Records</p>
                <h3 className={classes.cardTitle}>{totalRecords}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <img
                    src={clock}
                    className={clock_cover}
                    style={clock_style}
                    alt="time"
                  />
                  <span>{lastPollutionTime}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <CardBody>
            <Paper className={(classes.root, this.cust_table_cover)}>
              <div className={(classes.tableWrapper, this.cust_table)}>
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
                    {typeof this.state.pollutionData === "object" &&
                      this.state.pollutionData.length
                      ? this.state.pollutionData
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
              <TablePagination
                rowsPerPageOptions={PER_PAGE_OPTIONS}
                component="div"
                count={
                  typeof this.state.pollutionData === "object" &&
                    this.state.pollutionData.length
                    ? this.state.pollutionData.length
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
    );
  }
}

RecordsClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Records = connect(
  mapStateToProps, mapDispatchToProps
)(RecordsClass);

// export default Form;
export default withStyles(dashboardStyle)(Records);