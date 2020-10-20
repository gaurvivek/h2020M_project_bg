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
  }
  componentDidMount() {
    this.state.spinner.setAttribute('hidden', 'true');
  }
  async fetchData() {
    let adNetworks = [];
    try {
      // adNetworks = await userService.fetchAdNetwork();
      adNetworks = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
      if (adNetworks[0] && this.state.adnetworkId == "") {
        this.props.addAdNetworkList(adNetworks);
        localStorage.setItem(DATA_LOADING, true);
        this.adNetworkChange(adNetworks[0]["adNetworkId"])
      } else {
        localStorage.setItem(DATA_LOADING, false);
      }
      this._isMounted &&
        this.setState({
          adNetworkJson: adNetworks,
        });
    } catch (errors) {
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
