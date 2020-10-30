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
// @material-ui/icons
import DashboardIcons from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import FeaturedPlayListIcon from "@material-ui/icons/FeaturedPlayList";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import WorkIcon from "@material-ui/icons/Work";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
// import TrendingUpIcon from "@material-ui/icons/TrendingUp";

// core components/views for Admin layout
import Dashboard from "views/Dashboard/Dashboard.jsx";
import Records from "views/Records/Records";
import Setting from "views/Setting/Setting";
// import Profile from "views/Profile/Profile.jsx";
// import UserProfile from "views/UserProfile/UserProfile.jsx";
// import TableList from "views/TableList/TableList.jsx";
// import Analytics from "views/Analytics/Analytics.jsx";
// import Login from "components/Login/Login";
// core components/views for RTL layout
import { basePath, baseRoutes } from "base-routes";

// const basePath = "/ab/asg";

const dashboardRoutes = [
  {
    path: baseRoutes.dashboard.useLink,
    name: "Dashboard",
    icon: DashboardIcons,
    component: Dashboard,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  {
    path: baseRoutes.records.useLink,
    name: "Weather Records",
    icon: PermContactCalendarIcon,
    component: Records,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  {
    path: baseRoutes.setting.useLink,
    name: "Settings",
    icon: PermContactCalendarIcon,
    component: Setting,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  // {
  //   path: baseRoutes.profile.path,
  //   name: baseRoutes.profile.pathName,
  //   icon: PermContactCalendarIcon,
  //   component: Profile,
  //   layout: "/admin",
  //   basePath: basePath,
  //   showInSideBar: false
  // },
  {
    path: "/",
    name: "Dashboard",
    icon: DashboardIcons,
    component: Dashboard,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: false
  }
];
// console.log(dashboardRoutes);
// debugger ;
export default dashboardRoutes;
