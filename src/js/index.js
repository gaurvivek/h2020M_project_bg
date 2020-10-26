import store from "../js/store/index";
import {
    dataLoadingFlag,
    addUSerUInfo,
    addTimeStamp,

    categoryList,
    countryList,
    // globalList,
} from "../js/actions/index";

window.store = store;
window.dataLoadingFlag = dataLoadingFlag;
window.addUSerUInfo = addUSerUInfo;
window.addTimeStamp = addTimeStamp;

window.categoryList = categoryList;
window.countryList = countryList;
// window.globalList = globalList;