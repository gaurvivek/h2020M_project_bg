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
export const STORED_ADNETWORK = "_adNetworks";
export const STORED_CAMPAIGN = "_campaigns";
export const STORED_ADVERTISEMENT = "_advertisements";
export const STORED_ASSETS = "_assets";
export const STORED_VENDORS = "_vendors";
export const SELECTED_ADNETWORK = "_selected_adnetwork";
export const SELECTED_ADNETWORK_DATA = "_selected_adnetwork_data";
export const STORED_CAMPAIGN_ANALYTICS = "_selected_campaign_analytics";
export const STORED_ADVERTISEMENT_ANALYTICS = "_selected_advertisement_analytics";
export const STORED_ASSETS_ANALYTICS = "_selected_assets_analytics";
export const SELECTED_CAMPAIGN = "_selected_campaign";
export const FETCH_CATEGORIES = "_fetch_categories";
export const FETCH_BRANDS = "_fetch_brands";
export const DATA_LOADING = "_data_loading";
export const FETCH_AD_STATUS = "_fetch_ad_status";
export const FETCH_AD_MEDIUM = "_fetch_ad_medium";
export const FETCH_AD_TYPE = "_fetch_ad_type";
export const FETCH_ASSET_TYPE = "_fetch_asset_type";
export const FETCH_ASSET_DISPLAY_TYPE = "_fetch_asset_display_type";
export const FETCH_CAMPAIGN_STATUS = "_fetch_campaign_status";
export const REDUX_STATE_DATA = "_redux_state_data";
export const ANALYTICS_CSV_DATA = "_analytics_data";
export const ANALYTICS_CSV_ADVERTISEMENT_DATA = "_analytics_advertisement_data";


export const PER_PAGE_OPTIONS = [10, 25, 100];
/* slugs use in routing */
export const ADNETWORK_ID_SLUG = ":adnetworkID";
export const CAMPAIGN_ID_SLUG = ":campaignID";
export const ADVERTISEMENT_ID_SLUG = ":advertisementID";
export const VENDOR_ID_SLUG = ":vendorID";
export const ASSET_ID_SLUG = ":assetID";
export const ADVT_SORT = {
  name: "Name",
  startDate: "Date"
};

// export const CLIENT_ID = "4731b9f8-df33-4d7d-80db-42cb5f7485b1";
export const CLIENT_ID = window._env_.CLIENT_ID;
// export const CLIENT_SECRET = "password";
export const CLIENT_SECRET = window._env_.CLIENT_SECRET;
export const GRAND_TYPE = "client_credentials";
/* use to show drop down & change status at list of campaign */
export const CampaginStatus = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  completed: "Completed"
};

export const AdvertisementStatus = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  expired_early: "Expired Early"
};
export const redemptionTypeValues = {
  online_promo_code: "Online Promo Code",
  interleaved: "Interleaved",
  codabar: "Codabar",
  code_39: "Code 39",
  code_128: "Code 128",
  ean_8: "EAN 8",
  ean_13: "EAN 13",
  upc_a: "UPC A",
  upc_e: "UPC E",
  pdf_417: "PDF 417",
  data_matrix: "Data Matrix",
  postnet: "Postnet",
  qr: "QR"
};
export const savingsTypeValues = {
  dollar_savings: "Dollar Savings",
  percent_savings: "Percent Savings",
  buy_one_get_one: "Buy One Get One",
  free: "free",
  rewards_points: "Rewards Points",
  custom_price: "Custom Price"
};

export const adMediumTypes = {
  image: "Image",
  text: "Text",
  video: "Video",
  audio: "Audio",
  multimedia: "Multimedia"
};

export const adMediumTypesExtenstions = {
  image: ALLOWED_IMAGE_EXTENTION,
  text: "Text",
  video: "Video",
  audio: "Audio",
  multimedia: "Multimedia"
};
export const assetsTypesValues = {
  image: "Image",
  text: "Text",
  video: "Video",
  audio: "Audio"
};

export const displayTypesValues = {
  full: "Full",
  banner: "Banner",
  notification: "Notification"
};
//
export const advertisementTypes = {
  awareness: "Awareness",
  offer: "Offer",
  coupon: "Coupon"
};

export const genderType = {
  male: "Male",
  female: "Female"
};

export const campaignClaims = ["totalAdClaims"];
export const campaignClicks = ["totalAdClicks"];
export const campaignReached = ["totalApplicationsReached", "totalDevicesReached", "totalExternalApplicationsReached", "totalExternalDevicesReached", "totalPresenceReached"];
export const campaignImpression = ["totalAdImpressions", "totalAdPostImpressions"];
export const campaignRedeems = ["totalAdRedeems"];

export const advertisementClaims = ["totalAssetClaims"];
export const advertisementClicks = ["totalAssetClicks"];
export const advertisementReached = ["totalApplicationsReached", "totalDevicesReached", "totalExternalApplicationsReached", "totalExternalDevicesReached", "totalPresenceReached"];
export const advertisementImpression = ["totalAssetImpressions", "totalAssetPostImpressions"];
export const advertisementRedeems = ["totalAssetRedeems"];

export const assetsClaims = ["numClaims"];
export const assetsClicks = ["numClicks"];
export const assetsReached = ["numApplicationsReached", "numDevicesReached", "numExternalApplicationsReached", "numExternalDevicesReached", "numPresenceReached"];
export const assetsImpression = ["numImpressions", "numPostImpressions"];
export const assetsRedeems = ["numRedeems"];

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

export const categoriesJson = [
  { name: "category 1", id: "category1" },
  { name: "category 2", id: "category2" }
];
export const brandsJson = [
  { name: "Brand 1", id: "Brand1" },
  { name: "Brand 2", id: "Brand2" }
];

/* Response Status errorCode*/
export const SECURITY_ERROR_CODE = 1208;
