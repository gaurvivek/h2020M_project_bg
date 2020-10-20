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
import { Link } from "react-router-dom";
import { baseRoutes, basePath } from "base-routes";
import { layout } from "admin-routes";
import { userService } from "_services/user.service";
import { DEFAULT_PROFILE_IMG, NO_USERNAME } from "__helpers/constants";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer.jsx";
import { STORED_ADNETWORK } from "__helpers/constants";
import { SELECTED_ADNETWORK } from "__helpers/constants";
import { STORED_ADVERTISEMENT } from "__helpers/constants";
import dropdown from "assets/img/dropdown.png";
import { STORED_CAMPAIGN_ANALYTICS } from "__helpers/constants";
import { STORED_ADVERTISEMENT_ANALYTICS } from "__helpers/constants";
import { STORED_ASSETS_ANALYTICS } from "__helpers/constants";
import { SELECTED_CAMPAIGN } from "__helpers/constants";
import AdnetworkSelect from "components/Sidebar/AdnetworkSelect";
import { connect } from "react-redux";

// let profileImage;
// let username;

// function fillUserDetail() {}
const mapStateToProps = state => {
  // console.log("StateVal "+JSON.stringify(state));
  return {
    userInfo: state.userInfo,
    articles: state.articles,
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
class AdminNavbarLinksClass extends React.Component {
  constructor(props) {
    super(props);
    let adNetworksData = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
    let selectedAdnetworkData = JSON.parse(localStorage.getItem(SELECTED_ADNETWORK));
    let selectedAdnetwork = (selectedAdnetworkData) ? selectedAdnetworkData.adNetworkId : "";
    this._isMounted = false;
    let spinner = document.getElementById('loadingSpinner');
    // if (spinner && !spinner.hasAttribute('hidden')) {
    //   spinner.setAttribute('hidden', 'true');
    // }
    this.state = {
      openNotifcation: false,
      openProfile: false,
      // userDetail: props.userDetail,
      // profileImage: props.userDetail
      //   ? props.userDetail.profileImage
      //   : DEFAULT_PROFILE_IMG,
      // username: props.userDetail ? props.userDetail.username : NO_USERNAME,
      userDetail: {},
      profileImage: DEFAULT_PROFILE_IMG,
      username: NO_USERNAME,
      adnetworkId: selectedAdnetwork ? selectedAdnetwork : "",
      adNetworkJson: (adNetworksData) ? adNetworksData : [],
      adnetworkData: (selectedAdnetworkData) ? selectedAdnetworkData : [],
      loadSpinner: false,
      spinner: spinner,
      loading: false,
      reduxLoadFlag: false,

    };
    this.handleToggleProfile = this.handleToggleProfile.bind(this);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
    Object.getPrototypeOf(this).constructor.STATE = this.state;
  }
  // componentDidUpdate(){
  //   if(this.state.loadSpinner){
  //     this.state.spinner.removeAttribute('hidden', 'true');
  //   }else{
  //     // this.state.spinner.setAttribute('hidden', 'true');
  //   }
  // }
  componentDidUpdate() {
    if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
      let userInfo = {};
      let selectedAdnetwork = "";
      let adnetworkData = [];
      let selectedAdnetworkData = {};
      if (this.props.userInfo) {
        userInfo = this.props.userInfo;
      }
      if (this.props.adNetwork) {
        selectedAdnetworkData = this.props.adNetwork;
        selectedAdnetwork = (selectedAdnetworkData) ? selectedAdnetworkData.adNetworkId : "";
        adnetworkData = (selectedAdnetworkData) ? selectedAdnetworkData : [];
      }
      this.setState({
        reduxLoadFlag: this.props.reduxLoadFlag,
        userDetail: userInfo,
        profileImage: userInfo
          ? userInfo.imageRef
          : DEFAULT_PROFILE_IMG,
        username: userInfo ? userInfo.fName+" "+userInfo.lName : NO_USERNAME,
        adnetworkId: selectedAdnetwork ? selectedAdnetwork : "",
        adNetworkJson: (adnetworkData) ? adnetworkData : [],
      })
    }
  }
  componentDidMount() {
    this._isMounted = true;
    if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
      let userInfo = {};
      let selectedAdnetwork = "";
      let adnetworkData = [];
      let selectedAdnetworkData = {};
      if (this.props.userInfo) {
        userInfo = this.props.userInfo;
      }
      if (this.props.adNetwork) {
        selectedAdnetworkData = this.props.adNetwork;
        selectedAdnetwork = (selectedAdnetworkData) ? selectedAdnetworkData.adNetworkId : "";
        adnetworkData = (selectedAdnetworkData) ? selectedAdnetworkData : [];
      }
      this.setState({
        reduxLoadFlag: this.props.reduxLoadFlag,
        userDetail: userInfo,
        profileImage: userInfo
          ? userInfo.imageRef
          : DEFAULT_PROFILE_IMG,
        username: userInfo ? userInfo.fName+" "+userInfo.lName : NO_USERNAME,
        adnetworkId: selectedAdnetwork ? selectedAdnetwork : "",
        adNetworkJson: (adnetworkData) ? adnetworkData : [],
      })
    }
    // userService.getAll().then(users => {
    //   if (typeof users === "object" && users.fName) {
    //     // const last = users.length;
    //     // users = users[last - 1];
    //     const profileImage = users.imageRef
    //       ? users.imageRef
    //       : DEFAULT_PROFILE_IMG;
    //     const username = users.fName
    //       ? `${users.fName} ${users.lName}`
    //       : NO_USERNAME;
    //     let userDetail = {
    //       profileImage: profileImage,
    //       username: username
    //     };
    //     this._isMounted && this.setState(
    //       {
    //         userDetail: userDetail,
    //         profileImage: userDetail.profileImage,
    //         username: username
    //       },
    //       () => {
    //         this.props.updateUserInfo(userDetail);
    //       }
    //     );
    //   }
    // });
    // this.fetchData();
    
    // if (spinner) {
    //   spinner.setAttribute('hidden', 'true');
    // }
  }
  async fetchData() {
    let adNetworks = [];
    try {
      // adNetworks = await userService.fetchAdNetwork();
      adNetworks = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
      this._isMounted &&
          this.setState({
            adNetworkJson: adNetworks,
          });
    } catch (errors) {
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // if (
    //   nextProps.userDetail &&
    //   ((nextProps.userDetail.username !== prevState.username &&
    //     nextProps.userDetail.username !== NO_USERNAME) ||
    //     (nextProps.userDetail.profileImage !== prevState.profileImage &&
    //       nextProps.userDetail.profileImage !== DEFAULT_PROFILE_IMG))
    // ) {
    //   return {
    //     username: nextProps.userDetail.username,
    //     profileImage: nextProps.userDetail.profileImage
    //   };
    // } else return null;
    return null;
  }

  handleToggleNotification = () => {
    this._isMounted && this.setState(state => ({
      openNotifcation: !state.openNotifcation
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
  handleToggleProfile = () => {
  
    // this.props.history.push(basePath + baseRoutes.profile.path);
    this.setState(state => ({ openProfile: !state.openProfile }));
  };
  handleCloseProfile = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    this.setState({ openProfile: false });
  };

  handleLogout = () => {
    userService.logout();
    return true;

    // this.setState(state => ({ openProfile: !state.openProfile }));
  };
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
      <div className="mobileMenuSidebar">
        {/* <div className={classes.manager + " menuSelectList"} >
            <AdnetworkSelect style={{zIndex: "99999"}} updateUserInfo={this.props.updateUserInfo} />
        </div> */}
        <div className={classes.manager + " profile-box"}>
          <Link
            href={basePath + baseRoutes.dashboard.path} ///${user.username}
            to={basePath + baseRoutes.dashboard.path} ///${user.username}
            style={userNameStyle}
          >
            Challenging Wonders
          </Link>
          <Link
            href={basePath + baseRoutes.dashboard.path} ///${user.username}
            to={basePath + baseRoutes.dashboard.path} ///${user.username}
          >
            <Button
              buttonRef={node => {
                this.anchorProfile = node;
              }}
              color={window.innerWidth > 959 ? "transparent" : "white"}
              justIcon={window.innerWidth > 959}
              simple={!(window.innerWidth > 959)}
              aria-owns={openNotifcation ? "profile-menu-list-grow" : null}
              aria-haspopup="true"
              onClick={this.handleToggleProfile}
              className={classes.buttonLink + " profile-img-button"}
            >
              {" "}
              <span>
                <Avatar
                  alt=""
                  src={this.state.profileImage}
                  className={user_image}
                  style={styleuser}
                />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

AdminNavbarLinksClass.propTypes = {
  classes: PropTypes.object,
  updateUserInfo: PropTypes.func,
};
const AdminNavbarLinks = connect(
  mapStateToProps
)(AdminNavbarLinksClass);
export default withStyles(headerLinksStyle)(AdminNavbarLinks);