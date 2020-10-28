/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/* 
==========================================================
* In this class Ad-Network selection and all api's related to adnetwork services are used
* Redux data setup and data fetching is also handling.
==========================================================
*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import Poppers from "@material-ui/core/Popper";
import {
  Icon,
  styles,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  ClickAwayListener,
  Hidden,
  Divider,
  withStyles,
  Avatar,
  Select,
  FormGroup,
  InputLabel,
  FormControl,
  Input,
  CircularProgress
} from "@material-ui/core/";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import SelectAllTwoTone from "@material-ui/icons/SelectAllTwoTone";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import dummy from "assets/img/dummy.png";
import { sizeHeight } from "@material-ui/system";
import { Link, useHistory } from "react-router-dom";
import { baseRoutes, basePath } from "base-routes";
import { layout } from "admin-routes";
import { userService } from "_services/user.service";
import { DEFAULT_PROFILE_IMG, NO_USERNAME } from "__helpers/constants";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer.jsx";
import dropdown from "assets/img/dropdown.png";
import { withRouter } from 'react-router'

import { connect } from "react-redux";
import {
  addUSerUInfo,
  reduxLoad,
  addTimeStamp,

  countryList,
  globalLists,
} from "../../js/actions/index";
import { ANALYTICS_CSV_DATA } from "__helpers/constants";
import { ANALYTICS_CSV_ADVERTISEMENT_DATA } from "__helpers/constants";

function mapDispatchToProps(dispatch) {
  return {
    addUSerUInfo: addUSerUInfoVal => dispatch(addUSerUInfo(addUSerUInfoVal)),
    countryList: countryListVal => dispatch(countryList(countryListVal)),
    globalLists: globalListsVal => dispatch(globalLists(globalListsVal)),
    addTimeStamp: addTimeStampVal => dispatch(addTimeStamp(addTimeStampVal)),
    reduxLoad: reduxLoadVal => dispatch(reduxLoad(reduxLoadVal)),
  };
}
const mapStateToProps = state => {
  // console.log("StateVal "+JSON.stringify(state));
  return {
    userInfo: state.userInfo,
    loadingFlag: state.loadingFlag,
    timestamp: state.timestamp,
    reduxLoadFlag: state.reduxLoadFlag,
    globalLists: state.globalLists,
  };
};
class AdnetworkSelectFn extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    let spinner = document.getElementById('loadingSpinner');
    this.state = {
      openNotifcation: false,
      
      loadSpinner: false,
      spinner: spinner,
      loading: false,

      articles: [],
      userInfo: [],
      adNetwork: [],
      loadingFlag: false,
      adCategories: [],
      adBrands: [],
      adStatus: [],
      adMedium: [],
      adType: [],
      assetType: [],
      assetDisplayType: [],
      campaignStatus: [],
      advertisements: [],
      campaings: [],
      assets: [],
      vendors: [],
      timestamp: "",
      reduxLoadFlag: false,
    };
    this.fetchData = this.fetchData.bind(this)
  }
  componentDidMount() {
    this.state.spinner.setAttribute('hidden', 'true');
    this.fetchData();
  }
  async fetchData() {
    // alert("mm")
    this.props.reduxLoad(true);
    let globalLists = {};
    let apiUrl = "http://35.193.238.179:9090/api/pollution/data";
    let pollutionData = await userService.fetchGlobalApisWithoutAuth(apiUrl);
    globalLists.pollutionData = pollutionData;

    this.props.globalLists(globalLists);
    console.log(pollutionData)
    setTimeout(function () {
      this.props.reduxLoad(true);
      // this.state.spinner.setAttribute('hidden', 'true');
      // localStorage.setItem(DATA_LOADING, true);
    }.bind(this), 500);
  }
  handleToggleNotification = () => {
    this._isMounted && this.setState(state => ({
      openNotifcation: !state.openNotifcation,
      reduxLoadFlag: false,
    }));
  };
  handleCloseNotification = event => {
    if (this.anchorNotification.contains(event.target)) {
      return;
    }
    this.setState({ openNotifcation: false });
  };
  handleSelectAdnetwork(eventId) {
  }
  render() {
    const { classes } = this.props;
    const { openNotifcation, openProfile, adnetworkId, adnetworkData, adNetworkJson } = this.state;
    const user_image = "user-image";
    const styleuser = {
      borderRadius: "50%",
      width: "35px",
      height: "35px"
    };
    const userNameStyle = {
      float: "right",
      display: "block",
      width: "calc(100% - 50px)",
      color: "#000",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "normal",
      marginTop: "10px"
    };
    const logoutStyle = {
      float: "right",
      display: "block",
      width: "calc(100% - 50px)",
      color: "#2b73cd",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "normal",
      marginTop: "4px"
    };
    return (
      <div className="addNetworkBtnCover">
      </div>
    );
  }
}

AdnetworkSelectFn.propTypes = {
  classes: PropTypes.object
};

const AdnetworkSelect = connect(
  mapStateToProps, mapDispatchToProps
)(AdnetworkSelectFn);
export default withStyles(headerLinksStyle)(AdnetworkSelect);
