import React from "react";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

var notificationID = null;
export const Notification = ({ config }, notificationID) => {
  // types of notification
  // success
  // danger
  // info
  // default
  // warning
  let type = ["success", "danger", "info", "default", "warning"];
  if (
    config !== undefined &&
    config.title !== undefined &&
    config.message !== undefined &&
    config.type !== undefined
  ) {
    // if (type.includes(config.type))
    // {
    //   console.log(type.includes(config.type), config);
    console.log(notificationID);
    store.removeNotification(notificationID);

    notificationID = store.addNotification({
      title: config.title,
      message: config.message,
      type: config.type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      showIcon: true,
      dismiss: {
        duration: 5000000,
        onScreen: true
      }
    });
    console.log(notificationID);
    return ""; //<ReactNotification />;
  }

  return "";
};
