import dummy from "assets/img/default-profile.gif";
import loader from "assets/img/Infinity-loader.svg";

export const JWT_SECRET_KEY = "json-server-auth-123456";
export const JWT_EXPIRES_IN = "1h";
export const SALT_LENGTH = 10;
// export const EMAIL_REGEX = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
export const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 16;
export const PASSWORD_PATTERN = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{${MIN_PASSWORD_LENGTH},})`
);
export const URL_PATTERN_LOCK = new RegExp(
  /^(http:\/\/|https:\/\/|www\.)(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(?::\d{1,5})?(?:$|[?\/#])/i
);
export const URL_PATTERN = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
);

export const PHONE_REGEX = new RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);
export const OK_SUCCESS_STATUS = 200;
export const STATUS_CREATED = 201;
export const NO_CONTENT_STATUS = 204;
export const INVALID_DATA_POST = 400;
export const SECURITY_ERROR = 401;
export const FORBIDDEN_STATUS = 403;
export const NO_DATA_FOUND = 404;
export const SERVER_ERROR = 500;
export const DIGIT_ONLY = new RegExp(`^[0-9]+$`);
export const IMAGE_MAX_HEIGHT_WIDTH_LENTH = 4;
export const OPT_LENGTH = 6;
export const ZIP_CODE_LENGTH = 5;
export const PHONE_NO_INVALID_LENGTH = 7;
export const ZIPCODE_REGEX = new RegExp(/^\d{5}([\-]?\d{4})?$/i);
export const ALLOWED_PROFILE_IMAGE_SIZE = 1024 * 1000 * 2; // 2MB
export const MIN_AGE_YEARS = 18; // 18 Year minimum for DOB
export const DEFAULT_PROFILE_IMG = dummy;
export const NO_USERNAME = "Anonymous";
export const SHOW_LOADER = loader;
// export const CLIENT_TOKEN_LIFETIME = 900; // cleint auth token life time in seconds : 900 i.e. 15 Mins
export const CLIENT_TOKEN_LIFETIME = 15 * 60 * 1000; // cleint auth token life time in miliseconds : 900000 i.e. 15 Mins
export const APPLICATION_ROLES = ["merchant", "user"];
export const RECORD_PER_PAGE = 10;

export const DATA_LOADING = "_data_loading";
export const REDUX_STATE_DATA = "_redux_state_data";


export const PER_PAGE_OPTIONS = [10, 25, 100];
/* slugs use in routing */


// export const CLIENT_ID = "4731b9f8-df33-4d7d-80db-42cb5f7485b1";
export const CLIENT_ID = window._env_.CLIENT_ID;
// export const CLIENT_SECRET = "password";
export const CLIENT_SECRET = window._env_.CLIENT_SECRET;
export const GRAND_TYPE = "client_credentials";
/* use to show drop down & change status at list of campaign */



export const genderType = {
  male: "Male",
  female: "Female"
};

export const ALLOWED_IMAGE_EXTENTION = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "text/plain", "audio/mp3"]; // "video/x-msvideo",
export const NotificationOptions = {
  insert: "bottom",
  container: "top-right",
  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],
  showIcon: true,
  dismiss: {
    duration: 5000,
    onScreen: true
    // pauseOnHover: true
  }
};

/* Response Status errorCode*/
export const SECURITY_ERROR_CODE = 1208;

export const ALERT_NOTIFICATION = "_ALERT_NOTIFICATION"
export const MAIL_NOTIFICATION = "_MAIL_NOTIFICATION"
