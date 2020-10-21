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
import { STORED_ADNETWORK, DATA_LOADING } from "__helpers/constants";
import { SELECTED_ADNETWORK } from "__helpers/constants";
import { STORED_ADVERTISEMENT } from "__helpers/constants";
import dropdown from "assets/img/dropdown.png";
import { STORED_CAMPAIGN_ANALYTICS } from "__helpers/constants";
import { STORED_ADVERTISEMENT_ANALYTICS } from "__helpers/constants";
import { STORED_ASSETS_ANALYTICS } from "__helpers/constants";
import { SELECTED_CAMPAIGN } from "__helpers/constants";
import { FETCH_CATEGORIES, FETCH_AD_STATUS, FETCH_AD_MEDIUM, FETCH_AD_TYPE, FETCH_ASSET_TYPE, FETCH_ASSET_DISPLAY_TYPE, FETCH_CAMPAIGN_STATUS } from "__helpers/constants";
import { FETCH_BRANDS } from "__helpers/constants";
import { withRouter } from 'react-router'

import { connect } from "react-redux";
import {
  addUSerUInfo,
  addAdNetwork,
  addCategories,
  addAdStatus,
  addAdMedium,
  adAdType,
  addAssetDisplayType,
  addAssetType,
  addCampaignStatus,
  addCampaigns,
  addAdvertisements,
  addAssets,
  addVendors,
  addTimeStamp,
  addBrands,
  reduxLoad,
  addAdNetworkList,
} from "../../js/actions/index";
import { ANALYTICS_CSV_DATA } from "__helpers/constants";
import { ANALYTICS_CSV_ADVERTISEMENT_DATA } from "__helpers/constants";

function mapDispatchToProps(dispatch) {
  return {
    addUSerUInfo: addUSerUInfoVal => dispatch(addUSerUInfo(addUSerUInfoVal)),
    addAdNetwork: addAdNetworkVal => dispatch(addAdNetwork(addAdNetworkVal)),
    addAdNetworkList: addAdNetworkListVal => dispatch(addAdNetworkList(addAdNetworkListVal)),
    addCategories: addCategoriesVal => dispatch(addCategories(addCategoriesVal)),
    addBrands: addBrandsVal => dispatch(addBrands(addBrandsVal)),
    addAdStatus: addAdStatusVal => dispatch(addAdStatus(addAdStatusVal)),
    addAdMedium: addAdMediumVal => dispatch(addAdMedium(addAdMediumVal)),
    adAdType: adAdTypeVal => dispatch(adAdType(adAdTypeVal)),
    addAssetDisplayType: addAssetDisplayTypeVal => dispatch(addAssetDisplayType(addAssetDisplayTypeVal)),
    addAssetType: addAssetTypeVal => dispatch(addAssetType(addAssetTypeVal)),
    addCampaignStatus: addCampaignStatusVal => dispatch(addCampaignStatus(addCampaignStatusVal)),
    addCampaigns: addCampaignsVal => dispatch(addCampaigns(addCampaignsVal)),
    addAdvertisements: addAdvertisementsVal => dispatch(addAdvertisements(addAdvertisementsVal)),
    addAssets: addAssetsVal => dispatch(addAssets(addAssetsVal)),
    addVendors: addVendorsVal => dispatch(addVendors(addVendorsVal)),
    addTimeStamp: addTimeStampVal => dispatch(addTimeStamp(addTimeStampVal)),
    reduxLoad: reduxLoadVal => dispatch(reduxLoad(reduxLoadVal)),
  };
}
const mapStateToProps = state => {
  // console.log("StateVal "+JSON.stringify(state));
  return {
    userInfo: state.userInfo,
    articles: state.articles,
    userInfo: state.userInfo,
    adNetwork: state.adNetwork,
    loadingFlag: state.loadingFlag,
    adCategories: state.adCategories,
    adBrands: state.adBrands,
    adStatus: state.adStatus,
    adMedium: state.adMedium,
    adType: state.adType,
    assetType: state.assetType,
    assetDisplayType: state.assetDisplayType,
    campaignStatus: state.campaignStatus,
    advertisements: state.advertisements,
    campaings: state.campaings,
    assets: state.assets,
    vendors: state.vendors,
    timestamp: state.timestamp,
    reduxLoadFlag: state.reduxLoadFlag,
  };
};
class AdnetworkSelectFn extends React.Component {
  constructor(props) {
    super(props);
    let adNetworksData = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
    let selectedAdnetworkData = JSON.parse(localStorage.getItem(SELECTED_ADNETWORK));
    let selectedAdnetwork = (selectedAdnetworkData) ? selectedAdnetworkData.adNetworkId : "";
    this._isMounted = false;
    let spinner = document.getElementById('loadingSpinner');
    this.state = {
      openNotifcation: false,
      adnetworkId: selectedAdnetwork ? selectedAdnetwork : "",
      adNetworkJson: (adNetworksData) ? adNetworksData : [],
      adnetworkData: (selectedAdnetworkData) ? selectedAdnetworkData : [],
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
    this.props.reduxLoad(false);
    let apiUrl = "http://35.193.238.179:9090/api/pollution/data";
    let pollutionData = userService.fetchGlobalApisWithoutAuth(apiUrl);
    if (pollutionData && pollutionData.length) {
      this.props.addCampaigns(pollutionData);
      this.props.reduxLoad(false);
    } else {
      let tempData = [
        {
          "pollution": "normal",
          "co2": 548,
          "created_at": "2020-10-19T21:18:16.119000000Z",
          "timestamp": "2020-10-19 21:18:15",
          "tvoc": 22
        },
        {
          "pollution": "normal",
          "co2": 553,
          "created_at": "2020-10-19T21:18:15.860000000Z",
          "timestamp": "2020-10-19 21:18:13",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 565,
          "created_at": "2020-10-19T21:18:13.488000000Z",
          "timestamp": "2020-10-19 21:18:11",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 574,
          "created_at": "2020-10-19T21:18:09.352000000Z",
          "timestamp": "2020-10-19 21:18:08",
          "tvoc": 26
        },
        {
          "pollution": "normal",
          "co2": 574,
          "created_at": "2020-10-19T21:18:07.460000000Z",
          "timestamp": "2020-10-19 21:18:06",
          "tvoc": 26
        },
        {
          "pollution": "normal",
          "co2": 730,
          "created_at": "2020-10-19T21:18:05.659000000Z",
          "timestamp": "2020-10-19 21:18:04",
          "tvoc": 50
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:18:02.059000000Z",
          "timestamp": "2020-10-19 21:18:01",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:43.550000000Z",
          "timestamp": "2020-10-19 21:17:43",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:41.459000000Z",
          "timestamp": "2020-10-19 21:17:41",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:38.961000000Z",
          "timestamp": "2020-10-19 21:17:38",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:17:36.659000000Z",
          "timestamp": "2020-10-19 21:17:36",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:34.685000000Z",
          "timestamp": "2020-10-19 21:17:34",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:31.961000000Z",
          "timestamp": "2020-10-19 21:17:31",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:29.602000000Z",
          "timestamp": "2020-10-19 21:17:29",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:27.351000000Z",
          "timestamp": "2020-10-19 21:17:27",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:17:25.162000000Z",
          "timestamp": "2020-10-19 21:17:24",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 407,
          "created_at": "2020-10-19T21:17:22.960000000Z",
          "timestamp": "2020-10-19 21:17:22",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 407,
          "created_at": "2020-10-19T21:17:20.759000000Z",
          "timestamp": "2020-10-19 21:17:20",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 407,
          "created_at": "2020-10-19T21:17:18.060000000Z",
          "timestamp": "2020-10-19 21:17:17",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 411,
          "created_at": "2020-10-19T21:17:15.561000000Z",
          "timestamp": "2020-10-19 21:17:15",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:17:13.287000000Z",
          "timestamp": "2020-10-19 21:17:13",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:17:11.165000000Z",
          "timestamp": "2020-10-19 21:17:10",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:17:08.668000000Z",
          "timestamp": "2020-10-19 21:17:08",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:17:06.460000000Z",
          "timestamp": "2020-10-19 21:17:06",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:17:04.161000000Z",
          "timestamp": "2020-10-19 21:17:03",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:17:02.359000000Z",
          "timestamp": "2020-10-19 21:17:01",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:59.720000000Z",
          "timestamp": "2020-10-19 21:16:59",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:57.462000000Z",
          "timestamp": "2020-10-19 21:16:56",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:55.199000000Z",
          "timestamp": "2020-10-19 21:16:54",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:52.962000000Z",
          "timestamp": "2020-10-19 21:16:52",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:50.060000000Z",
          "timestamp": "2020-10-19 21:16:49",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T21:16:47.762000000Z",
          "timestamp": "2020-10-19 21:16:47",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:45.561000000Z",
          "timestamp": "2020-10-19 21:16:45",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:43.161000000Z",
          "timestamp": "2020-10-19 21:16:42",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:41.124000000Z",
          "timestamp": "2020-10-19 21:16:40",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:16:38.716000000Z",
          "timestamp": "2020-10-19 21:16:38",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:36.164000000Z",
          "timestamp": "2020-10-19 21:16:35",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:34.261000000Z",
          "timestamp": "2020-10-19 21:16:33",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:31.860000000Z",
          "timestamp": "2020-10-19 21:16:31",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:29.559000000Z",
          "timestamp": "2020-10-19 21:16:28",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:27.475000000Z",
          "timestamp": "2020-10-19 21:16:24",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:27.074000000Z",
          "timestamp": "2020-10-19 21:16:26",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:22.755000000Z",
          "timestamp": "2020-10-19 21:16:21",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:21.160000000Z",
          "timestamp": "2020-10-19 21:16:19",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:16:18.060000000Z",
          "timestamp": "2020-10-19 21:16:17",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 572,
          "created_at": "2020-10-19T21:14:07.960000000Z",
          "timestamp": "2020-10-19 21:14:07",
          "tvoc": 26
        },
        {
          "pollution": "normal",
          "co2": 660,
          "created_at": "2020-10-19T21:13:17.560000000Z",
          "timestamp": "2020-10-19 21:13:16",
          "tvoc": 39
        },
        {
          "pollution": "normal",
          "co2": 421,
          "created_at": "2020-10-19T21:12:27.460000000Z",
          "timestamp": "2020-10-19 21:12:26",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 425,
          "created_at": "2020-10-19T21:11:36.760000000Z",
          "timestamp": "2020-10-19 21:11:36",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 421,
          "created_at": "2020-10-19T21:10:46.360000000Z",
          "timestamp": "2020-10-19 21:10:45",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 409,
          "created_at": "2020-10-19T21:09:56.198000000Z",
          "timestamp": "2020-10-19 21:09:55",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 414,
          "created_at": "2020-10-19T21:09:05.858000000Z",
          "timestamp": "2020-10-19 21:09:05",
          "tvoc": 2
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:08:16.262000000Z",
          "timestamp": "2020-10-19 21:08:14",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:06:57.459000000Z",
          "timestamp": "2020-10-19 21:06:57",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T21:06:52.460000000Z",
          "timestamp": "2020-10-19 21:06:51",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:06:46.959000000Z",
          "timestamp": "2020-10-19 21:06:46",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:06:41.556000000Z",
          "timestamp": "2020-10-19 21:06:41",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:06:36.358000000Z",
          "timestamp": "2020-10-19 21:06:35",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T21:06:30.860000000Z",
          "timestamp": "2020-10-19 21:06:30",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T21:06:25.543000000Z",
          "timestamp": "2020-10-19 21:06:25",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 592,
          "created_at": "2020-10-19T21:05:40.348000000Z",
          "timestamp": "2020-10-19 21:05:38",
          "tvoc": 29
        },
        {
          "pollution": "normal",
          "co2": 572,
          "created_at": "2020-10-19T21:05:23.961000000Z",
          "timestamp": "2020-10-19 21:05:23",
          "tvoc": 26
        },
        {
          "pollution": "normal",
          "co2": 570,
          "created_at": "2020-10-19T21:05:09.060000000Z",
          "timestamp": "2020-10-19 21:05:08",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 565,
          "created_at": "2020-10-19T21:04:53.203000000Z",
          "timestamp": "2020-10-19 21:04:52",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 545,
          "created_at": "2020-10-19T21:04:38.560000000Z",
          "timestamp": "2020-10-19 21:04:37",
          "tvoc": 22
        },
        {
          "pollution": "normal",
          "co2": 551,
          "created_at": "2020-10-19T21:04:23.284000000Z",
          "timestamp": "2020-10-19 21:04:22",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 561,
          "created_at": "2020-10-19T21:04:08.159000000Z",
          "timestamp": "2020-10-19 21:04:06",
          "tvoc": 24
        },
        {
          "pollution": "normal",
          "co2": 553,
          "created_at": "2020-10-19T21:03:52.661000000Z",
          "timestamp": "2020-10-19 21:03:51",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 561,
          "created_at": "2020-10-19T21:03:36.956000000Z",
          "timestamp": "2020-10-19 21:03:36",
          "tvoc": 24
        },
        {
          "pollution": "normal",
          "co2": 565,
          "created_at": "2020-10-19T21:03:22.362000000Z",
          "timestamp": "2020-10-19 21:03:20",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 556,
          "created_at": "2020-10-19T21:03:05.680000000Z",
          "timestamp": "2020-10-19 21:03:05",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 556,
          "created_at": "2020-10-19T21:02:50.411000000Z",
          "timestamp": "2020-10-19 21:02:49",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 556,
          "created_at": "2020-10-19T21:02:35.390000000Z",
          "timestamp": "2020-10-19 21:02:34",
          "tvoc": 23
        },
        {
          "pollution": "normal",
          "co2": 561,
          "created_at": "2020-10-19T21:02:20.435000000Z",
          "timestamp": "2020-10-19 21:02:19",
          "tvoc": 24
        },
        {
          "pollution": "normal",
          "co2": 567,
          "created_at": "2020-10-19T21:02:12.927000000Z",
          "timestamp": "2020-10-19 21:02:04",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 567,
          "created_at": "2020-10-19T21:01:49.460000000Z",
          "timestamp": "2020-10-19 21:01:48",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 580,
          "created_at": "2020-10-19T21:01:34.028000000Z",
          "timestamp": "2020-10-19 21:01:33",
          "tvoc": 27
        },
        {
          "pollution": "normal",
          "co2": 617,
          "created_at": "2020-10-19T21:01:18.761000000Z",
          "timestamp": "2020-10-19 21:01:17",
          "tvoc": 33
        },
        {
          "pollution": "normal",
          "co2": 638,
          "created_at": "2020-10-19T21:01:05.261000000Z",
          "timestamp": "2020-10-19 21:01:02",
          "tvoc": 36
        },
        {
          "pollution": "normal",
          "co2": 569,
          "created_at": "2020-10-19T21:00:48.560000000Z",
          "timestamp": "2020-10-19 21:00:47",
          "tvoc": 25
        },
        {
          "pollution": "normal",
          "co2": 589,
          "created_at": "2020-10-19T21:00:32.660000000Z",
          "timestamp": "2020-10-19 21:00:31",
          "tvoc": 28
        },
        {
          "pollution": "normal",
          "co2": 486,
          "created_at": "2020-10-19T21:00:17.326000000Z",
          "timestamp": "2020-10-19 21:00:16",
          "tvoc": 13
        },
        {
          "pollution": "normal",
          "co2": 470,
          "created_at": "2020-10-19T21:00:01.860000000Z",
          "timestamp": "2020-10-19 21:00:01",
          "tvoc": 10
        },
        {
          "pollution": "normal",
          "co2": 463,
          "created_at": "2020-10-19T20:59:50.060000000Z",
          "timestamp": "2020-10-19 20:59:45",
          "tvoc": 9
        },
        {
          "pollution": "normal",
          "co2": 460,
          "created_at": "2020-10-19T20:59:31.647000000Z",
          "timestamp": "2020-10-19 20:59:30",
          "tvoc": 9
        },
        {
          "pollution": "normal",
          "co2": 455,
          "created_at": "2020-10-19T20:59:18.645000000Z",
          "timestamp": "2020-10-19 20:59:15",
          "tvoc": 8
        },
        {
          "pollution": "normal",
          "co2": 455,
          "created_at": "2020-10-19T20:59:00.887000000Z",
          "timestamp": "2020-10-19 20:58:59",
          "tvoc": 8
        },
        {
          "pollution": "normal",
          "co2": 446,
          "created_at": "2020-10-19T20:58:44.758000000Z",
          "timestamp": "2020-10-19 20:58:44",
          "tvoc": 7
        },
        {
          "pollution": "normal",
          "co2": 441,
          "created_at": "2020-10-19T20:58:29.362000000Z",
          "timestamp": "2020-10-19 20:58:29",
          "tvoc": 6
        },
        {
          "pollution": "normal",
          "co2": 446,
          "created_at": "2020-10-19T20:58:14.162000000Z",
          "timestamp": "2020-10-19 20:58:13",
          "tvoc": 7
        },
        {
          "pollution": "normal",
          "co2": 442,
          "created_at": "2020-10-19T20:57:59.462000000Z",
          "timestamp": "2020-10-19 20:57:58",
          "tvoc": 6
        },
        {
          "pollution": "normal",
          "co2": 438,
          "created_at": "2020-10-19T20:57:43.659000000Z",
          "timestamp": "2020-10-19 20:57:42",
          "tvoc": 5
        },
        {
          "pollution": "normal",
          "co2": 432,
          "created_at": "2020-10-19T20:57:28.581000000Z",
          "timestamp": "2020-10-19 20:57:27",
          "tvoc": 4
        },
        {
          "pollution": "normal",
          "co2": 427,
          "created_at": "2020-10-19T20:57:13.660000000Z",
          "timestamp": "2020-10-19 20:57:12",
          "tvoc": 4
        },
        {
          "pollution": "normal",
          "co2": 425,
          "created_at": "2020-10-19T20:56:57.411000000Z",
          "timestamp": "2020-10-19 20:56:56",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 416,
          "created_at": "2020-10-19T20:56:44.249000000Z",
          "timestamp": "2020-10-19 20:56:41",
          "tvoc": 2
        },
        {
          "pollution": "normal",
          "co2": 416,
          "created_at": "2020-10-19T20:56:27.862000000Z",
          "timestamp": "2020-10-19 20:56:26",
          "tvoc": 2
        },
        {
          "pollution": "normal",
          "co2": 421,
          "created_at": "2020-10-19T20:56:12.973000000Z",
          "timestamp": "2020-10-19 20:56:10",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 417,
          "created_at": "2020-10-19T20:55:55.761000000Z",
          "timestamp": "2020-10-19 20:55:55",
          "tvoc": 2
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T20:55:40.861000000Z",
          "timestamp": "2020-10-19 20:55:40",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-19T20:55:26.460000000Z",
          "timestamp": "2020-10-19 20:55:24",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 413,
          "created_at": "2020-10-19T20:55:11Z",
          "timestamp": "2020-10-19 20:55:09",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T20:54:54.761000000Z",
          "timestamp": "2020-10-19 20:54:54",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-19T20:54:39.461000000Z",
          "timestamp": "2020-10-19 20:54:38",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:54:23.861000000Z",
          "timestamp": "2020-10-19 20:54:23",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T20:54:08.504000000Z",
          "timestamp": "2020-10-19 20:54:08",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 405,
          "created_at": "2020-10-19T20:53:53.061000000Z",
          "timestamp": "2020-10-19 20:53:52",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:53:37.960000000Z",
          "timestamp": "2020-10-19 20:53:37",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:53:00.162000000Z",
          "timestamp": "2020-10-19 20:52:59",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:52:44.960000000Z",
          "timestamp": "2020-10-19 20:52:44",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:52:30.560000000Z",
          "timestamp": "2020-10-19 20:52:29",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:52:14.361000000Z",
          "timestamp": "2020-10-19 20:52:13",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:52:00.896000000Z",
          "timestamp": "2020-10-19 20:51:58",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:51:43.402000000Z",
          "timestamp": "2020-10-19 20:51:42",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:51:29.514000000Z",
          "timestamp": "2020-10-19 20:51:27",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:51:12.660000000Z",
          "timestamp": "2020-10-19 20:51:12",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:50:57.462000000Z",
          "timestamp": "2020-10-19 20:50:56",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:50:42.180000000Z",
          "timestamp": "2020-10-19 20:50:41",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:50:26.861000000Z",
          "timestamp": "2020-10-19 20:50:26",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-19T20:50:12.761000000Z",
          "timestamp": "2020-10-19 20:50:10",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:29:30.984000000Z",
          "timestamp": "2020-10-14 16:29:30",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 421,
          "created_at": "2020-10-14T16:29:15.962000000Z",
          "timestamp": "2020-10-14 16:29:15",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:29:00.895000000Z",
          "timestamp": "2020-10-14 16:29:00",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:28:45.860000000Z",
          "timestamp": "2020-10-14 16:28:45",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:28:30.860000000Z",
          "timestamp": "2020-10-14 16:28:30",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:28:15.860000000Z",
          "timestamp": "2020-10-14 16:28:15",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:28:02.122000000Z",
          "timestamp": "2020-10-14 16:28:00",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:27:45.997000000Z",
          "timestamp": "2020-10-14 16:27:45",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 481,
          "created_at": "2020-10-14T16:27:31.860000000Z",
          "timestamp": "2020-10-14 16:27:30",
          "tvoc": 12
        },
        {
          "pollution": "normal",
          "co2": 400,
          "created_at": "2020-10-14T16:27:17.261000000Z",
          "timestamp": "2020-10-14 16:27:15",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 425,
          "created_at": "2020-10-13T18:54:41.760000000Z",
          "timestamp": "2020-10-13 18:54:41",
          "tvoc": 3
        },
        {
          "pollution": "normal",
          "co2": 436,
          "created_at": "2020-10-13T18:54:26.682000000Z",
          "timestamp": "2020-10-13 18:54:26",
          "tvoc": 5
        },
        {
          "pollution": "normal",
          "co2": 436,
          "created_at": "2020-10-13T18:54:11.660000000Z",
          "timestamp": "2020-10-13 18:54:11",
          "tvoc": 5
        },
        {
          "pollution": "normal",
          "co2": 448,
          "created_at": "2020-10-13T18:53:56.659000000Z",
          "timestamp": "2020-10-13 18:53:56",
          "tvoc": 7
        },
        {
          "pollution": "normal",
          "co2": 457,
          "created_at": "2020-10-13T18:53:41.259000000Z",
          "timestamp": "2020-10-13 18:53:41",
          "tvoc": 8
        },
        {
          "pollution": "normal",
          "co2": 444,
          "created_at": "2020-10-13T18:53:26.259000000Z",
          "timestamp": "2020-10-13 18:53:26",
          "tvoc": 6
        },
        {
          "pollution": "normal",
          "co2": 444,
          "created_at": "2020-10-13T18:53:11.324000000Z",
          "timestamp": "2020-10-13 18:53:11",
          "tvoc": 6
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-13T18:52:57.712000000Z",
          "timestamp": "2020-10-13 18:52:55",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 408,
          "created_at": "2020-10-13T18:52:41.161000000Z",
          "timestamp": "2020-10-13 18:52:40",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 411,
          "created_at": "2020-10-13T18:52:26.075000000Z",
          "timestamp": "2020-10-13 18:52:25",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 411,
          "created_at": "2020-10-13T18:52:11.061000000Z",
          "timestamp": "2020-10-13 18:52:10",
          "tvoc": 1
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-13T18:51:56.661000000Z",
          "timestamp": "2020-10-13 18:51:55",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-13T18:51:41.297000000Z",
          "timestamp": "2020-10-13 18:51:40",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-13T18:51:26.254000000Z",
          "timestamp": "2020-10-13 18:51:25",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 403,
          "created_at": "2020-10-13T18:51:11.382000000Z",
          "timestamp": "2020-10-13 18:51:10",
          "tvoc": 0
        },
        {
          "pollution": "normal",
          "co2": 3,
          "created_at": "2020-10-13T18:21:01.053000000Z",
          "timestamp": "2020-10-13 18:21:00",
          "tvoc": 430
        },
        {
          "pollution": "normal",
          "co2": 63,
          "created_at": "2020-10-13T18:20:32.549000000Z",
          "timestamp": "2020-10-13 18:20:30",
          "tvoc": 400
        },
        {
          "pollution": "normal",
          "co2": 63,
          "created_at": "2020-10-13T18:20:27.841000000Z",
          "timestamp": "2020-10-13 18:20:24",
          "tvoc": 400
        },
        {
          "pollution": "normal",
          "co2": 63,
          "created_at": "2020-10-13T18:20:15.460000000Z",
          "timestamp": "2020-10-13 18:20:14",
          "tvoc": 400
        }
      ]
      this.props.addCampaigns(pollutionData = tempData);
      this.props.reduxLoad(false);
    }
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
