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
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);
const columns = [
  { id: "pollution", label: "Pollution Level" },
  { id: "co2", label: "CO2 Value" },
  { id: "tvoc", label: "tVoc Value" },
  { id: "timestamp", label: "Measurement Time" },
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
class RecordClass extends React.Component {
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
      pollutionData: this.props.campaings ? this.props.campaings : [],
      reduxLoadFlag: false,
    };
    this.handleGraphData = this.handleGraphData.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;

    let data = [];
    if (this.state.pollutionData && this.state.pollutionData.length) {
      this.state.pollutionData.map((pData, key) => {
        data.push({ date: new Date(pData.timestamp), name: "Pollution", value: pData.co2 });
      })

      // let visits = 10;
      // for (let i = 1; i < 366; i++) {
      //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      //   data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      // }
    }

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;

    // this.fetchData();
  }
  fetchData() {
    // let apiUrl = "http://35.193.238.179:9090/api/pollution/data";
    // let pollutionData = userService.fetchGlobalApisWithoutAuth(apiUrl);
    // console.log(pollutionData)
    // this.setState({
    //   pollutionData: pollutionData,
    // })
  }

  handleGraphData() {

  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  componentDidUpdate(oldProps) {
    if (oldProps.paddingRight !== this.props.paddingRight) {
      this.chart.paddingRight = this.props.paddingRight;
    }

    if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
      let campaings = [];
      let userInfo = {};
      if (this.props.campaings) {
        let campaingsList = this.props.campaings;
        campaings = (campaingsList) ? campaingsList : [];
        if (this.chart) {
          this.chart.data = campaings;
        }
      }
      this.setState({
        pollutionData: campaings,
      })
    }
  }
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

RecordClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Record = connect(
  mapStateToProps, mapDispatchToProps
)(RecordClass);

// export default Form;
export default withStyles(dashboardStyle)(Record);