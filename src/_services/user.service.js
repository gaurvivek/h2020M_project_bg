/* In All function we will call token refersh api ,
in case of token authrization, we will store timestamp on all api call excep logout,
then comapare this timestamp agains the token life time variable*/

// import config from 'config';
import { authHeader, reauthorizeTokenHeader } from "__helpers/auth-header";
import { apiPath } from "api";
import { store } from "react-notifications-component";
import sortJsonArray from "sort-json-array";
import enMsg from "__helpers/locale/en/en";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {
  NotificationOptions,
  FORBIDDEN_STATUS,
  INVALID_DATA_POST,
  NO_DATA_FOUND,
  SECURITY_ERROR,
  SECURITY_ERROR_CODE,
  REDUX_STATE_DATA
} from "__helpers/constants";

import { clientTokenHeader } from "__helpers/auth-header";
import { DATA_LOADING } from "__helpers/constants";
import { OK_SUCCESS_STATUS } from "__helpers/constants";
import { v4 as uuidv4 } from 'uuid';

export const userService = {
  login,
  logout,
  fetchGlobalApisWithoutAuth,
  showNotification,
};

var originalSetItem = localStorage.setItem;

localStorage.setItem = function(key, value) {
  var event = new Event("itemInserted");

  event.value = value; // Optional..
  event.key = key; // Optional..

  document.dispatchEvent(event);

  originalSetItem.apply(this, arguments);
};

var localStorageSetHandler = function(e) {  
  // if(document.querySelector(".storage-observation"))
  //   document.querySelector(".storage-observation").textContent = e.value;
};

document.addEventListener("itemInserted", localStorageSetHandler, false);
async function fetchGlobalApisWithoutAuth(apiUrl) {
  let showNotification = {};
  let apiResponse = [];
  try {
      const response = await fetch(apiUrl, {
              method: "GET",
              headers: clientTokenHeader()
          })
          .then(response => {
              console.log(response)
              if (response.status === SECURITY_ERROR || response.status === FORBIDDEN_STATUS) {
                  showNotification = {
                      title: enMsg.sessionExpireTitle,
                      message: enMsg.sessionExpire,
                      type: "warning"
                  };
                  setTimeout(function() {
                      // logout();
                      // window.location.reload(true);
                  }, 1000);
                  // return Promise.reject("");
              } else if (response.status === INVALID_DATA_POST) {
                  showNotification = {
                      title: enMsg.connectionFailed,
                      message: enMsg.networkFailedError,
                      type: "danger"
                  };
              } else if (response.ok) {
                  return response.json();
              } else {
                  showNotification = {
                      title: enMsg.connectionFailed,
                      message: enMsg.networkFailedError,
                      type: "danger"
                  };
              }
              return response.json();
          })
          .then(data => {
              if (data.errorCode === SECURITY_ERROR) {
                  setTimeout(function() {
                      logout();
                      window.location.reload(true);
                  }, 2000);
                  return Promise.reject("");
              }
              apiResponse = data;
              return apiResponse;
          })
          .catch(error => {
              console.log(error)
              showNotification = {
                  title: enMsg.connectionFailed,
                  message: enMsg.networkFailedError,
                  type: "danger"
              };
          });
  } catch (error) {
      console.log(error)
      showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
      };
  }
  // createNotification(showNotification);
  return apiResponse;
}
function login(username, password) {
  console.log("countForCall3");
  const data = {
    username: username,
    password: password,
    grantType: "password",
    scope: "user"
  };
  // const requestOptions = {
  //   method: "POST",
  //   headers: clientTokenHeader(),
  //   // headers: { Accept: "application/json", "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  //   // body: JSON.stringify({ username, password })
  // };
  // return fetch(`${apiPath.login}`, requestOptions)
  try {
    const response = fetch(`${apiPath.login}`, {
      method: "POST",
      headers: clientTokenHeader(),
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.status === 400) {
        showNotification = {
          title: enMsg.loginFailedTitle,
          message: enMsg.inValidCredentials,
          type: "danger"
        };
        logout();
      } else if (response.ok) {
        let accessToken = response.headers.get("Authorization");
        if (accessToken !== undefined) {
          let userData = window.btoa(data.username + ":" + data.password);
          let user = {
            authdata: window.btoa(userData),
            accessToken: accessToken
          };
          localStorage.setItem("user", JSON.stringify(user));
          window.location.reload(true);
          return;
        }
      } else {
        showNotification = {
          title: enMsg.loginFailedTitle,
          message: enMsg.inValidCredentials,
          type: "danger"
        };
        let error = new Error(response.statusText);
        logout();
      }
      return response.text();
    })
    .then(response => {
      return true;
    }).catch(error => {
      showNotification = {
        title: enMsg.loginFailedTitle,
        message: enMsg.networkFailedError,
        type: "danger"
      };
      logout();
      return response;
    });
  } catch (error) {
    logout();
    showNotification = {
      title: enMsg.loginFailedTitle,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

    // .then(handleResponse)
    // .then(userDataResp => {
    //   // login successful if there's a user in the response
    //   if (userDataResp) {
    //     // store user details and basic auth credentials in local storage
    //     // to keep user logged in between page refreshes
    //     let userData = window.btoa(username + ":" + password);
    //     user.authdata = window.btoa(userData);
    //     localStorage.setItem("user", JSON.stringify(user));

    //     let userData = window.btoa(data.username + ":" + data.password);
    //     // userData = window.btoa(userData);
    //     let user = {
    //       authdata: window.btoa(userData),
    //       accessToken: accessToken
    //     };
    //   }
    //   return user;
    // });
}
const createNotifications = showNotification => {
  if (
    showNotification !== undefined &&
    showNotification.title !== undefined &&
    showNotification.message !== undefined &&
    showNotification.type !== undefined
  ) {
    let notificationID = store.removeNotification();
    // console.log(notificationID);
    // if (notificationID == undefined) {
    let notifiaciton = {
      // id: new Date().getTime() + Math.random(9999),
      title: showNotification.title,
      message: showNotification.message,
      type: showNotification.type
    };
    notifiaciton = Object.assign(NotificationOptions, notifiaciton);
    notificationID = store.addNotification(notifiaciton);
    // }
  }
  return;
};
const createNotification = showNotification => {
  if (
    showNotification !== undefined &&
    showNotification.title !== undefined &&
    showNotification.message !== undefined &&
    showNotification.type !== undefined
  ) {
    let notificationID = store.removeNotification();
    let notifiaciton = {
      title: showNotification.title,
      message: showNotification.message,
      type: showNotification.type
    };
    switch (notifiaciton.type) {
      case 'info':
        NotificationManager.info(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'success':
        NotificationManager.success(notifiaciton.message, notifiaciton.title, 1900);
        break;
      case 'warning':
        NotificationManager.warning(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'danger':
        NotificationManager.error(notifiaciton.message, notifiaciton.title, 2500);
        break;
    }
  }
  return;
};
function logout(data) {
  // return;
  // remove user from local storage to log user out
  let keysToRemove = [
    "user",
    "userDetail",
    "clientAuthToken",
    "tokenTimeStamp",
    "tokenTimeStamp",
    "clientAuthToken",
    "selectedReferral",
    DATA_LOADING,
    REDUX_STATE_DATA,

  ];

  for (let key of keysToRemove) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
  // setTimeout(function() {
  //   window.location.reload(true);
  // }, 2000);
  // localStorage.clear();
}
function showNotification(showNotification){
  if (
    showNotification !== undefined &&
    showNotification.title !== undefined &&
    showNotification.message !== undefined &&
    showNotification.type !== undefined
  ) {
    let notificationID = store.removeNotification();
    let notifiaciton = {
      title: showNotification.title,
      message: showNotification.message,
      type: showNotification.type
    };
    switch (notifiaciton.type) {
      case 'info':
        NotificationManager.info(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'success':
        NotificationManager.success(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'warning':
        NotificationManager.warning(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'danger':
        NotificationManager.error(notifiaciton.message, notifiaciton.title, 3500);
        break;
      case 'quickInfoAlert':
        NotificationManager.info(notifiaciton.message, notifiaciton.title, 1500);
        break;
      case 'successCallBack':
        NotificationManager.error(notifiaciton.message, notifiaciton.title, 1500, () => {
          window.history.back();
        });
        break;
    }
  }
  return;
};

window.addEventListener("itemInserted", function(e) {
  console.log(e);
  document.querySelector(".storage-observation").textContent = e.key;
  document.querySelector(".storage-observation").textContent += e.oldValue;
  document.querySelector(".storage-observation").textContent += e.newValue;
  document.querySelector(".storage-observation").textContent += e.url;
  document.querySelector(".storage-observation").textContent += JSON.stringify(
    e.storageArea
  );
});

