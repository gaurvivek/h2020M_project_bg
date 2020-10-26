import {
    REDUX_LOAD,
    DATA_LOADING_REDUX,
    STORED_TIMESTAMP,
    USER_INFO_REDUX,

    FETCH_COUNTRY_LIST,
    FETCH_CATEGORY_LIST,
    FETCH_GLOBAL_LIST,
} from "../constants/action-types";

export function reduxLoad(payload) {
    return { type: REDUX_LOAD, payload }
};
export function dataLoadingFlag(payload) {
    return { type: DATA_LOADING_REDUX, payload }
};
export function addTimeStamp(payload) {
    return { type: STORED_TIMESTAMP, payload }
};
export function addUSerUInfo(payload) {
    return { type: USER_INFO_REDUX, payload }
};

export function categoryList(payload) {
    return { type: FETCH_CATEGORY_LIST, payload }
};
export function countryList(payload) {
    return { type: FETCH_COUNTRY_LIST, payload }
};
export function globalLists(payload) {
    return { type: FETCH_GLOBAL_LIST, payload }
};