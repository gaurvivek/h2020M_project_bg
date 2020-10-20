/*!

This File contain all route that will use in ./src/index.js & in navigations
*/
import blur_image from "assets/img/darkgr.png";
import logo from "assets/img/asglogo.png";

// export const basePath = "/ab/asg";
export const basePath = "";

export const baseRoutes = {
  login: {
    path: `${basePath}/login`,
    pathName: "Login"
  },
  admin: {
    path: "/",
    pathName: ""
  },
  dashboard: {
    path: `${basePath}/dashboard`,
    pathName: "Dashboard",
    useLink: `/dashboard`
  },
  records: {
    path: `${basePath}/records`,
    pathName: "Records",
    useLink: `/records`
  },
  profile: {
    path: "/profile",
    pathName: "Profile"
  },
};

export const projectAssets = {
  blur_image: blur_image,
  brandShortName: "H2020",
  logo: logo
};

export default baseRoutes;
