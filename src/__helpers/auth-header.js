export function authHeader() {
  // return authorization header with basic auth credentials
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "https://asgcp-int.adpersistence.com",
      Authorization: user.accessToken
    };
  } else {
    return {};
  }
}

export function authHeaderMIMETYPE() {
  // return authorization header with basic auth credentials
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    return {
      Accept: "application/json",
      // "Content-Type": "multipart/form-data",
      // "Content-Type": "application/json",
      Authorization: user.accessToken
    };
  } else {
    return {};
  }
}

export function clientTokenHeader() {
  // return authorization header with basic auth credentials
  let clientAuthToken = localStorage.getItem("clientAuthToken");

  if (clientAuthToken) {
    return {
      Accept: "application/json",
      // "Access-Control-Allow-Origin": "https://asgcp-int.adpersistence.com",
      "Content-Type": "application/json",
      "x-App-Authorization": clientAuthToken
    };
  } else {
    return {};
  }
}
export function generalAuthTokenHeader() {
  return {
    Accept: "application/json",
    // "Access-Control-Allow-Origin": "https://asgcp-int.adpersistence.com",
    "Content-Type": "application/json",
  };
}
export function reauthorizeTokenHeader() {
  // return authorization header with basic auth credentials
  let clientAuthToken = localStorage.getItem("clientAuthToken");
  let user = JSON.parse(localStorage.getItem("user"));
  if (clientAuthToken && user && user.accessToken) {
    return {
      Accept: "application/json",
      // "Access-Control-Allow-Origin": "https://asgcp-int.adpersistence.com",
      "Content-Type": "application/json",
      "x-App-Authorization": clientAuthToken,
      Authorization: user.accessToken
    };
  } else {
    return {};
  }
}
