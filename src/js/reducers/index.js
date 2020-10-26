import {
    REDUX_LOAD,
    DATA_LOADING_REDUX,
    STORED_TIMESTAMP,
    USER_INFO_REDUX,

    FETCH_COUNTRY_LIST,
    FETCH_CATEGORY_LIST,
    FETCH_GLOBAL_LIST,
} from "../constants/action-types";

const initialState = {
    reduxLoadFlag: false,
    userInfo: [],
    loadingFlag: false,
    timestamp: "",

    categoryList: [],
    countryList: [],
    globalList: [],
};

function rootReducer(state = initialState, action) {
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

        case DATA_LOADING_REDUX:
            const loadingFlag = action.payload;
            return {
                ...state,
                loadingFlag
            };

        case STORED_TIMESTAMP:
            const timestamp = action.payload;
            return {
                ...state,
                timestamp
            };


            // OTHER REDUX METHODS
        case FETCH_CATEGORY_LIST:
            const categoryList = action.payload;
            return {
                ...state,
                categoryList
            };

        case FETCH_COUNTRY_LIST:
            const countryList = action.payload;
            return {
                ...state,
                countryList
            };
        case FETCH_GLOBAL_LIST:
            const globalList = action.payload;
            return {
                ...state,
                globalList
            };

        default:
            break;
    }
    return state;
}
export default rootReducer;