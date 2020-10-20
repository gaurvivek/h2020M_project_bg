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
  CLIENT_ID,
  CLIENT_SECRET,
  GRAND_TYPE,
  CLIENT_TOKEN_LIFETIME,
  DEFAULT_PROFILE_IMG,
  STORED_ADVERTISEMENT,
  STORED_ADNETWORK,
  STORED_CAMPAIGN,
  STORED_VENDORS,
  STORED_ASSETS,
  ADNETWORK_ID_SLUG,
  VENDOR_ID_SLUG,
  ASSET_ID_SLUG,
  CAMPAIGN_ID_SLUG,
  ADVERTISEMENT_ID_SLUG,
  REDUX_STATE_DATA
} from "__helpers/constants";
import fetch from "isomorphic-fetch";
import { SELECTED_ADNETWORK } from "__helpers/constants";
import { STORED_CAMPAIGN_ANALYTICS } from "__helpers/constants";
import { STORED_ADVERTISEMENT_ANALYTICS } from "__helpers/constants";
import { STORED_ASSETS_ANALYTICS } from "__helpers/constants";
import { SELECTED_CAMPAIGN } from "__helpers/constants";
import { FETCH_CATEGORIES } from "__helpers/constants";
import { FETCH_BRANDS } from "__helpers/constants";
import { clientTokenHeader } from "__helpers/auth-header";
import { DATA_LOADING } from "__helpers/constants";
import { OK_SUCCESS_STATUS } from "__helpers/constants";
import { v4 as uuidv4 } from 'uuid';

export const userService = {
  login,
  logout,
  getAll,
  updateUserInfo,
  fetchAdNetwork,
  fetchCampagin,
  fetchAdNetworkDetail,
  fetchCampaignDetail,
  fetchVendors,
  fetchAllVendors,
  fetchVendorDetail,
  fetchAssets,
  fetchAllAssets,
  fetchAssetDetail,
  fetchAdvertisement,
  fetchAdvertisementDetail,
  generateClientAouth,
  refreshClientAouth,
  refreshClientAouthImmediate,
  refreshClientAdNetwork,
  fetchUsrInfo,
  showNotification,
  fetchAnalytics,
  fetchBrand,
  fetchCategory,
  fetchCategory,
  fetchAdStatus,
  fetchAdType,
  fetchAdMedium,
  fetchAssetType,
  fetchAssetDisplayType,
  fetchCampaignStatus,
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
async function fetchBrand() {
  let brandJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiBrands = String(apiPath.fetchBrands);
  try {
    const response = await fetch(apiBrands, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          brandJson = data;
        }
      })
      .catch(error => {
        console.log("Brand list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Brand list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return brandJson;
}
async function fetchCategory() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiBrands = String(apiPath.fetchCategory);
  try {
    const response = await fetch(apiBrands, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchAdStatus() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.advertisementStatus);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchAdType() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.advertisementType);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchAdMedium() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.advertisementMedium);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchAssetType() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.assetType);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchAssetDisplayType() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.assetDisplayType);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
async function fetchCampaignStatus() {
  let categoryJson = [];
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  let apiPathLocal = String(apiPath.compaignStatus);
  try {
    const response = await fetch(apiPathLocal, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if ([FORBIDDEN_STATUS, INVALID_DATA_POST].includes(response.status)) {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          // const { token } = await response.json();
          console.log("Advertisement Success.", response);
        } else {
          if(contentType && contentType.indexOf("application/json") !== -1){
            return response.json();
          }else{
            showNotification = {
              title: enMsg.failedTitle,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
        }
        return response.json();
      })
      .then(data => {
        let jsonDataVal = data;
        if(("errorMessage" in data) && data["errorMessage"] != undefined){
          showNotification = {
            title: enMsg.failedTitle,
            message: data.errorMessage,
            type: "warning"
          };
        }else{
          categoryJson = data;
        }
      })
      .catch(error => {
        console.log("Category list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Category list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return categoryJson;
}
function logout(data) {
  console.log(JSON.stringify(data));
  // remove user from local storage to log user out
  let keysToRemove = [
    "user",
    "userDetail",
    "clientAuthToken",
    "tokenTimeStamp",
    "tokenTimeStamp",
    "clientAuthToken",
    STORED_ADVERTISEMENT,
    STORED_ADNETWORK,
    STORED_CAMPAIGN,
    STORED_ASSETS,
    STORED_VENDORS,
    SELECTED_ADNETWORK,
    STORED_CAMPAIGN_ANALYTICS,
    STORED_ADVERTISEMENT_ANALYTICS,
    STORED_ASSETS_ANALYTICS,
    SELECTED_CAMPAIGN,
    FETCH_CATEGORIES,
    FETCH_BRANDS,
    DATA_LOADING,
    REDUX_STATE_DATA,
  ];

  for (let key of keysToRemove) {
    localStorage.removeItem(key);
  }
  // setTimeout(function() {
  //   window.location.reload(true);
  // }, 2000);
  // localStorage.clear();
}

async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  const response = await fetch(apiPath.profile, requestOptions).then(
    handleResponse
  );
  return response;
}

function handleResponse(response) {
  try {
    if (response) {
      return response
        .json()
        .then(jsonResponse => {
          const data = jsonResponse;

          if (!response.ok) {
            console.log(response.status);
            if (response.status === SECURITY_ERROR) {
              // auto logout if SECURITY_ERROR response returned from api
              showNotification = {
                title: enMsg.sessionExpireTitle,
                message: enMsg.sessionExpire,
                type: "warning"
              };
              refreshClientAouthImmediate();
              console.log("20")
              setTimeout(function() {
                // logout();
                // window.location.reload(true);
              }, 2000);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          } else if (
            jsonResponse &&
            jsonResponse.user &&
            jsonResponse.user.email
          ) {
            /* store adnetwork in local storage */
            let adNetWorkJson = jsonResponse.adNetworks
              ? jsonResponse.adNetworks
              : [];
            sortJsonArray(adNetWorkJson, "companyName"); // default is 'asc'
            localStorage.setItem(
              STORED_ADNETWORK,
              JSON.stringify(
                jsonResponse.adNetworks ? jsonResponse.adNetworks : []
              )
            );
            jsonResponse = jsonResponse.user;
            let firstName = jsonResponse.fName;
            let lastName = jsonResponse.lName;
            let imageRef = jsonResponse.imageRef;

            userService.updateUserInfo(
              firstName,
              lastName,
              imageRef,
              jsonResponse
            );
          }
          return jsonResponse;
        })
        .catch(err => {
          console.log(err);
          refreshClientAouthImmediate();
          console.log("21")
        });
    }
  } catch (error) {
    refreshClientAouthImmediate();
    console.log("22")
  }
  return {};
}

function updateUserInfo(firstName, lastName, imageRef, ...jsonResponse) {
  if (jsonResponse[0]) {
    jsonResponse = jsonResponse[0];
  }
  jsonResponse = Object.assign(
    { firstName: firstName, lastName: lastName, imageRef: imageRef },
    jsonResponse
  );
  // console.log(jsonResponse);
  // localStorage.setItem("userDetail", JSON.stringify(jsonResponse));
  // console.log(jsonResponse);
  return jsonResponse;
}
async function fetchAnalytics(selectedAdNetworkJsonID, selectedCampaignJsonID) {
  let showNotification = {};
  let campaginJson = [];
  try {
    let fetchAnalytics = apiPath.fetchAnalytics.replace(
      ADNETWORK_ID_SLUG,
      selectedAdNetworkJsonID
    );
    fetchAnalytics = fetchAnalytics.replace(CAMPAIGN_ID_SLUG, selectedCampaignJsonID);
    const response = await fetch(fetchAnalytics, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        console.log(response.status, typeof response.status, typeof SECURITY_ERROR)
        if (response.status === SECURITY_ERROR || response.status === FORBIDDEN_STATUS) {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: response.statusText,
            type: "warning"
          };
        }else if (response.status === INVALID_DATA_POST) {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: response.statusText,
            type: "danger"
          };
        } else if (response.ok) {
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: response.statusText,
            type: "danger"
          };
        }
        return response.json();
      })
      .then(data => {
        if (data.errorCode === SECURITY_ERROR_CODE) {
          setTimeout(function() {
            logout();
            window.location.reload(true);
          }, 2000);
          return Promise.reject("");
        }
        campaginJson = data;
        return campaginJson;
      })
      .catch(error => {
        console.log("Campaign list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });
  } catch (error) {
    console.log("Campaign list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }
  createNotification(showNotification);
  return campaginJson;
}
async function fetchAdNetwork(adNetworkID) {
  //event.preventDefault();
  //console.log("fn called");
  // const data = {
  //   cName: this.state.cName,
  //   address: this.state.address,
  //   city: this.state.city,
  //   state: this.state.state,
  //   zipcode: this.state.zipcode,
  //   busbusinessType: this.state.businessType,
  // };

  let adnetworkAPI = String(apiPath.adnetwork);
  adnetworkAPI = adnetworkAPI.replace(ADNETWORK_ID_SLUG, adNetworkID);
  console.log(adnetworkAPI);
  var adNetWorkJson = [];
  let showNotification = {};
  try {
    const response = await fetch(adnetworkAPI, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        if (response.status === SECURITY_ERROR || response.status === FORBIDDEN_STATUS) {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: response.statusText,
            type: "warning"
          };
          logout();
        }else if (response.status === INVALID_DATA_POST) {
          refreshClientAouthImmediate();
          console.log("1")
          showNotification = {
            title: enMsg.fetchAdNetworkFailed,
            message: enMsg.invalidData400,
            type: "danger"
          };
        } else if (response.ok) {
          // showNotification = {
          //   title: enMsg.successTitle,
          //   message: enMsg.fetchAdNetworkSuccess,
          //   type: "success"
          // };
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchAdNetworkFailed,
            message: enMsg.invalidData400,
            type: "warning"
          };
          // refreshClientAouthImmediate();
          console.log("2")
        }
        // return response.json();
        // console.log("Fetch Adnetwork failed.", response);
      })
      .then(data => {
        // this.setState({ adNetWorkJson: data });
        if (data.errorCode == SECURITY_ERROR_CODE) {
          showNotification = {
            title: enMsg.sessionExpireTitle,
            message: enMsg.sessionExpire,
            type: "warning"
          };
          refreshClientAouthImmediate();
          console.log("3")
          setTimeout(function() {
            logout();
            window.location.reload(true);
          }, 2000);
        }
        if (!data.length) {
          return [];
        }
        adNetWorkJson = data;
        sortJsonArray(adNetWorkJson, "companyName"); // default is 'asc'

        // localStorage.setItem(
        //   STORED_ADNETWORK,
        //   JSON.stringify(adNetWorkJson ? adNetWorkJson : [])
        // );
      })
      .catch(error => {
        refreshClientAouthImmediate();
        console.log("5")
        console.log("Adnetwork list:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };

        return [];
      });

    // throw new Error(error);
  } catch (error) {
    refreshClientAouthImmediate();
    console.log("4")
    console.log("Adnetwork list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }
  createNotification(showNotification);

  return adNetWorkJson;
}

const fetchAllCampagin = async stroedAdNetwork => {
  let stroedCampaign = [];
  return await Promise.all(
    stroedAdNetwork.map(adNetwork => {
      if (adNetwork.adNetworkId) {
        return fetchCampagin(adNetwork.adNetworkId);
      }
    })
  );
};
async function fetchCampagin(selectedAdNetworkJsonID) {
  // let functionName = "fetchCampagin";
  let showNotification = {};
  let campaginJson = [];

  try {
    if (!selectedAdNetworkJsonID) {
      try {
        var stroedAdNetwork = JSON.parse(
          localStorage.getItem(STORED_ADNETWORK)
        );
        if (!stroedAdNetwork.length) {
          var stroedAdNetwork = [];
          let promise = fetchAdNetwork().then(response => {
            stroedAdNetwork = response;
          });
          console.log(promise);
        }
      } catch (error) {
        var stroedAdNetwork = [];
      }
      // fetchCampagin
      let stroedCampaign = [];
      // localStorage.setItem(STORED_CAMPAIGN, JSON.stringify(stroedCampaign));
      return fetchAllCampagin(stroedAdNetwork).then(campaginJson => {
        campaginJson.map(data => {
          Array.prototype.push.apply(stroedCampaign, data);
        });
        // localStorage.setItem(STORED_CAMPAIGN, JSON.stringify(stroedCampaign));
        return stroedCampaign;
      });
      // campaginJson = stroedAdNetwork.map(adNetwork => {
      //   if (adNetwork.adNetworkId) {
      //     console.log(adNetwork);
      //     fetchAllCampagin(adNetwork.adNetworkId).then(campagin => {
      //       Array.prototype.push.apply(stroedCampaign, campagin);
      //       localStorage.setItem("clientAuthToken", stroedCampaign);
      //       console.log();
      //       return campagin;
      //     });
      //   }
      // });
      // return campaginJson;
    }
    let listCampaign = apiPath.listCampaign.replace(
      ADNETWORK_ID_SLUG,
      selectedAdNetworkJsonID
    );
    const response = await fetch(listCampaign, {
      method: "GET",
      headers: authHeader()
      // body: JSON.stringify(data)
    })
      .then(response => {
        // console.log(response.status === INVALID_DATA_POST);
        if (response.status === INVALID_DATA_POST) {
          // showNotification = {
          //   title: enMsg.fetchCampaignFailed,
          //   message: response.statusText,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("6")
          // console.log("Create Campaign Failed.", response);
        } else if (response.ok) {
          // showNotification = {
          //   title: enMsg.successTitle,
          //   message: enMsg.fetchCampaignSuccess,
          //   type: "success"
          // };
          return response.json();
        } else {
          // showNotification = {
          //   title: enMsg.fetchCampaignFailed,
          //   message: response.statusText,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("7")
        }
        // return response.json();
      })
      .then(data => {
        // console.log(data);
        if (data.errorCode === SECURITY_ERROR_CODE) {
          // logout(data);
          // window.location.reload(true);
          refreshClientAouthImmediate();
          console.log("8")
          return Promise.reject("");
        }
        campaginJson = data;
        let stroedCampaign = [];
        // localStorage.setItem(STORED_CAMPAIGN, JSON.stringify(stroedCampaign));
        // localStorage.setItem(STORED_CAMPAIGN, JSON.stringify(campaginJson));
        return campaginJson;
      })
      .catch(error => {
        refreshClientAouthImmediate();
        console.log("9")
        console.log("Campaign list:" + error);
        // showNotification = {
        //   title: enMsg.connectionFailed,
        //   message: enMsg.networkFailedError,
        //   type: "danger"
        // };
      });
  } catch (error) {
    refreshClientAouthImmediate();
    console.log("10")
    console.log("Campaign list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return campaginJson;
}

async function fetchAllVendors(selectedAdNetworkJson) {
  //stroedAdNetwork
  let vendorsJson = [];
  let stroedAdNetwork = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
  console.log(selectedAdNetworkJson)
  if(!selectedAdNetworkJson){
    return await Promise.all(
      stroedAdNetwork.map(adNetwork => {
        if (adNetwork.adNetworkId) {
          return fetchVendors(adNetwork.adNetworkId);
        }
      })
    ).then(responseArray => {
      responseArray.map(data => {
        if (data) Array.prototype.push.apply(vendorsJson, data);
      });
      // localStorage.setItem(STORED_VENDORS, JSON.stringify(vendorsJson));
      return vendorsJson;
    });
  }else{
    return await Promise.all(
      stroedAdNetwork.map(adNetwork => {
        if (adNetwork.adNetworkId && adNetwork.adNetworkId == selectedAdNetworkJson) {
          return fetchVendors(adNetwork.adNetworkId);
        }
      })
    ).then(responseArray => {
      responseArray.map(data => {
        if (data) Array.prototype.push.apply(vendorsJson, data);
      });
      // localStorage.setItem(STORED_VENDORS, JSON.stringify(vendorsJson));
      return vendorsJson;
    });
  }
}

async function fetchVendors(adNetworkID) {
  var vendorsJson = [];
  let showNotification = {};

  let apiVendors = String(apiPath.vendors);
  apiVendors = apiVendors.replace(ADNETWORK_ID_SLUG, adNetworkID);
  try {
    const response = await fetch(apiVendors, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        if (response.status === INVALID_DATA_POST) {
          // showNotification = {
          //   title: enMsg.fetchvendorsFailed,
          //   message: enMsg.invalidData400,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("11")
        } else if (response.ok) {
          return response.json();
        } else {
          // showNotification = {
          //   title: enMsg.fetchvendorsFailed,
          //   message: enMsg.invalidData400,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("12")
        }
        console.log("Fetch Vendors failed.", response);
      })
      .then(data => {
        if (data.errorCode == SECURITY_ERROR_CODE) {
          // logout(data);
          return;
        }
        // console.log("data: ", data);
        return (vendorsJson = data);
      })
      .catch(error => {
        console.log("Vendor list:" + error);
        refreshClientAouthImmediate();
        console.log("13")
        // showNotification = {
        //   title: enMsg.connectionFailed,
        //   message: enMsg.networkFailedError,
        //   type: "danger"
        // };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Vendor list:" + error);
    refreshClientAouthImmediate();
    console.log("14")
    // showNotification = {
    //   title: enMsg.connectionFailed,
    //   message: enMsg.networkFailedError,
    //   type: "danger"
    // };
  }

  createNotification(showNotification);
  return vendorsJson;
}
async function fetchVendorDetail(vendorId, adNetworkID) {
  let showNotification = {};
  let campaginDetail;

  try {
    // for latter use - do not remote this code
    let manageVendor = String(apiPath.manageVendor);
    manageVendor = manageVendor.replace(VENDOR_ID_SLUG, vendorId);
    manageVendor = manageVendor.replace(ADNETWORK_ID_SLUG, adNetworkID);

    const response = await fetch(manageVendor, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        // console.log(response);
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: enMsg.invalidData400,
            type: "danger"
          };
        }
        console.log("Fetch Campaign failed.", response);
      })
      .then(data => {
        campaginDetail = data;

        // console.log(this.state);
      })
      .catch(error => {
        console.log("Vendor detail:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };

        campaginDetail = response;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Vendor detail:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return campaginDetail;
}

async function fetchAllAssets(selectedAdNetworkJson) {
  //stroedAdNetwork
  let assetsJson = [];
  let stroedAdNetwork = JSON.parse(localStorage.getItem(STORED_ADNETWORK));
  if(!selectedAdNetworkJson){
    return await Promise.all(
      stroedAdNetwork.map(adNetwork => {
        if (adNetwork.adNetworkId) {
          return fetchAssets(adNetwork.adNetworkId);
        }
      })
    ).then(responseArray => {
      responseArray.map(data => {
        if (data) Array.prototype.push.apply(assetsJson, data);
      });
      // localStorage.setItem(STORED_ASSETS, JSON.stringify(assetsJson));

      return assetsJson;
    });
  }else{
    return await Promise.all(
      stroedAdNetwork.map(adNetwork => {
        if (adNetwork.adNetworkId && adNetwork.adNetworkId == selectedAdNetworkJson) {
          return fetchAssets(adNetwork.adNetworkId);
        }
      })
    ).then(responseArray => {
      responseArray.map(data => {
        if (data) Array.prototype.push.apply(assetsJson, data);
      });
      // localStorage.setItem(STORED_ASSETS, JSON.stringify(assetsJson));

      return assetsJson;
    });
  }
}

async function fetchAssets(adNetworkID) {
  var assetsJson = [];
  let showNotification = {};

  let apiAssets = String(apiPath.assets);
  apiAssets = apiAssets.replace(ADNETWORK_ID_SLUG, adNetworkID);
  try {
    const response = await fetch(apiAssets, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        if (response.status === INVALID_DATA_POST) {
          // showNotification = {
          //   title: enMsg.fetchAssetsFailed,
          //   message: enMsg.invalidData400,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("15")
        } else if (response.ok) {
          return response.json();
        } else {
          // showNotification = {
          //   title: enMsg.fetchAssetsFailed,
          //   message: enMsg.invalidData400,
          //   type: "danger"
          // };
          refreshClientAouthImmediate();
          console.log("16")
        }
        console.log("Fetch Assets failed.", response);
      })
      .then(data => {
        assetsJson = data;
      })
      .catch(error => {
        console.log("Asset list:" + error);
        // showNotification = {
        //   title: enMsg.connectionFailed,
        //   message: enMsg.networkFailedError,
        //   type: "danger"
        // };
        refreshClientAouthImmediate();
        console.log("17")
        // return assetsJson;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Asset list:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
    refreshClientAouthImmediate();
    console.log("18")
  }
  createNotification(showNotification);

  return assetsJson;
}

async function fetchAssetDetail(assetId, adNetworkID) {
  let showNotification = {};
  let campaginDetail;

  try {
    // for latter use - do not remote this code
    let manageAssets = String(apiPath.manageAssets);
    manageAssets = manageAssets.replace(ASSET_ID_SLUG, assetId);
    manageAssets = manageAssets.replace(ADNETWORK_ID_SLUG, adNetworkID);

    const response = await fetch(manageAssets, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        // console.log(response);
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: enMsg.invalidData400,
            type: "danger"
          };
        }
        console.log("Fetch Campaign failed.", response);
      })
      .then(data => {
        campaginDetail = data;

        // console.log(this.state);
      })
      .catch(error => {
        console.log("Asset detail:" + error);

        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };

        campaginDetail = response;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Asset detail:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return campaginDetail;
}
async function fetchAdvertisementDetail(advertisementID, adnetworkID) {
  let advertisementDetail = {};
  let showNotification = {};
  try {
    if (advertisementID && adnetworkID) {
      let editAdvertisement = String(apiPath.editAdvertisement)
        .replace(ADNETWORK_ID_SLUG, adnetworkID)
        .replace(ADVERTISEMENT_ID_SLUG, advertisementID);

      const response = await fetch(editAdvertisement, {
        method: "GET",
        headers: authHeader()
      })
        .then(response => {
          if (response.status === INVALID_DATA_POST) {
            showNotification = {
              title: enMsg.fetchAdvertisementDetailFailed,
              message: enMsg.invalidData400,
              type: "danger"
            };
          } else if (response.ok) {
            return response.json();
          } else {
            showNotification = {
              title: enMsg.fetchAdvertisementDetailFailed,
              message: enMsg.invalidData400,
              type: "danger"
            };
          }
          console.log("Fetch Assets failed.", response);
        })
        .then(data => {
          advertisementDetail = data;
        })
        .catch(error => {
          console.log("Ad detail:" + error);
          showNotification = {
            title: enMsg.connectionFailed,
            message: enMsg.networkFailedError,
            type: "danger"
          };

          return advertisementDetail;
        });

      // throw new Error(error);
    } else {
      showNotification = {
        title: enMsg.failedTitle,
        message: enMsg.fetchAdvertisementDetailFailed,
        type: "danger"
      };
      console.log(showNotification);
    }
  } catch (error) {
    console.log("Ad detail:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }
  createNotification(showNotification);

  return advertisementDetail;
}

async function fetchAdvertisement() {
  var advertisementsJson = [];
  let showNotification = {};

  let stroredCampaigns = JSON.parse(localStorage.getItem(STORED_CAMPAIGN));
  if (!stroredCampaigns.length) {
    await fetchCampagin();
    stroredCampaigns = JSON.parse(localStorage.getItem(STORED_CAMPAIGN));
  }

  return await Promise.all(
    stroredCampaigns.map(campaign => {
      let apiListAdvertisement = String(apiPath.apiListAdvertisement);

      apiListAdvertisement = apiListAdvertisement.replace(
        CAMPAIGN_ID_SLUG,
        campaign.campaignId
      );
      apiListAdvertisement = apiListAdvertisement.replace(
        ADNETWORK_ID_SLUG,
        campaign.adNetworkId
      );
      try {
        return fetch(apiListAdvertisement, {
          method: "GET",
          headers: authHeader()
          // body: JSON.stringify(data)
        })
          .then(response => {
            // console.log(response.status === INVALID_DATA_POST);
            if (!response.ok) {
              showNotification = {
                title: enMsg.fetchAdvertisementFailed,
                message: response.statusText,
                type: "danger"
              };
              // console.log("Fetch Advertisement failed.", response);
              let error = new Error();
            }
            return response.json();
          })
          .then(data => {
            if (data.id) {
              Array.prototype.push.apply(advertisementsJson, data);
              advertisementsJson.push(data);
            }
          })
          .catch(error => {
            console.log("Ad detail:" + error);
            showNotification = {
              title: enMsg.connectionFailed,
              message: enMsg.networkFailedError,
              type: "danger"
            };
          });

        // throw new Error(error);
      } catch (error) {
        console.log("Ad detail:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      }

      // console.log({
      //   showNotification,
      //   advertisementsJson
      // });
    })
  )
    .then(responseArray => {
      responseArray.map(data => {
        if (data) advertisementsJson.push(data);
      });
      return advertisementsJson;
    })
    .finally(() => {
      createNotification(showNotification);
    });
}

async function fetchAdNetworkDetail(adnetworkID) {
  let showNotification = {};
  let adNetworkDetail;

  try {
    // for latter use - do not remote this code
    let manageAdnetworkApi = String(apiPath.manageAdnetwork);
    // manageAdnetworkApi = manageAdnetworkApi.replace(CAMPAIGN_ID_SLUG, campaignId);
    manageAdnetworkApi = manageAdnetworkApi.replace(
      ADNETWORK_ID_SLUG,
      adnetworkID
    );

    const response = await fetch(manageAdnetworkApi, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        console.log(response);
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          showNotification = {
            title: enMsg.successTitle,
            message: enMsg.fetchAdNetworkSuccess,
            type: "success"
          };
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: enMsg.invalidData400,
            type: "danger"
          };
        }
        console.log("Fetch Campaign failed.", response);
      })
      .then(data => {
        adNetworkDetail = data;

        // console.log(this.state);
      })
      .catch(error => {
        console.log("Adnetwotj detail Error:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };

        adNetworkDetail = response;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Adnetwotj detail Error:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return adNetworkDetail;
}
async function fetchCampaignDetail(campaignId, adNetworkID) {
  let showNotification = {};
  let campaginDetail;

  try {
    // for latter use - do not remote this code
    let addEditCampaign = String(apiPath.addEditCampaign);
    addEditCampaign = addEditCampaign.replace(CAMPAIGN_ID_SLUG, campaignId);
    addEditCampaign = addEditCampaign.replace(ADNETWORK_ID_SLUG, adNetworkID);

    const response = await fetch(addEditCampaign, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        // console.log(response);
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          return response.json();
        } else {
          showNotification = {
            title: enMsg.fetchCampaignFailed,
            message: enMsg.invalidData400,
            type: "danger"
          };
        }
        console.log("Fetch Campaign failed.", response);
      })
      .then(data => {
        campaginDetail = data;

        // console.log(this.state);
      })
      .catch(error => {
        console.log("Campaign Error:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };

        campaginDetail = response;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Campaign Error:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);
  return campaginDetail;
}

async function refreshClientAdNetwork(){
  let user = JSON.parse(localStorage.getItem("user"));
  let clientAuthToken = localStorage.getItem("clientAuthToken");
  let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
  let currentTimeStamp = new Date().getTime();

  let uniqueId = localStorage.getItem("uniqueId");

  if(!uniqueId || uniqueId == "" || uniqueId == null || uniqueId == undefined){
    uniqueId = uuidv4();
    localStorage.setItem("uniqueId", uniqueId);
  }

  // if (
  //   user && user.accessToken && clientAuthToken &&
  //   currentTimeStamp - tokenTimeStamp < CLIENT_TOKEN_LIFETIME
  // ) {
  //   return user;
  // }
  let showNotification = {};
  try {
    // for latter use - do not remote this code
    // apiPath = apiPath.replace(ADNETWORK_ID_SLUG, this.state.selectedAd);
    // apiPath = apiPath.replace(CAMPAIGN_ID_SLUG, this.state.campaignId);
    const data = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      grantType: GRAND_TYPE,
      scope: null,
      deviceUid: uniqueId,
    };

    const response = await fetch(apiPath.refreshClientToken, {
      method: "PUT",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json"
      // },
      headers: reauthorizeTokenHeader(),
      body: JSON.stringify(data)
    })
      .then(response => {
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };
          logout();

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
          logout();
        } else if (response.ok) {
          let newAccessToken = response.headers.get("Authorization");
          if (newAccessToken) {
            let tokenTimeStamp = new Date().getTime();
            localStorage.setItem("clientAuthToken", newAccessToken);
            // user.accessToken = newAccessToken
            // localStorage.setItem("user", JSON.stringify(user));
            // localStorage.setItem("tokenTimeStamp", tokenTimeStamp);
          }
          // console.log(response);
          return response.text();
        } else {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };
          logout();
        }
        // console.log("Fetch Campaign failed.", response);
      })
      .then(response => {
        return user;
      })
      .catch(error => {
        // console.log(error);
        console.log("Auth error:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
        logout();
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Auth error:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }
  createNotification(showNotification);
  return user;
}
async function refreshClientAouth(){
  console.log("countForCall1");
  let user = JSON.parse(localStorage.getItem("user"));
  let clientAuthToken = localStorage.getItem("clientAuthToken");
  let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
  let currentTimeStamp = new Date().getTime();
  if (
    user && user.accessToken && clientAuthToken &&
    currentTimeStamp - tokenTimeStamp < CLIENT_TOKEN_LIFETIME
  ) {
    return user;
  }else{
    try{
      await generateClientAouth("urgent");
      let userData = user.authdata;
      userData = window.atob(userData);
      userData = window.atob(userData);
      var arrayVals = userData.split(':');
      // await login(arrayVals[0], arrayVals[1]);
    }catch (error) {
      console.log("Auth error:" + error);
      logout();
    }
  }
  return true;
}
async function refreshClientAouthImmediate(){
  console.log("countForCall1+1");
  let user = JSON.parse(localStorage.getItem("user"));
  let clientAuthToken = localStorage.getItem("clientAuthToken");
  let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
  let currentTimeStamp = new Date().getTime();
  try{
    await generateClientAouth("urgent");
    // setTimeout(function() {
    //   window.location.reload(true);
    // }, 2000);
  }catch (error) {
    console.log("Auth error:" + error);
    logout();
  }
  return true;
}

async function generateClientAouth(apiLevel) {
  console.log("countForCall2");
  let clientAuthToken = localStorage.getItem("clientAuthToken");
  let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
  let uniqueId = localStorage.getItem("uniqueId");
  let currentTimeStamp = new Date().getTime();
  

  if(!uniqueId || uniqueId == "" || uniqueId == null || uniqueId == undefined){
    uniqueId = uuidv4();
    localStorage.setItem("uniqueId", uniqueId);
  }

  if(!apiLevel || apiLevel != "urgent"){
    if (
      clientAuthToken &&
      currentTimeStamp - tokenTimeStamp < CLIENT_TOKEN_LIFETIME
    ) {
      return clientAuthToken;
    }
  }
  let showNotification = {};

  try {
    // for latter use - do not remote this code
    // apiPath = apiPath.replace(ADNETWORK_ID_SLUG, this.state.selectedAd);
    // apiPath = apiPath.replace(CAMPAIGN_ID_SLUG, this.state.campaignId);
    const data = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      grantType: GRAND_TYPE,
      scope: null,
      deviceUid: uniqueId,
    };

    const response = await fetch(apiPath.clientToken, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (
          response.status === FORBIDDEN_STATUS ||
          response.status === INVALID_DATA_POST
        ) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };

          console.log("Campaign Failed.", response);
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.noDataFound,
            type: "danger"
          };
        } else if (response.ok) {
          clientAuthToken = response.headers.get("x-App-Authorization");
          if (clientAuthToken) {
            let tokenTimeStamp = new Date().getTime();
            localStorage.setItem("clientAuthToken", clientAuthToken);
            localStorage.setItem("tokenTimeStamp", tokenTimeStamp);
            if(apiLevel && apiLevel == "urgent"){
              let user = JSON.parse(localStorage.getItem("user"));
              let userData = user.authdata;
              userData = window.atob(userData);
              userData = window.atob(userData);
              var arrayVals = userData.split(':');
              login(arrayVals[0], arrayVals[1]);
            }
          }
          // console.log(response);
          return response.text();
        } else {
          showNotification = {
            title: enMsg.failedTitle,
            message: enMsg.invalidData400,
            type: "danger"
          };
        }
        // console.log("Fetch Campaign failed.", response);
      })
      .then(response => {
        return clientAuthToken;
      })
      .catch(error => {
        // console.log(error);
        console.log("Auth error:" + error);
        showNotification = {
          title: enMsg.connectionFailed,
          message: enMsg.networkFailedError,
          type: "danger"
        };
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Auth error:" + error);
    showNotification = {
      title: enMsg.connectionFailed,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }
  createNotification(showNotification);
  return clientAuthToken;
}

async function fetchUsrInfo() {
  //event.preventDefault();
  let userProfileData = {};
  let showNotification = {};
  try {
    const response = await fetch(apiPath.profile, {
      method: "GET",
      headers: authHeader()
    })
      .then(response => {
        if (response.status === SECURITY_ERROR) {
          // showNotification = {
          //   title: enMsg.sessionExpireTitle,
          //   message: enMsg.sessionExpire,
          //   type: "danger"
          // };
          // console.log("Fetch user profile data Failed.", response);
          // logout(response);
          return response.reject("");
        } else if (response.status === INVALID_DATA_POST) {
          showNotification = {
            title: enMsg.fetchUserDatatitle,
            message: enMsg.invalidData400,
            type: "danger"
          };
          console.log("Fetch user profile data Failed.", response);
        } else if (response.ok) {
          //console.log("Fetch user profile data Success.", response);
          // showNotification = {
          //   title: "Fetch user profile data Success",
          //   message: "Adnetwork successfully created. ",
          //   type: "success"
          // };
          return response.json();
        } else if (response.status === NO_DATA_FOUND) {
          showNotification = {
            title: enMsg.incompleteProfile,
            message: "Please complete your profile.",
            type: "warning"
          };
          console.log("Fetch user profile data failed.", response);
        }
      })
      .then(profile => {
        if (profile && profile.user && profile.user.email) {
          console.log(profile);
          let user = profile.user;
          let email = "email" in user ? user.email : "";
          let firstName = "fName" in user ? user.fName : "";
          let mName = "mInit" in user ? user.mInit : "";
          let lastName = "lName" in user ? user.lName : "";
          let phone = "phone" in user ? user.phone : null;
          let zipCode = "zipCode" in user ? user.zipCode : "";
          let gender = "gender" in user ? user.gender : "";
          let dob = "dob" in user ? user.dob : null;
          let imageRef = user.imageRef ? user.imageRef : DEFAULT_PROFILE_IMG;
          let role = "role" in user ? user.role : "merchant";
          // console.log(firstName, mInit, lastName);

          userService.updateUserInfo(firstName, lastName, imageRef, user);

          console.log(5454);
          userProfileData = {
            email,
            firstName,
            mName,
            lastName,
            phone,
            zipCode,
            gender,
            role,
            dob,
            imageRef
          };
        }
      })
      .catch(error => {
        // console.log("Fetch user info:" + error);
        // showNotification = {
        //   title: enMsg.fetchUserDatatitle,
        //   message: enMsg.networkFailedError,
        //   type: "danger"
        // };
        return userProfileData;
      });

    // throw new Error(error);
  } catch (error) {
    console.log("Fetch user info:" + error);
    showNotification = {
      title: enMsg.fetchUserDatatitle,
      message: enMsg.networkFailedError,
      type: "danger"
    };
  }

  createNotification(showNotification);

  return userProfileData;
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
        NotificationManager.success(notifiaciton.message, notifiaciton.title, 1900);
        break;
      case 'warning':
        NotificationManager.warning(notifiaciton.message, notifiaciton.title, 4500);
        break;
      case 'danger':
        NotificationManager.error(notifiaciton.message, notifiaciton.title, 1900);
        break;
      case 'quickInfoAlert':
        NotificationManager.info(notifiaciton.message, notifiaciton.title, 3000);
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

