/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.jsx";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.jsx";

import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
import baseRoutes from "base-routes";
import { Link } from "react-router-dom";
import { basePath } from "base-routes";
import AdnetworkSelect from "./AdnetworkSelect";
import { Button } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import dropdown from "assets/img/dropdown.png";
import { useSelector, useDispatch } from "react-redux";


const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  const [rotationVal, setRotationVal] = React.useState(180);
// const [showMenu, setShowMenu] = React.useState(selectedAdnetwork ? true : false);
  const [showMenu, setShowMenu] = React.useState(true);

  // console.log(showMenu);
  let activeRouteName = [];
  function activeRoute(routeName) {
    // if (routeName == baseRoutes.dashboard || routeName == baseRoutes.admin) {
    // }
    return window.location.pathname.indexOf(routeName) > -1 ? true : false;
    // return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { classes, routes, logoText, color, logo, image } = props;
  const { cusSidebar } = "cus-sidebar";
  function openDropDown() {
    showMenu ? setRotationVal(180) : setRotationVal(0);
    // showMenu ? setShowMenu(false) : setShowMenu(true);
  }
  const spinStyle = ({color: "#fff !important", verticalAlign: "middle", height: 20, width: 20, transform: `rotate(${rotationVal}deg)`}); 
  var linksMenu = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({
            [" " + classes[color]]: true
          });
        } else {
          listItemClasses = classNames({
            [" " + classes[color] + " cusSelected"]: activeRoute(
              prop.basePath + /* prop.layout + */ prop.path
            )
          });
        }

        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(
            prop.basePath + /* prop.layout + */ prop.path
          )
        } + ' sidebarLeftNavLink');
        if (prop.showInSideBar == true && (prop.name == "Ad Networks")) {
          activeRouteName.push(activeRoute(
            prop.basePath + /* prop.layout + */ prop.path
          )
            ? prop.name
            : "");
          return (
            <NavLink
              to={prop.basePath + /* prop.layout + */ prop.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  />
                )}
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive
                  })}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        }
      })}
    </List>
  );
  var links = (
    // <List className={classes.list} style={{backgroundColor: "#EDEDED", marginRight: 18, marginLeft: 18, marginTop: 3}}>
    <List className={classes.list + " Sidebar-list-14"} style={{marginRight: 18, marginLeft: 18, marginTop: 3}}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({
            [" " + classes[color]]: true
          });
        } else {
          listItemClasses = classNames({
            [" " + classes[color] + " cusSelected"]: activeRoute(
              prop.basePath + /* prop.layout + */ prop.path
            )
          });
        }

        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(
            prop.basePath + /* prop.layout + */ prop.path
          )
        } + ' sidebarLeftNavLink');
        if (prop.showInSideBar == true && (prop.name != "Ad Networks")) {
          activeRouteName.push(activeRoute(
            prop.basePath + /* prop.layout + */ prop.path
          )
            ? prop.name
            : "");
          return (
            <NavLink
              to={prop.basePath + /* prop.layout + */ prop.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses} style={{margin: 0}}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  />
                )}
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive
                  })}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        }
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo + " Sidebar-logo"}>
      <Link
        //href="https://www.creative-tim.com?ref=mdr-sidebar"
        // href={"http://localhost:3000/admin/dashboard"}
        to={baseRoutes.dashboard.path}
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive
        }) + " Sidebar-logoLink"}
      >
        <div className={classes.logoImage + ' Sidebar-logoImage'}>
          <img src={logo} alt="logo" className={classes.img} />
          {/* <p className={classes.img}>Challenging Wonders</p> */}
        </div>
        {logoText}
      </Link>
    </div>
  );
  activeRouteName = activeRouteName.filter(val => val !== "");
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          side="right"
          anchor={props.rtlActive ? "left" : "left"}
          open={props.open}
          classes={{
            paper:
              classNames({
                [classes.drawerPaperRTL]: props.rtlActive
              }) + " sidebar-cover"
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          // style={{left: "0px",right:"auto !important"}}
        >
          {/* {brand} */}
          <div className={classes.sidebarWrapper + ' Sidebar-sidebarWrapper'}>
            {brand}
            {/* <AdnetworkSelect style={{zIndex: "99999"}} updateUserInfo={props.updateUserInfo} /> */}
            {/* {links} */}
            {linksMenu}
            <NavLink
              className={classes.item+ " active"}
              activeClassName="active"
              to="#"
              onClick={() => openDropDown()}
              // style={{margin: 10, textAlign: "left"}}
              >
              <ListItem button className={classes.itemLink + " cusSelected setPadding"}>
                {/* <SettingsIcon
                  className={classNames(classes.itemIcon, 'sidebarLeftNavLink')}
                  style={{color: "#fff !important"}}
                />
                <ListItemText
                  primary="AdNetwork Services"
                  className={classNames(classes.itemText, 'sidebarLeftNavLink')}
                  disableTypography={true}
                  style={{display: 'inline-block', alignSelf: 'top'}}
                />
                 <ExpandMoreIcon
                    className={classNames(classes.itemText, 'sidebarLeftNavLink')}
                    style={{color: "#fff !important", verticalAlign: "middle", height: 20, width: 20}}
                    />  */}
                    <AdnetworkSelect style={{zIndex: "99999"}} updateUserInfo={props.updateUserInfo} />
              </ListItem>
            </NavLink>
            <span style={{backgroundColor: "#000"}}>
              {links}
            </span>
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
            
          </div>
          {image !== undefined ? (
            <div className={classes.background + " " + cusSidebar + ' themeBgChange'} />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper:
              classNames(classes.drawerPaper, {
                [classes.drawerPaperRTL]: props.rtlActive
              }) + " sidebar-cover"
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper + ' Sidebar-sidebarWrapper newsidebar'}>
            {/* <NavLink
                className={classes.item+ " active"}
                activeClassName="active"
                to="#"
                >
              <ListItem button className={classes.itemLink + " cusSelectedBtn"}>
                <AdnetworkSelect style={{zIndex: "99999"}} updateUserInfo={props.updateUserInfo} />
              </ListItem>
            </NavLink> */}
            {linksMenu}
            <NavLink
              className={classes.item+ " active"}
              activeClassName="active"
              to="#"
              // onClick={() => openDropDown()}
              // style={{margin: 10, textAlign: "left"}}
              >
              <ListItem button className={classes.itemLink + " cusSelected setPadding"}>
                {/* <SettingsIcon
                  className={classNames(classes.itemIcon, 'sidebarLeftNavLink')}
                  style={{color: "#fff !important"}}
                /> */}
                <AdnetworkSelect style={{zIndex: "99999"}} updateUserInfo={props.updateUserInfo} />
                 {/* <ExpandMoreIcon
                    className={classNames(classes.itemText, 'sidebarLeftNavLink')}
                    style={spinStyle}
                    />  */}
              </ListItem>
            </NavLink>
            <span style={{backgroundColor: "#000"}}>
              {links}
            </span>
          </div>
          {image !== undefined ? (
            <div className={classes.background + " " + cusSidebar + ' themeBgChange'} />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  userDetail: PropTypes.object,
  updateUserInfo: PropTypes.func,
  saveDataToLocalStorage: PropTypes.func,
  localStorageData: PropTypes.object,
  sendAdnetworkData: PropTypes.func,
  // style
};

export default withStyles(sidebarStyle)(Sidebar);