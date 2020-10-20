import { 
    ADD_ARTICLE, USER_INFO_REDUX,
    STORED_ADNETWORK_REDUX,
    DATA_LOADING_REDUX,
    FETCH_CATEGORIES_REDUX,
    FETCH_AD_STATUS_REDUX,
    FETCH_AD_MEDIUM_REDUX,
    FETCH_AD_TYPE_REDUX,
    FETCH_ASSET_TYPE_REDUX,
    FETCH_ASSET_DISPLAY_TYPE_REDUX,
    FETCH_CAMPAIGN_STATUS_REDUX,
    STORED_ADVERTISEMENT_REDUX,
    STORED_CAMPAIGN_REDUX,
    STORED_ASSET_REDUX,
    STORED_VENDOR_REDUX,
    STORED_TIMESTAMP,
    FETCH_BRANDS_REDUX,
    REDUX_LOAD,
    FETCHED_ADNETWORK_LIST_REDUX
 } from "../constants/action-types";

export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload }
};
export function reduxLoad(payload) {
    return { type: REDUX_LOAD, payload }
};
export function dataLoadingFlag(payload) {
    return { type: DATA_LOADING_REDUX, payload }
};
export function addUSerUInfo(payload) {
    return { type: USER_INFO_REDUX, payload }
};
export function addAdNetwork(payload) {
    return { type: STORED_ADNETWORK_REDUX, payload }
};
export function addAdNetworkList(payload) {
    return { type: FETCHED_ADNETWORK_LIST_REDUX, payload }
};
export function addCategories(payload) {
    return { type: FETCH_CATEGORIES_REDUX, payload }
};
export function addBrands(payload) {
    return { type: FETCH_BRANDS_REDUX, payload }
};
export function addAdStatus(payload) {
    return { type: FETCH_AD_STATUS_REDUX, payload }
};
export function addAdMedium(payload) {
    return { type: FETCH_AD_MEDIUM_REDUX, payload }
};
export function adAdType(payload) {
    return { type: FETCH_AD_TYPE_REDUX, payload }
};
export function addAssetType(payload) {
    return { type: FETCH_ASSET_TYPE_REDUX, payload }
};
export function addAssetDisplayType(payload) {
    return { type: FETCH_ASSET_DISPLAY_TYPE_REDUX, payload }
};
export function addCampaignStatus(payload) {
    return { type: FETCH_CAMPAIGN_STATUS_REDUX, payload }
};
export function addCampaigns(payload) {
    return { type: STORED_CAMPAIGN_REDUX, payload }
};
export function addAdvertisements(payload) {
    return { type: STORED_ADVERTISEMENT_REDUX, payload }
};
export function addAssets(payload) {
    return { type: STORED_ASSET_REDUX, payload }
};
export function addVendors(payload) {
    return { type: STORED_VENDOR_REDUX, payload }
};
export function addTimeStamp(payload) {
    return { type: STORED_TIMESTAMP, payload }
};
