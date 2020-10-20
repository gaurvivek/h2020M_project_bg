import store from "../js/store/index";
import { addArticle,
    dataLoadingFlag,
    addUSerUInfo,
    addAdNetwork,
    addCategories,
    addAdStatus,
    addAdMedium,
    adAdType,
    addAssetType,
    addAssetDisplayType,
    addCampaignStatus,
    addCampaigns,
    addAdvertisements,
    addAssets,
    addVendors,
    addTimeStamp, } from "../js/actions/index";

window.store = store;
window.addArticle = addArticle;
window.dataLoadingFlag = dataLoadingFlag;
window.addUSerUInfo = addUSerUInfo;
window.addCategories = addCategories;
window.addAdStatus = addAdStatus;
window.addAdNetwork = addAdNetwork;
window.addAdMedium = addAdMedium;
window.adAdType = adAdType;
window.addAssetType = addAssetType;
window.addAssetDisplayType = addAssetDisplayType;
window.addCampaignStatus = addCampaignStatus;
window.addCampaigns = addCampaigns;
window.addAdvertisements = addAdvertisements;
window.addAssets = addAssets;
window.addVendors = addVendors;
window.addTimeStamp = addTimeStamp;