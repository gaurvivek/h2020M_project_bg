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
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Navbar from "components/Navbars/Navbar.jsx";

import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "admin-routes.js";
import { projectAssets } from "base-routes.js";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
// import projectAssets from ""
// import image from "assets/img/sidebar-2.jpg";
// import baseRoutes from "base-routes";
import { DEFAULT_PROFILE_IMG, NO_USERNAME } from "__helpers/constants";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import { SELECTED_ADNETWORK } from "__helpers/constants";
import { userService } from "_services/user.service";
import moment from "moment";

let ps;
// const switchRoutes = (
//   <Switch>
//     {/* {routes.map((prop, key) => {
//       if (prop.layout === "/admin") {
//         return (
//           <Route
//             path={prop.basePath + prop.layout + prop.path}
//             component={prop.component}
//             key={key}
//           />
//         );
//       }
//       return null;
//     })} */}
//     {routes.map((prop, key) => {
//       return (
//         <Route path={prop.basePath /* + prop.layout  */ + prop.path} key={key}>
//           <prop.component />
//         </Route>
//       );
//     })}
//     {<Redirect from="/admin" to="/admin/dashboard" />}
//   </Switch>
// );

// const Context = React.createContext();
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.sendAdnetworkData = this.sendAdnetworkData.bind(this);
    this.saveDataToLocalStorage = this.saveDataToLocalStorage.bind(this);

    let userDetail = JSON.parse(localStorage.getItem("userDetail"));
    let selectedAdnetwork = JSON.parse(localStorage.getItem(SELECTED_ADNETWORK));
    let profileImage = DEFAULT_PROFILE_IMG;
    if (userDetail && userDetail.imageRef) {
      profileImage = userDetail.imageRef;
    }
    let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
    var dateTimeVal = new Date(+tokenTimeStamp);
    var validDateBoolean = moment(dateTimeVal);
    if (!validDateBoolean.isValid()) {
      userService.logout();
    }
    let username =
      userDetail && userDetail.firstName
        ? `${userDetail.firstName} ${userDetail.lastName}`
        : NO_USERNAME;

    this.state = {
      userDetail: {
        profileImage: profileImage,
        username: username
      },
      selectedAdnetwork: (selectedAdnetwork) ? selectedAdnetwork : [],
      localStorageData: {},
      hasError: "",
      error: "",
      errorInfo: "",
      time: {},
      seconds: 1500,
      tokenTimeStamp: tokenTimeStamp,
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }
  state = {
    image: projectAssets.blur_image,
    color: "blue",
    hasImage: true,
    fixedClasses: "dropdown show",
    mobileOpen: false,
    loggedIn: false
  };

  adminRoutes = {};
  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
  saveDataToLocalStorage = storageName => {
  };
  updateUserInfo = userDetail => {
    let username = NO_USERNAME;
    let profileImage = DEFAULT_PROFILE_IMG;
    if (!userDetail) {
      const userDetail = JSON.parse(localStorage.getItem("userDetail"));
      username =
        userDetail && userDetail.firstName
          ? `${userDetail.firstName} ${userDetail.lastName}`
          : NO_USERNAME;
      if (userDetail.imageRef) {
        profileImage = userDetail.imageRef;
      }
    } else {
      if (userDetail && userDetail.profileImage) {
        profileImage = userDetail.profileImage;
      }

      username =
        userDetail && userDetail.firstName
          ? `${userDetail.firstName} ${userDetail.lastName}`
          : NO_USERNAME;
    }
    // this.setState({
    //   profileImage: userDetail.imageRef
    // });
    // console.log(userDetail);
    this.setState({
      userDetail: {
        profileImage: profileImage,
        username: username
      }
    });
  };
  sendAdnetworkData = selectedAdnetwork => {
    console.log(selectedAdnetwork);
  }

  mainPanel = React.createRef();
  handleImageClick = image => {
    this._isMounted && this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this._isMounted && this.setState({ fixedClasses: "dropdown show" });
    } else {
      this._isMounted && this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return window.location.pathname !== "/admin/maps";
  }
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };
  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
    console.log(this.state.time, this.state.seconds);
  }
  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    // Check if we're at zero.
    let currentTimeStamp = new Date().getTime();
    // console.log(currentTimeStamp - this.state.tokenTimeStamp);
    if ((currentTimeStamp - this.state.tokenTimeStamp) > 1700000) {
      // console.log("TokenExpired...");
      // userService.logout();
      clearInterval(this.timer);
      // window.location.reload(true);
    }
    if (seconds == 0) {
      clearInterval(this.timer);
    }
    // console.log(this.state.time, this.state.seconds);
  }
  componentDidMount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps = new PerfectScrollbar(this.mainPanel.current);
    // }
    window.addEventListener("resize", this.resizeFunction);
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();
  }

  componentDidCatch(error, errorInfo) {
    this._isMounted && this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      if (this.mainPanel && this.mainPanel.current) {
        this.mainPanel.current.scrollTop = 0;
      }
      if (this.state.mobileOpen) {
        this._isMounted && this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy();
    // }
    window.removeEventListener("resize", this.resizeFunction);
    Object.getPrototypeOf(this).constructor.STATE = this.state;
  }
  // shouldComponentUpdate(nextProps, nextState){

  //   return true;
  // }
  render() {
    const { classes, match, ...rest } = this.props;
    const {
      mobileOpen,
      color,
      userDetail,
      hasError,
      localStorageData,
      selectedAdnetwork
    } = this.state;
    return (
      <div
        className={classes.wrapper + " here"}
        style={{ backgroundColor: "rgb(239, 235, 235)" }}
      >
        <div className="display-none storage-observation">no change</div>
        {/* <ReactNotification /> */}
        <Sidebar
          routes={routes}
          logoText={projectAssets.brandShortName}
          logo={projectAssets.logo}
          style={{ backgroundColor: "#2d4e80" }}
          image={projectAssets.blur_image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={mobileOpen}
          color={color}
          updateUserInfo={this.updateUserInfo}
          saveDataToLocalStorage={this.saveDataToLocalStorage}
          localStorageData={localStorageData}
          userDetail={userDetail}
          selectedAdnetwork={selectedAdnetwork}
          sendAdnetworkData={this.sendAdnetworkData}
          {...rest}
        />
        <div className={classes.mainPanel} ref={this.mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={this.handleDrawerToggle}
            updateUserInfo={this.updateUserInfo}
            userDetail={userDetail}
            sendAdnetworkData={this.sendAdnetworkData}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() && !hasError ? (
            <div className={classes.content}>
              <div className={classes.container}>
                {" "}
                {
                  /* updateUserInfo={this.updateUserInfo} */
                  // switchRoutes
                  <Switch>
                    {routes.map((prop, key) => {
                      return (
                        <Route
                          path={prop.basePath /* + prop.layout  */ + prop.path}
                          key={key}
                          render={props => (
                            <prop.component
                              {...props}
                              updateUserInfo={this.updateUserInfo}
                              key={this.props.location.key}
                            />
                          )}
                        ></Route>
                      );
                    })}
                    {<Redirect from="/admin" to="/admin/dashboard" />}
                  </Switch>
                }
              </div>
            </div>
          ) : (
              "Error During" // <div className={classes.map}>{switchRoutes}</div>
            )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  userDetail: PropTypes.object
};

export default withStyles(dashboardStyle)(Dashboard);
