import React, { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.jsx";
import RTLNavbarLinks from "./RTLNavbarLinks.jsx";

import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";

function Header({ ...props }) {
  useEffect(() => {}, [props]);
  function makeBrand() {
    var name;
    props.routes.map(prop => {
      if (
        window.location.href.indexOf(prop.path) !== -1 &&
        prop.path.length > 1
      ) {
        name = prop.name;
      }
      return null;
    });
    return name;
  }
  const { classes, color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  const tbStyle = {
    backgroundColor: "#0F111D",
    // color: "#fff"
    //position: "fixed"
  };

  return (
    <AppBar className={classes.appBar + appBarClasses} style={tbStyle}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <p style={{ color: "white" }} className={classes.title}>
            <b>{makeBrand()}</b>
          </p>
        </div>
        <Hidden smDown implementation="css">
          {props.rtlActive ? (
            <RTLNavbarLinks />
          ) : (
            <AdminNavbarLinks
              userDetail={props.userDetail}
              updateUserInfo={props.updateUserInfo}
              saveDataToLocalStorage={props.saveDataToLocalStorage}
              localStorageData={props.localStorageData}
              sendAdnetworkData = {props.sendAdnetworkData}
            />
          )}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
  userDetail: PropTypes.object,
  updateUserInfo: PropTypes.func,
  saveDataToLocalStorage: PropTypes.func,
  localStorageData: PropTypes.object,
  sendAdnetworkData: PropTypes.func,
};

export default withStyles(headerStyle)(Header);
