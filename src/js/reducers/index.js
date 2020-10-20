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
    FETCHED_ADNETWORK_LIST_REDUX,
} from "../constants/action-types";

const initialState = {
    reduxLoadFlag: false,
    articles: [],
    userInfo: [],
    adNetwork: [],
    adNetworkList: [],
    loadingFlag: false,
    adCategories: [],
    adBrands: [],
    adStatus: [],
    adMedium: [],
    adType: [],
    assetType: [],
    assetDisplayType: [],
    campaignStatus: [],
    advertisements: [],
    campaings: [],
    assets: [],
    vendors: [],
    timestamp: "",
};
function rootReducer(state = initialState, action) {
    if (action.type === ADD_ARTICLE) {
        return Object.assign({}, state, {
            articles: state.articles.concat(action.payload)
        });
    }
    switch (action.type) {
        case REDUX_LOAD:
            const reduxLoadFlag = action.payload;
            return {
                ...state,
                reduxLoadFlag
            };

        case USER_INFO_REDUX:
            const userInfo = action.payload;
            return {
                ...state,
                userInfo
            };
                // return Object.assign({}, state, {
                //     userInfo: action.payload
                // });
        case STORED_ADNETWORK_REDUX:
            const adNetwork = action.payload;
            return {
                ...state,
                adNetwork
            };

        case FETCHED_ADNETWORK_LIST_REDUX:
            const adNetworkList = action.payload;
            return {
                ...state,
                adNetworkList
            };

        case DATA_LOADING_REDUX:
            const loadingFlag = action.payload;
            return {
                ...state,
                loadingFlag
            };

        case FETCH_CATEGORIES_REDUX:
            const adCategories = action.payload;
            return {
                ...state,
                adCategories
            };

        case FETCH_BRANDS_REDUX:
            const adBrands = action.payload;
            return {
                ...state,
                adBrands
            };

        case FETCH_AD_STATUS_REDUX:
            const adStatus = action.payload;
            return {
                ...state,
                adStatus
            };

        case FETCH_AD_MEDIUM_REDUX:
            const adMedium = action.payload;
            return {
                ...state,
                adMedium
            };

        case FETCH_AD_TYPE_REDUX:
            const adType = action.payload;
            return {
                ...state,
                adType
            };

        case FETCH_ASSET_TYPE_REDUX:
            const assetType = action.payload;
            return {
                ...state,
                assetType
            };

        case FETCH_ASSET_DISPLAY_TYPE_REDUX:
            const assetDisplayType = action.payload;
            return {
                ...state,
                assetDisplayType
            };

        case FETCH_CAMPAIGN_STATUS_REDUX:
            const campaignStatus = action.payload;
            return {
                ...state,
                campaignStatus
            };

        case STORED_ADVERTISEMENT_REDUX:
            const advertisements = action.payload;
            return {
                ...state,
                advertisements
            };

        case STORED_CAMPAIGN_REDUX:
            const campaings = action.payload;
            return {
                ...state,
                campaings
            };

        case STORED_ASSET_REDUX:
            const assets = action.payload;
            return {
                ...state,
                assets
            };

        case STORED_VENDOR_REDUX:
            const vendors = action.payload;
            return {
                ...state,
                vendors
            };

        case STORED_TIMESTAMP:
            const timestamp = action.payload;
            return {
                ...state,
                timestamp
            };

        default:
            break;
    }
    return state;
}
export default rootReducer;