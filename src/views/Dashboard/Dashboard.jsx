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

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { FormErrors } from "components/Login/FormErrors"
import DateFnsUtils from "@date-io/date-fns"
import { generalAuthTokenHeader } from "__helpers/auth-header";

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
  ALERT_NOTIFICATION,
  MAIL_NOTIFICATION,
  SYNC_TIME,
} from "__helpers/constants";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// then all Highcharts modules you will need
import HighchartsMore from 'highcharts/highcharts-more';
import dataModule from 'highcharts/modules/data';
import GoogleMapReact from 'google-map-react';
import { last } from "@amcharts/amcharts4/.internal/core/utils/Array";
import flatIcon from "assets/img/flat.svg"
import sunnycon from "assets/img/sunny.svg"
import logoIcon from "assets/img/sLogo.png"


am4core.useTheme(am4themes_animated);
HighchartsMore(Highcharts);
dataModule(Highcharts);
// Create chart instance

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
    campaings: state.campaings,
    reduxLoadFlag: state.reduxLoadFlag,
  };
};
const MapMarker = ({ text }) =>
  <div style={{
    color: 'white',
    background: 'none 0% 0% repeat scroll rgb(255 255 255)',
    padding: '8x 5px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    <img
      style={{ width: "30px" }}
      src={logoIcon}
    />
    {/* {text} */}
  </div>;
class DashboardClass extends React.Component {
  constructor(props) {
    super(props);
    this.dateUtility = new DateFnsUtils();
    this._isMounted = false;
    let alertNotificationValue = JSON.parse(localStorage.getItem(ALERT_NOTIFICATION));
    let mailNotificationObj = JSON.parse(localStorage.getItem(MAIL_NOTIFICATION));
    let syncTimeObj = JSON.parse(localStorage.getItem(SYNC_TIME));
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
      pollutionChartOption: {},
      highChartOption: {},
      tempHighChart: {},
      allDataHighChart: {},
      center: { lat: 26.261530, lng: 72.965993 },
      zoom: 16,
      selectedDate: new Date(),
      todayItems: 20,
      allItems: 200,
      latestData: {},
      todayData: [],
      allData: [],
      pollGraphType: "co2",
      todayDate: new Date(),
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
      isAlertSubs: alertNotificationValue ? true : false,
      isMailSubs: mailNotificationObj && mailNotificationObj.email ? true : false,
      alertTvoc: mailNotificationObj && mailNotificationObj.tvoc ? mailNotificationObj.tvoc : "50",
      alertCo2: mailNotificationObj && mailNotificationObj.co2 ? mailNotificationObj.co2 : "400",
      alertEmail: mailNotificationObj && mailNotificationObj.email ? mailNotificationObj.email : "",
      showAlert: 1,
      showMail: 1,
      syncTime: syncTimeObj ? syncTimeObj * 1000 : 15000,
      // syncTime: 10000,
    };
    this.handleGraphData = this.handleGraphData.bind(this)
    this.handlePollutionGraphData = this.handlePollutionGraphData.bind(this)
    this.newHighPollChart = this.newHighPollChart.bind(this)
    this.tempHighChart = this.tempHighChart.bind(this)
    this.allDataHighChart = this.allDataHighChart.bind(this)

    this.getLastData = this.getLastData.bind(this)
    this.getTodayData = this.getTodayData.bind(this)
    this.getAllData = this.getAllData.bind(this)

    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleStartDateError = this.handleStartDateError.bind(this);
    this.backgroundDataApi = this.backgroundDataApi.bind(this);
    this.backgroundM = this.backgroundM.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }

  getToday(dateValue, dateFormat) {
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
    if (dateFormat) {
      if (dateFormat == "date") {
        return `${dd}-${mm}-${yyyy}`;
      } else {
        return `${hh}:${min}:${sec}`;
      }
    }
    return `${dd} ${mName} ${hh}:${min}:${sec}`;
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  async componentDidMount() {

    this.getLastData();
    this.getTodayData();
    this.getAllData();

    // this.handleGraphData();
    // this.handlePollutionGraphData();
    // this.newHighPollChart();
    // this.tempHighChart();
    clearInterval(this.interval);
    this.backgroundM();
  }
  async backgroundM() {
    this.interval = setInterval(
      () => this.backgroundDataApi(), this.state.syncTime
    );
  }

  backgroundDataApi() {
    this.getLastData();
    this.getTodayData();
    // this.setState({
    //   showAlert: true,
    // })
    // this.getAllData();
  }
  async sendMail(dataObj, emailAddr) {
    let mailBody = `
    Dear,

    We have measured danger level air quality. please take appropriate action.
    <br>Poor air quality exposure may lead to headaches, sleepiness and stagnant, stale, stuffy air. Poor concentration, loss of attention, increased heart rate and slight nausea may also be present.
    <br>Please take care. Stay safe, Stay Healthy!
    <br>Thank You
    <br>
    Regards
    <br>
    Techno Wonders Team.
  `;
    const data = {
      message: mailBody,
      email: emailAddr,
      "tvoc": dataObj.pollution ? dataObj.pollution.tvoc : "N/A",
      "co2": dataObj.pollution ? dataObj.pollution.co2 : "N/A",
      "temperature": dataObj.pollution ? dataObj.pollution.temperature : "N/A",
      "humidity": dataObj.pollution ? dataObj.pollution.humidity : "N/A",
      "pressure": dataObj.pollution ? dataObj.pollution.pressure : "N/A"
    };
    let apiUrl = "http://35.193.238.179:9090/api/pollution/send-mail";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: generalAuthTokenHeader(),
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.status === 400) {

          } else if (response.status === 401) {

          } else if (response.ok) {
          } else {

          }
          return response.json();
          // return response.text();
        })
        .then(data => {
          console.log(data)
          return true;
        })
        .catch(error => {

          return response;
        });

    } catch (error) {

    }
  }
  async getLastData() {
    let apiUrl = "http://35.193.238.179:9090/api/pollution/top-data";
    let lastdata = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    let alertNotificationValue = JSON.parse(localStorage.getItem(ALERT_NOTIFICATION));
    let mailNotificationObj = JSON.parse(localStorage.getItem(MAIL_NOTIFICATION));

    let isAlertSubs = alertNotificationValue ? true : false;
    let isMailSubs = mailNotificationObj && mailNotificationObj.email ? true : false;

    if (lastdata && lastdata.max_co2) {
      let co2MaxVal = 0;
      lastdata.maxPollLevel = "Good"
      if ((lastdata.max_co2 > 250 && lastdata.max_co2 <= 400) || (lastdata.max_tvoc <= 5)) {
        co2MaxVal = 0;
        lastdata.maxPollLevel = "Good"
      } else if ((lastdata.max_co2 > 400 && lastdata.max_co2 <= 1000) || (lastdata.max_tvoc > 5 && lastdata.max_tvoc <= 50)) {
        co2MaxVal = 1;
        lastdata.maxPollLevel = "Normal"
      } else if ((lastdata.max_co2 > 1000 && lastdata.max_co2 <= 2000) || (lastdata.max_tvoc > 50 && lastdata.max_tvoc <= 325)) {
        co2MaxVal = 2;
        lastdata.maxPollLevel = "Poor Air"
      } else if ((lastdata.max_co2 > 2000 && lastdata.max_co2 <= 5000) || (lastdata.max_tvoc > 325 && lastdata.max_tvoc <= 500)) {
        co2MaxVal = 3;
        lastdata.maxPollLevel = "Air Quality Alert"
      } else if ((lastdata.max_co2 > 5000) || (lastdata.max_tvoc > 325 && lastdata.max_tvoc <= 500)) {
        co2MaxVal = 4;
        lastdata.maxPollLevel = "Danger Level"
      }

      // let co2MaxVal = 0;
      lastdata.minPollLevel = "Good"
      if ((lastdata.min_co2 > 250 && lastdata.min_co2 <= 400) || (lastdata.min_tvoc <= 5)) {
        co2MaxVal = 0;
        lastdata.minPollLevel = "Good"
      } else if ((lastdata.min_co2 > 400 && lastdata.min_co2 <= 1000) || (lastdata.min_tvoc > 5 && lastdata.min_tvoc <= 50)) {
        co2MaxVal = 1;
        lastdata.minPollLevel = "Normal"
      } else if ((lastdata.min_co2 > 1000 && lastdata.min_co2 <= 2000) || (lastdata.min_tvoc > 50 && lastdata.min_tvoc <= 325)) {
        co2MaxVal = 2;
        lastdata.minPollLevel = "Poor Air"
      } else if ((lastdata.min_co2 > 2000 && lastdata.min_co2 <= 5000) || (lastdata.min_tvoc > 325 && lastdata.min_tvoc <= 500)) {
        co2MaxVal = 3;
        lastdata.minPollLevel = "Air Quality Alert"
      } else if ((lastdata.min_co2 > 5000) || (lastdata.min_tvoc > 325 && lastdata.min_tvoc <= 500)) {
        co2MaxVal = 4;
        lastdata.minPollLevel = "Danger Level"
      }

      // let co2MaxVal = 0;
      lastdata.pollLevel = "Good"
      lastdata.pollColor = "light_green_color"
      let showNotification = {};
      if ((lastdata.pollution.co2 > 250 && lastdata.pollution.co2 <= 400) || (lastdata.pollution.co2 <= 5)) {
        co2MaxVal = 0;
        lastdata.pollLevel = "Good"
        lastdata.pollColor = "light_green_color"
        showNotification = {
          title: "Air Quality Alert",
          message: "We have measured good air quality",
          type: "success"
        };
      } else if ((lastdata.pollution.co2 > 400 && lastdata.pollution.co2 <= 1000) || (lastdata.pollution.co2 > 5 && lastdata.pollution.co2 <= 50)) {
        co2MaxVal = 1;
        lastdata.pollLevel = "Normal"
        lastdata.pollColor = "orange_color"
        showNotification = {
          title: "Air Quality Alert",
          message: "We have measured normal air quality",
          type: "success"
        };
      } else if ((lastdata.pollution.co2 > 1000 && lastdata.pollution.co2 <= 2000) || (lastdata.pollution.co2 > 50 && lastdata.pollution.co2 <= 325)) {
        co2MaxVal = 2;
        lastdata.pollLevel = "Poor Air"
        lastdata.pollColor = "light_orange_color"
        showNotification = {
          title: "Air Quality Alert",
          message: "We have measured medium level poor air quality",
          type: "warning"
        };
      } else if ((lastdata.pollution.co2 > 2000 && lastdata.pollution.co2 <= 5000) || (lastdata.pollution.co2 > 325 && lastdata.pollution.co2 <= 500)) {
        co2MaxVal = 3;
        lastdata.pollLevel = "Air Quality Alert"
        lastdata.pollColor = "light_red_color"
        showNotification = {
          title: "Air Quality Alert",
          message: "We have measured poor air quality",
          type: "danger"
        };
      } else if ((lastdata.pollution.co2 > 5000) || (lastdata.pollution.co2 > 325 && lastdata.pollution.co2 <= 500)) {
        co2MaxVal = 4;
        lastdata.pollLevel = "Danger Level"
        lastdata.pollColor = "red_color"
        showNotification = {
          title: "Air Quality Alert",
          message: "We have measured danger level air quality",
          type: "danger"
        };
      }

      if (isAlertSubs && this.state.showAlert) {
        if (this.state.showAlert == 4) {
          // showNotification = {
          //   title: "Air Quality Alert",
          //   message: "We have measured danger level air quality",
          //   type: "danger"
          // };
          let alertTvoc = mailNotificationObj && mailNotificationObj.tvoc ? mailNotificationObj.tvoc : "50";
          let alertCo2 = mailNotificationObj && mailNotificationObj.co2 ? mailNotificationObj.co2 : "400";
          let alertEmail = mailNotificationObj && mailNotificationObj.email ? mailNotificationObj.email : "";
          if (alertTvoc <= lastdata.pollution.tvoc || alertCo2 <= lastdata.pollution.co2) {
            userService.showNotification(showNotification)
            this.setState({
              showAlert: 1,
            })
          }
        } else {
          let showAlert = this.state.showAlert
          this.setState({
            showAlert: showAlert + 1,
          })
        }
      }
      if (isMailSubs && this.state.showMail) {
        if (this.state.showMail == 4) {

          let alertTvoc = mailNotificationObj && mailNotificationObj.tvoc ? mailNotificationObj.tvoc : "50";
          let alertCo2 = mailNotificationObj && mailNotificationObj.co2 ? mailNotificationObj.co2 : "400";
          let alertEmail = mailNotificationObj && mailNotificationObj.email ? mailNotificationObj.email : "";
          if (alertTvoc <= lastdata.pollution.tvoc || alertCo2 <= lastdata.pollution.co2) {
            this.setState({
              showMail: 1,
            })
            this.sendMail(lastdata, alertEmail);
          }
        } else {
          let showMail = this.state.showMail
          this.setState({
            showMail: showMail + 1,
          })
        }
      }

      if (lastdata.max_temperature <= 0) {
        lastdata.maxTempLevel = "Cold"
      } else if (lastdata.max_temperature > 0 && lastdata.max_temperature < 10) {
        lastdata.maxTempLevel = "Cold"
      } else if (lastdata.max_temperature > 10 && lastdata.max_temperature < 20) {
        lastdata.maxTempLevel = "Cool"
      } else if (lastdata.max_temperature > 20 && lastdata.max_temperature < 30) {
        lastdata.maxTempLevel = "Warm"
      } else if (lastdata.max_temperature > 30 && lastdata.max_temperature < 40) {
        lastdata.maxTempLevel = "Hot"
      } else {
        lastdata.maxTempLevel = "Hot & Sunny"
      }

      if (lastdata.min_temperature <= 0) {
        lastdata.minTempLevel = "Cold"
      } else if (lastdata.min_temperature > 0 && lastdata.min_temperature < 10) {
        lastdata.minTempLevel = "Cold"
      } else if (lastdata.min_temperature > 10 && lastdata.min_temperature < 20) {
        lastdata.minTempLevel = "Cool"
      } else if (lastdata.min_temperature > 20 && lastdata.min_temperature < 30) {
        lastdata.minTempLevel = "Warm"
      } else if (lastdata.min_temperature > 30 && lastdata.min_temperature < 45) {
        lastdata.minTempLevel = "Hot"
      } else {
        lastdata.minTempLevel = "Hot & Sunny"
      }

      if (lastdata.pollution.temperature <= 0) {
        lastdata.tempLevel = "Cold"
      } else if (lastdata.pollution.temperature > 0 && lastdata.pollution.temperature < 10) {
        lastdata.tempLevel = "Cold"
      } else if (lastdata.pollution.temperature > 10 && lastdata.pollution.temperature < 20) {
        lastdata.tempLevel = "Cool"
      } else if (lastdata.pollution.temperature > 20 && lastdata.pollution.temperature < 30) {
        lastdata.tempLevel = "Warm"
      } else if (lastdata.pollution.temperature > 30 && lastdata.pollution.temperature < 40) {
        lastdata.tempLevel = "Hot"
      } else {
        lastdata.tempLevel = "Hot & Sunny"
      }

      let latestDataTime = this.getToday(new Date(lastdata.pollution.timestamp));
      lastdata.latestDataTime = latestDataTime;
    }
    this.setState({
      latestData: lastdata
    })
    // console.log(lastdata)
  }

  async getTodayData() {
    let todayDate = new Date();
    let dateVal = this.getToday(this.state.selectedDate, "date");

    let apiUrl = "http://35.193.238.179:9090/api/pollution/data?from_date=" + dateVal + "&to_date=" + dateVal + "&page=0&size=" + this.state.todayItems + "&sort=created,desc";
    let todayData = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    this.setState({
      todayData: todayData
    }, () => {
      this.newHighPollChart(); this.tempHighChart()
    })
    console.log(todayData)
  }
  tempHighChart() {
    let pollutionDataArr = [];
    let chartLabels = [];
    let colorsLabels = [];
    let pollutionLabels = [];
    let dayWiseData = [];
    if (this.state.todayData && this.state.todayData.length) {
      this.state.todayData.map((pData, key) => {
        var day = new Date(pData.timestamp).getDate();

        let todayVal = this.getToday(new Date(pData.timestamp), "time");

        if (dayWiseData && dayWiseData[day]) {
          // console.log("main if", key)
          let dayData = dayWiseData[day];
          dayData['data'].push(pData.co2)
          dayWiseData.map((dData, key) => {

          })
        } else {
          // console.log("main else", key)
          let tempData = []
          tempData.data = [pData.co2]
          tempData.day = day
          tempData.timestamp = pData.timestamp
          tempData.name = pData.timestamp
          dayWiseData[day] = tempData
        }

        let tempPollData = {}
        tempPollData.y = pData.temperature
        tempPollData.pollution = pData.pollution
        tempPollData.dayTemp = "Normal"
        tempPollData.timestamp = new Date(pData.timestamp)

        if (pData.temperature <= 0) {
          tempPollData.dayTemp = "Cold"
        } else if (pData.temperature > 0 && pData.temperature < 10) {
          tempPollData.dayTemp = "Cold"
        } else if (pData.temperature > 10 && pData.temperature < 20) {
          tempPollData.dayTemp = "Cool"
        } else if (pData.temperature > 20 && pData.temperature < 30) {
          tempPollData.dayTemp = "Warm"
        } else if (pData.temperature > 30 && pData.temperature < 40) {
          tempPollData.dayTemp = "Hot"
        } else {
          tempPollData.dayTemp = "Hot & Sunny"
        }

        let colorCode = "27b35a"
        if (pData.temperature <= 0) {
          colorCode = "#27b35a"
        } else if (pData.temperature > 0 && pData.temperature <= 10) {
          colorCode = "#27b35a"
        } else if (pData.temperature > 10 && pData.temperature <= 20) {
          colorCode = "#2cb327"
        } else if (pData.temperature > 20 && pData.temperature <= 30) {
          colorCode = "#9ab00a"
        } else if (pData.temperature > 30 && pData.temperature <= 40) {
          colorCode = "#b0120a"
        } else {
          colorCode = "#b0120a"
        }
        tempPollData.color = colorCode;

        // pollutionDataArr.push(pData.co2);
        pollutionDataArr.push(tempPollData);
        pollutionLabels.push(pData.pollution);
        chartLabels.push(todayVal);

        colorsLabels.push(colorCode);
      })
      // console.log(colorsLabels)
    }

    let formatedDailyData = []
    dayWiseData.map(dailyData => {
      // formatedDailyData.push(dailyData)
      formatedDailyData = [...formatedDailyData, dailyData]
    })

    let tempHighChart = {
      chart: {
        type: 'spline',
        backgroundColor: '#ffffff1c',
        style: { color: '#fff' }
        // inverted: true,
        // zoom: "xy"
      },
      title: {
        text: 'Temperature (°C) Graph',
        style: { color: '#fff' }
      },
      subtitle: {
        text: 'Day Wise Temperature Graph',
        style: { color: '#fff' }
      },
      xAxis: {
        title: {
          text: 'Time',
          style: { color: '#fff' },
        },
        type: 'category',
        categories: chartLabels,
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          formatter: function () {
            return chartLabels[this.pos];
          },
          style: {
            color: '#fff',
          }
        }
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)',
          style: { color: '#fff' },
        },
        type: 'logarithmic',
        min: 1,
        labels: {
          overflow: 'justify',
          style: {
            color: '#fff',
          }
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          // console.log(this, this.point.low); // just to see , what data you can access
          let tempValue = this.point.dayTemp;
          let colorValue = this.point.color;
          let yValue = this.point.y;
          let nameValue = this.series.name;
          let keyValue = this.point.timestamp;
          // return '<b>' + this.x +
          //   '</b>: <b>' + barValue + ' %</b>';
          return '<span style="font-size:10px">' + keyValue + '</span><table><tr><td style="padding:0">' + nameValue + ': </td>' +
            '<td style="padding:0"><b>' + yValue + ' (°C)</b></td></tr><tr><td style="color:' + colorValue + ';padding:0">' + tempValue + '</td></tr></table>'

        }
      },
      // tooltip: {
      //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y:.1f} unit</b></td><td>{series.pollutionLabels}</td></tr>',
      //   footerFormat: '</table>',
      //   shared: true,
      //   useHTML: true
      // },
      // colors: ['#b0120a', '#ffab91', '#ED5534', '#433C39', '#545150', '#B09187', '#B087A0'],
      colors: colorsLabels,
      pollutionLabels: pollutionLabels,
      plotOptions: {
        columnrange: {
          dataLabels: {
            enabled: true,
            format: '{y}°C'
          },
          colorByPoint: true
        },
        series: {
          animation: false
        },
        column: {
          colorByPoint: true
        },
        line: {
          dataLabels: {
            enabled: true,
            format: '{y}°C'
          },
          enableMouseTracking: true
        },
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: 'fff'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Temperature',
        data: pollutionDataArr,
        style: { color: '#fff' },
        color: '#fff'
      }]
    };
    this.setState({
      tempHighChart: tempHighChart,
    })
  }
  newHighPollChart() {
    let pollutionDataArr = [];
    let chartLabels = [];
    let colorsLabels = [];
    let pollutionLabels = [];
    let dayWiseData = [];
    if (this.state.todayData && this.state.todayData.length) {
      this.state.todayData.map((pData, key) => {
        var day = new Date(pData.timestamp).getDate();
        // if (key > 10) {
        //   return
        // }
        let todayVal = this.getToday(new Date(pData.timestamp), "time");
        if (dayWiseData && dayWiseData[day]) {
          // console.log("main if", key)
          let dayData = dayWiseData[day];
          dayData['data'].push(pData.co2)
          dayWiseData.map((dData, key) => {

          })
        } else {
          // console.log("main else", key)
          let tempData = []
          tempData.data = [pData.co2]
          tempData.day = day
          tempData.timestamp = pData.timestamp
          tempData.name = pData.timestamp
          dayWiseData[day] = tempData
        }

        let tempPollData = {}
        let colorCode = "#27b35a"
        if (this.state.pollGraphType == "co2") {
          tempPollData.y = pData.co2
          tempPollData.timestamp = new Date(pData.timestamp)

          // pollutionDataArr.push(pData.co2);
          pollutionLabels.push(pData.pollution);
          chartLabels.push(todayVal);
          let pollValue = "Good";
          if (pData.co2 > 250 && pData.co2 <= 400) {
            colorCode = "#27b35a"
            pollValue = "Good";
          } else if (pData.co2 > 400 && pData.co2 <= 1000) {
            colorCode = "#27b329"
            pollValue = "Normal";
          } else if (pData.co2 > 1000 && pData.co2 <= 2000) {
            colorCode = "#b08c0a"
            pollValue = "Poor Air";
          } else if (pData.co2 > 2000 && pData.co2 <= 5000) {
            colorCode = "#b0120a"
            pollValue = "Air Quality Alert";
          } else if (pData.co2 > 5000) {
            colorCode = "#b0120a"
            pollValue = "Danger Level";
          }
          tempPollData.pollution = pollValue
          tempPollData.graphUnitType = "ppm"
          pollutionDataArr.push(tempPollData);
        } else {
          tempPollData.y = pData.tvoc
          // tempPollData.pollution = pData.pollution
          tempPollData.timestamp = new Date(pData.timestamp)
          let pollValue = "Good";
          // pollutionDataArr.push(pData.co2);
          // pollutionDataArr.push(tempPollData);
          pollutionLabels.push(pData.pollution);
          chartLabels.push(todayVal);
          if (pData.tvoc <= 5) {
            colorCode = "#27b35a"
            pollValue = "Good";
          } else if (pData.tvoc > 5 && pData.tvoc <= 50) {
            colorCode = "#27b35a"
            pollValue = "Normal";
          } else if (pData.tvoc > 50 && pData.tvoc <= 325) {
            colorCode = "#2cb327"
            pollValue = "Poor Air";
          } else if (pData.tvoc > 325 && pData.tvoc <= 500) {
            colorCode = "#9ab00a"
          } else {
            colorCode = "#b0120a"
            pollValue = "Danger Level";
          }
          tempPollData.pollution = pollValue
          tempPollData.graphUnitType = "ppb"
          pollutionDataArr.push(tempPollData);
        }
        colorsLabels.push(colorCode);
      })
      // console.log(colorsLabels)
    }

    let formatedDailyData = []
    dayWiseData.map(dailyData => {
      // formatedDailyData.push(dailyData)
      formatedDailyData = [...formatedDailyData, dailyData]
    })

    let highChartOption = {
      chart: {
        type: 'column',
        backgroundColor: '#ffffff1c',
        style: { color: '#fff' }
        // inverted: true,
        // zoom: "xy"
      },
      title: {
        text: 'Air Quality Graph',
        style: { color: '#fff' }
      },
      subtitle: {
        text: 'Day Wise Air Quality Graph',
        style: { color: '#fff' }
      },
      xAxis: {
        title: {
          text: 'Time',
          style: { color: '#fff' },
        },
        type: 'category',
        categories: chartLabels,
        labels: {
          formatter: function () {
            return chartLabels[this.pos]
          },
          style: {
            color: '#fff',
          }
        }
      },
      yAxis: {
        title: {
          text: 'Units',
          style: { color: '#fff' },
        },
        type: 'logarithmic',
        min: 1,
        labels: {
          overflow: 'justify',
          style: {
            color: '#fff',
          }
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          // console.log(this, this.point.low); // just to see , what data you can access
          let pollValue = this.point.pollution;
          let colorValue = this.point.color;
          let yValue = this.point.y;
          let nameValue = this.series.name;
          let keyValue = this.point.timestamp;
          let unitValue = this.point.graphUnitType;
          // return '<b>' + this.x +
          //   '</b>: <b>' + barValue + ' %</b>';
          return '<span style="font-size:10px">' + keyValue + '</span><table><tr><td style="padding:0">' +  "Measurement" + ': </td>' +
            '<td style="padding:0"><b>' + yValue + ' ' + unitValue + '</b></td></tr><tr><td style="color:' + colorValue + ';padding:0">' + pollValue + '</td></tr></table>'

        }
      },
      // tooltip: {
      //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y:.1f} unit</b></td><td>{series.pollutionLabels}</td></tr>',
      //   footerFormat: '</table>',
      //   shared: true,
      //   useHTML: true
      // },
      // colors: ['#b0120a', '#ffab91', '#ED5534', '#433C39', '#545150', '#B09187', '#B087A0'],
      colors: colorsLabels,
      pollutionLabels: pollutionLabels,
      plotOptions: {
        columnrange: {
          dataLabels: {
            // enabled: true,
            //  format: '{y}°C'
          },
          colorByPoint: true
        },
        series: {
          animation: false
        },
        column: {
          colorByPoint: true
        }
      },
      legend: {
        enabled: true,
        itemStyle: {
          color: 'fff'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Pollution',
        data: pollutionDataArr,
      }]
    };
    this.setState({
      highChartOption: highChartOption,
    })
  }
  async getAllData() {
    let apiUrl = "http://35.193.238.179:9090/api/pollution/data?page=0&size=" + this.state.allItems + "&sort=created,desc";
    let allData = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    this.setState({
      allData: allData
    }, () => this.allDataHighChart())
    console.log(allData)
  }
  allDataHighChart() {
    let pollutionDataArr = [];
    let chartLabels = [];
    let colorsLabels = [];
    let pollutionLabels = [];
    let dayWiseData = [];
    if (this.state.allData && this.state.allData.length) {
      this.state.allData.map((pData, key) => {
        var day = new Date(pData.timestamp).getDate();

        let todayVal = this.getToday(new Date(pData.timestamp));

        let allDataObj = [];

        if (pollutionDataArr && pollutionDataArr.length) {
          console.log("if all")
          pollutionDataArr = pollutionDataArr.filter(function (pollData, cKey) {
            let tmpData = pollData
            if (pollData.name == "CO2 (ppm)") {
              let tmpData = pollData.data;
              tmpData.push(pData.co2)
              tmpData.data = tmpData;
            }
            if (pollData.name == "tVOC (ppb)") {
              let tmpData = pollData.data;
              tmpData.push(pData.tvoc)
              tmpData.data = tmpData;
            }
            if (pollData.name == "Humidity (g.kg-1)") {
              let tmpData = pollData.data;
              tmpData.push(pData.humidity)
              tmpData.data = tmpData;
            }
            if (pollData.name == "Pressure (Pa)") {
              let tmpData = pollData.data;
              tmpData.push(pData.pressure)
              tmpData.data = tmpData;
            }
            if (pollData.name == "Temperature (°C)") {
              let tmpData = pollData.data;
              tmpData.push(pData.temperature)
              tmpData.data = tmpData;
            }
            return tmpData
          });
        } else {
          console.log("else all")
          let co2Data = {}
          co2Data.data = [pData.co2]
          co2Data.name = "CO2 (ppm)"
          co2Data.color = '#0066FF'
          co2Data.timestamp = new Date(pData.timestamp)

          let tVOCData = {}
          tVOCData.data = [pData.tvoc]
          tVOCData.name = "tVOC (ppb)"
          tVOCData.color = '#FF0000'
          tVOCData.timestamp = new Date(pData.timestamp)

          let humidityData = {}
          humidityData.data = [pData.humidity]
          humidityData.name = "Humidity (g.kg-1)"
          humidityData.color = '#0a7eb0'
          humidityData.timestamp = new Date(pData.timestamp)

          let pressureData = {}
          pressureData.data = [pData.pressure]
          pressureData.name = "Pressure (Pa)"
          pressureData.color = '#b00a60'
          pressureData.timestamp = new Date(pData.timestamp)

          let temperatureData = {}
          temperatureData.data = [pData.temperature]
          temperatureData.name = "Temperature (°C)"
          temperatureData.color = '#a20ab0'
          temperatureData.timestamp = new Date(pData.timestamp)

          // #b0120a', '#ffab91', '#ED5534', '#433C39', '#545150',

          pollutionDataArr.push(co2Data)
          pollutionDataArr.push(tVOCData)
          pollutionDataArr.push(humidityData)
          pollutionDataArr.push(pressureData)
          pollutionDataArr.push(temperatureData)
        }

        pollutionLabels.push(pData.pollution);
        chartLabels.push(todayVal);
      })
      // console.log(colorsLabels)
    }

    console.log(pollutionDataArr)

    let formatedDailyData = []
    dayWiseData.map(dailyData => {
      // formatedDailyData.push(dailyData)
      formatedDailyData = [...formatedDailyData, dailyData]
    })

    let allDataHighChart = {
      chart: {
        // type: 'spline',
        // inverted: true,
        // zoom: "xy"
        backgroundColor: '#ffffff1c',
        style: { color: '#fff' }
      },
      title: {
        text: 'Sequence Data',
        style: { color: '#fff' }
      },
      subtitle: {
        text: 'Day Wise Graph',
        style: { color: '#fff' }
      },
      xAxis: {
        accessibility: {
          rangeDescription: 'Measurement'
        },
        type: 'category',
        categories: chartLabels,
        labels: {
          overflow: 'justify',
          style: {
            color: '#fff',
          }
        }
      },
      yAxis: {
        title: {
          text: 'Units',
          style: { color: '#fff' }
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#fff',
          }
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          // console.log(this, this.point.low); // just to see , what data you can access
          let pollValue = this.point.pollution;
          let colorValue = this.point.color;
          let yValue = this.point.y;
          let nameValue = this.series.name;
          let keyValue = this.x;
          // return '<b>' + this.x +
          //   '</b>: <b>' + barValue + ' %</b>';
          return '<span style="color:' + colorValue + ';padding:0;font-size:10px">Measurement</span><br><span style="font-size:10px">' + keyValue + '</span><table><tr><td style="padding:0">' + nameValue + ': </td>' +
            '<td style="padding:0"><b>' + yValue + '</b></td></tr></table>'

        }
      },
      // tooltip: {
      //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //     '<td style="padding:0"><b>{point.y:.1f} unit</b></td><td>{series.pollutionLabels}</td></tr>',
      //   footerFormat: '</table>',
      //   shared: true,
      //   useHTML: true
      // },
      // colors: ['#b0120a', '#ffab91', '#ED5534', '#433C39', '#545150', '#B09187', '#B087A0'],
      colors: colorsLabels,
      pollutionLabels: pollutionLabels,
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
        },
        columnrange: {
          colorByPoint: true
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemStyle: {
          color: 'fff'
        }
      },
      column: {
        colorByPoint: true
      },
      credits: {
        enabled: false
      },
      // series: [{
      //   name: 'Measurement',
      //   data: pollutionDataArr,
      // }],
      series: pollutionDataArr,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
    this.setState({
      allDataHighChart: allDataHighChart,
    })
  }

  fetchData() {
  }

  handleGraphData() {
    let pollutionData = am4core.create("pollutionData", am4charts.XYChart);
    // chart.paddingRight = 20;
    pollutionData.paddingRight = this.props.paddingRight;

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

    pollutionData.data = data;

    let dateAxis = pollutionData.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = pollutionData.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = pollutionData.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    pollutionData.cursor = new am4charts.XYCursor();
    pollutionData.cursor.behavior = "none";
    pollutionData.seriesContainer.draggable = false;
    pollutionData.seriesContainer.resizable = false;

    pollutionData.seriesContainer.draggable = false;
    pollutionData.seriesContainer.resizable = false;

    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // pollutionData.scrollbarX = scrollbarX;
    // scrollbarX.interactionsEnabled = false;
    this.pollutionData = pollutionData;

  }
  handlePollutionGraphData() {
    // Create chart instance
    let pollutionDataLine = am4core.create("pollutionDataLine", am4charts.XYChart);
    pollutionDataLine.paddingRight = this.props.paddingRight;

    let pollutionDataArr = [];
    if (this.state.pollutionData && this.state.pollutionData.length) {
      this.state.pollutionData.map((pData, key) => {
        var day = new Date(pData.timestamp).getDate();
        pollutionDataArr.push({
          // date: "" + new Date(pData.timestamp),
          // name: "Pollution",
          // units: pData.co2,

          "country": "Day: " + (day),
          "litres": pData.co2,
          "units": pData.tvoc,
          "pollValue": pData.pollution,
          "measureDate": pData.timestamp,
        });
      })

      // let visits = 10;
      // for (let i = 1; i < 366; i++) {
      //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      //   data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      // }
    }

    pollutionDataLine.data = pollutionDataArr;

    // Create axes
    let categoryAxis = pollutionDataLine.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.title.text = "Countries";

    let valueAxis = pollutionDataLine.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Litres sold (M)";

    // Create series
    var series = pollutionDataLine.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "litres";
    series.dataFields.categoryX = "country";
    series.name = "Sales";
    series.pollValue = "pollValue";
    series.measureDate = "measureDate";
    series.columns.template.tooltipText = "Pollution Data\nPollution: {pollValue}\nDate: {measureDate}";
    series.columns.template.fill = am4core.color("#104547");

    var series2 = pollutionDataLine.series.push(new am4charts.LineSeries());
    series2.name = "Units";
    series2.stroke = am4core.color("#CDA2AB");
    series2.strokeWidth = 3;
    series2.dataFields.valueY = "units";
    series2.dataFields.categoryX = "country";

    this.pollutionDataLine = pollutionDataLine
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
    // if (this.chart.paddingRight !== this.props.paddingRight) {
    //   this.chart.paddingRight = this.props.paddingRight;
    // }

    console.log("outside")
    if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
      console.log("inside", this.props)
      let campaings = [];
      let userInfo = {};
      if (this.props.campaings) {
        let campaingsList = this.props.campaings;
        campaings = (campaingsList) ? campaingsList : [];
        if (this.pollutionData) {
          let data = [];
          campaings.map((pData, key) => {
            data.push({ date: new Date(pData.timestamp), name: "Pollution", value: pData.co2 });
          })
          this.pollutionData.data = data;
          this.pollutionData.paddingRight = this.props.paddingRight;
          // console.log("insout", this.props, campaings)
        }
      }
      this.setState({
        pollutionData: campaings,
        reduxLoadFlag: this.props.reduxLoadFlag,
      })
    }
  }
  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => this.getTodayData());
  };
  handleUserInputAll = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => this.getAllData());
  };
  handleStartDate = value => {
    let startDate = true;
    if (value == null || !this.dateUtility.isValid(value)) {
      startDate = false;
    }
    if (startDate) {
      this.setState({
        selectedDate: value,
      }, () => this.getTodayData())

    }
    this.setState(
      {
        startDate: value,
        startDateValid: startDate,
      }
    );
  };
  handleStartDateError(error, value) {
    this.setState({
      startDateValid: error || value == "" || value == null ? false : true
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
      highChartOption,
      tempHighChart,
      allDataHighChart,
      latestData,
    } = this.state;
    return (
      <div>
        {/* <NotificationContainer/> */}
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <Card className={`dash-tiles box ${latestData && latestData.pollColor ? latestData.pollColor : "light_green_color"}`}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success" className={"box-image-cover new-cover"} style={styletest}>
                  <img className="card_img" src={flatIcon} alt="logo" />
                </CardIcon>
                <p className={classes.cardCategory + " white-text current-air"}>Current Air Quality</p>
                <h3 className={classes.cardTitle + " white-text air-quality"}>{latestData && latestData.pollLevel ? latestData.pollLevel : "Normal"}</h3>
                <span className="full-width d-flex">
                  {/* <span className="pollution-value"><p>Max Air Quality:</p> {latestData && latestData.maxPollLevel ? latestData.maxPollLevel : "Normal"}</span> */}
                  <span className="tempratures"><p>Max Air Quality</p> {latestData && latestData.maxPollLevel ? latestData.maxPollLevel : "Normal"}</span>
                  <span className="tempratures"><p>Min Air Quality</p> {latestData && latestData.minPollLevel ? latestData.minPollLevel : "Normal"}</span>
                </span>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>TVOC Measurement</p> {latestData && latestData.pollution ? latestData.pollution.tvoc + " ppb" : "N/A"}</span>
                  <span className="tempratures"><p>CO2 Measurement</p> {latestData && latestData.pollution ? latestData.pollution.co2 + " ppm" : "N/A"}</span>
                </span>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats + " white-text"}>
                  <img
                    src={clock}
                    className={clock_cover + " white-text"}
                    style={clock_style}
                    alt="time"
                  />
                  <span className="white-text">{latestData.latestDataTime && latestData.latestDataTime}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Card className={"dash-tiles box temp_card_color box_card"}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="success" className={test1 + " new-cover"} style={styletest1}>
                  <img className="card_img" src={sunnycon} alt="logo" />
                </CardIcon>
                {/* <p className={classes.cardCategory}>Temperature</p> */}
                {/* <h3 className={classes.cardTitle}>{latestData && latestData.tempLevel ? latestData.tempLevel + " (" + latestData.pollution.temperature + " °C)" : "Normal"}</h3> */}
                <h3 className={classes.cardTitle}>{latestData && latestData.tempLevel ? latestData.pollution.temperature + " °C" : "Normal"}</h3>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>Maximun Temp:</p> {latestData && latestData.maxTempLevel ? latestData.max_temperature + " °C" : "Normal"}</span>
                  <span className="tempratures"><p>Minimum Temp:</p> {latestData && latestData.minTempLevel ? latestData.min_temperature + " °C" : "Normal"}</span>
                </span>
                <span className="full-width d-flex">
                  <span className="tempratures small"><p>Temperature:</p> {latestData && latestData.minTempLevel ? latestData.pollution.temperature + " °C" : "Normal"}</span>
                  <span className="tempratures small"><p>Humidity:</p> {latestData && latestData.pollution ? latestData.pollution.humidity + " g.kg-1" : "N/A"}</span>
                  <span className="tempratures small"><p>Pressure</p> {latestData && latestData.pollution ? latestData.pollution.pressure + " pa" : "N/A"}</span>
                </span>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <img
                    src={clock}
                    className={clock_cover}
                    style={clock_style}
                    alt="time"
                  />
                  <span className="white-text">{latestData.latestDataTime && latestData.latestDataTime}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>

        <span className="box-with-bg">
          <h3 className="heading">Day Wise Graph</h3>
          <GridContainer>
            <div className="dashTimePanel">
              <FormGroup>
                <TextField
                  label="Graph Type"
                  select
                  InputLabelProps={{ className: "required-label" }}
                  name="pollGraphType"
                  autoComplete="off"
                  // value={this.state.pollGraphType}
                  data-validators="isRequired,isAlpha"
                  // onChange={this.handleUserInput}
                  // variant="outlined"
                  variant="filled"
                  size="small"
                  margin="dense"
                  SelectProps={{
                    multiple: false,
                    value: this.state.pollGraphType,
                    onChange: this.handleUserInput
                  }}
                >
                  <MenuItem
                    value={"co2"}
                  >
                    CO2
                </MenuItem>
                  <MenuItem
                    value={"tvoc"}
                  >
                    tVoc
                </MenuItem>
                </TextField>
              </FormGroup>
              <FormGroup>
                <TextField
                  label="Records"
                  select
                  InputLabelProps={{ className: "required-label" }}
                  name="todayItems"
                  autoComplete="off"
                  // value={this.state.todayItems}
                  data-validators="isRequired,isAlpha"
                  // onChange={this.handleUserInput}
                  variant="filled"
                  size="small"
                  margin="dense"
                  SelectProps={{
                    multiple: false,
                    value: this.state.todayItems,
                    onChange: this.handleUserInput
                  }}
                >
                  <MenuItem
                    value={"2000"}
                  >
                    Today's All Record
                </MenuItem>
                  <MenuItem
                    value={"10"}
                  >
                    10
                </MenuItem>
                  <MenuItem
                    value={"20"}
                  >
                    20
                </MenuItem>
                  <MenuItem
                    value={"50"}
                  >
                    50
                </MenuItem>
                  <MenuItem
                    value={"100"}
                  >
                    100
                </MenuItem>
                  <MenuItem
                    value={"200"}
                  >
                    200
                </MenuItem>
                </TextField>
              </FormGroup>
              <FormControl >
                <MuiPickersUtilsProvider
                  inputVariant="standard"
                  utils={DateFnsUtils}
                >
                  <KeyboardDatePicker
                    inputVariant="standard"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    margin="normal"
                    className=""
                    id="start-date-picker-dialog"
                    InputLabelProps={{
                      className: "required-label"
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
                  />
                </MuiPickersUtilsProvider>
                <FormErrors
                  show={!this.state.startDateValid}
                  formErrors={this.state.formErrors}
                  fieldName="startDate"
                />
              </FormControl>
            </div>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6}>
              <HighchartsReact
                highcharts={Highcharts}
                options={highChartOption}
                className="chart-css"
                style={{ width: "100%", height: "500px" }}
                containerProps={{ style: { height: "500px" } }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <HighchartsReact
                highcharts={Highcharts}
                options={tempHighChart}
                className="chart-css"
                style={{ width: "100%", height: "500px" }}
                containerProps={{ style: { height: "500px" } }}
              />
            </GridItem>
          </GridContainer>
        </span>
        <span className="box-with-bg">
          <h3 className="heading">Heading</h3>
          <GridContainer>
            <div className="dashTimePanel dashTimePanel2">
              <FormGroup>
                <TextField
                  label="Records"
                  select
                  InputLabelProps={{ className: "required-label" }}
                  name="allItems"
                  autoComplete="off"
                  // value={this.state.allItems}
                  data-validators="isRequired,isAlpha"
                  // onChange={this.handleUserInput}
                  variant="filled"
                  size="small"
                  margin="dense"
                  SelectProps={{
                    multiple: false,
                    value: this.state.allItems,
                    onChange: this.handleUserInputAll
                  }}
                >
                  <MenuItem
                    value={"2000"}
                  >
                    All Record
                </MenuItem>
                  <MenuItem
                    value={"100"}
                  >
                    100
                </MenuItem>
                  <MenuItem
                    value={"200"}
                  >
                    200
                </MenuItem>
                  <MenuItem
                    value={"500"}
                  >
                    500
                </MenuItem>
                  <MenuItem
                    value={"1000"}
                  >
                    1000
                </MenuItem>
                  <MenuItem
                    value={"10000"}
                  >
                    10000
                </MenuItem>
                </TextField>
              </FormGroup>
            </div>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12}>
              <HighchartsReact
                highcharts={Highcharts}
                options={allDataHighChart}
                className="chart-css"
                style={{ width: "100%", height: "500px" }}
                containerProps={{ style: { height: "500px" } }}
              />
            </GridItem>
          </GridContainer>
        </span>
        {/* <div id="pollutionData" style={{ width: "100%", height: "500px" }}></div> */}
        <span className="googlemap">
          <GridContainer>
            <GridItem xs={12}>
              <div style={{ height: '30vh', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyCcjnBZDQ0QfVA8D6jiXSiQWtvJ9sk56fA" }}
                  defaultCenter={this.state.center}
                  defaultZoom={this.state.zoom}
                >
                  <MapMarker
                    lat={this.state.center.lat}
                    lng={this.state.center.lng}
                    text="Server"
                  />
                </GoogleMapReact>
              </div>
            </GridItem>
          </GridContainer>
        </span>
      </div>
    );
  }
}

DashboardClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Dashboard = connect(
  mapStateToProps, mapDispatchToProps
)(DashboardClass);

// export default Form;
export default withStyles(dashboardStyle)(Dashboard);