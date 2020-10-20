/*!

All API path using in the application
*/

import {
  ADNETWORK_ID_SLUG,
  CAMPAIGN_ID_SLUG,
  ASSET_ID_SLUG,
  VENDOR_ID_SLUG,
  ADVERTISEMENT_ID_SLUG
} from "__helpers/constants";

// core components/views for RTL layout

// const liveApiEndPoin = "https://asgcp-int.adpersistence.com";
const liveApiEndPoin = window._env_.API_URL
// const apiEndPoin = "http://34.254.74.148/api/api.php?path=";

export const apiPath = {
  clientToken: `${liveApiEndPoin}/oauth/client`,
  refreshClientToken: `${liveApiEndPoin}/oauth/user-reauthorize`,
  login: `${liveApiEndPoin}/oauth/pass`,
  signup: `${liveApiEndPoin}/identity/profile`, // POST Request
  profile: `${liveApiEndPoin}/identity/profile`, // GET Request
  profileImage: `${liveApiEndPoin}/identity/profile/user/imageRef`, // GET Request
  userReauthorize: `${liveApiEndPoin}/oauth/user-reauthorize`,
  profileChangePassword: `${liveApiEndPoin}/identity/profile/password`,
  forgotPassword: `${liveApiEndPoin}/forgot-password`,
  resetPassword: `${liveApiEndPoin}/reset-password`,
  adnetwork: `${liveApiEndPoin}/identity/profile/adnetwork`,
  manageAdnetwork: `${liveApiEndPoin}/identity/profile/adnetwork/${ADNETWORK_ID_SLUG}`,
  addCampaign: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/campaign`,
  addEditCampaign: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/campaign/${CAMPAIGN_ID_SLUG}`,
  /* campaign: `${liveApiEndPoin}/adnetwork/campaign`, */
  listCampaign: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/campaign`,
  apiListAdvertisement: `${liveApiEndPoin}/adnetwork/advertisement`,
  addAdvertisement: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/advertisement`,
  editAdvertisement: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/advertisement/${ADVERTISEMENT_ID_SLUG}`,
  vendors: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/vendor`,
  manageVendor: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/vendor/${VENDOR_ID_SLUG}`,
  assets: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/asset`,
  manageAssets: `${liveApiEndPoin}/adnetwork/${ADNETWORK_ID_SLUG}/asset/${ASSET_ID_SLUG}`,
  fetchAnalytics: `${liveApiEndPoin}/analytics/adnetwork/${ADNETWORK_ID_SLUG}/campaign/${CAMPAIGN_ID_SLUG}`,
  fetchBrands: `${liveApiEndPoin}/preference/brand`,
  fetchCategory: `${liveApiEndPoin}/preference/category`,


  advertisementType: `${liveApiEndPoin}/adnetwork/advertisement/adType`,
  advertisementMedium: `${liveApiEndPoin}/adnetwork/advertisement/adMedium`,
  advertisementStatus: `${liveApiEndPoin}/adnetwork/advertisement/adStatus`,

  assetDisplayType: `${liveApiEndPoin}/adnetwork/asset/displayType`,
  assetType: `${liveApiEndPoin}/adnetwork/asset/assetType`,

  compaignStatus: `${liveApiEndPoin}/adnetwork/campaign/campaignStatus`,
};
// export const apiPath = {
//   login: `${apiEndPoin}login`,
//   signup: `${apiEndPoin}signup`,
//   forgotPassword: `${apiEndPoin}users?q=`,
//   resetPassword: `${apiEndPoin}reset-password`,
//   adnetwork: `${apiEndPoin}adnetwork`,
//   listCampaign: `${apiEndPoin}campaign`,
//   apiListAdvertisement: `${apiEndPoin}advertisement`,
//   //addEditCampaign: `${apiEndPoin}adnetwork/ADNETWORK_ID_SLUG?embed=campaigns`,
//   addEditCampaign: `${apiEndPoin}campaign/`,
//   profile: `${apiEndPoin}profile`,
//   profileChangePassword: `${apiEndPoin}profile/password`,
//   vendors: `${apiEndPoin}vendors`,
//   assets: `${apiEndPoin}assets`,
// };

// const {
//     json,
//     send,
//     createError,
//     run
// } = require('micro')
// const fetch = require('isomorphic-unfetch')

// const login = async (req, res) => {
//     const {
//         username
//     } = await json(req)
//     const url = `https://api.github.com/users/${username}`

//     try {
//         const response = await fetch(url)
//         if (response.ok) {
//             const {
//                 id
//             } = await response.json()
//             send(res, 200, {
//                 token: id
//             })
//         } else {
//             send(res, response.status, response.statusText)
//         }
//     } catch (error) {
//         throw createError(error.statusCode, error.statusText)
//     }
// }

// const {
//     send,
//     createError,
//     run
// } = require('micro')
// const fetch = require('isomorphic-unfetch')

// const profile = async (req, res) => {
//     if (!('authorization' in req.headers)) {
//         throw createError(401, 'Authorization header missing')
//     }

//     const auth = await req.headers.authorization
//     const {
//         token
//     } = JSON.parse(auth)
//     const url = `https://api.github.com/user/${token}`

//     try {
//         const response = await fetch(url)

//         if (response.ok) {
//             const js = await response.json()
//             // Need camelcase in the frontend
//             const data = Object.assign({}, {
//                 avatarUrl: js.avatar_url
//             }, js)
//             send(res, 200, {
//                 data
//             })
//         } else {
//             send(res, response.status, response.statusText)
//         }
//     } catch (error) {
//         throw createError(error.statusCode, error.statusText)
//     }
// }

// module.exports = (req, res) => run(req, res, profile)
