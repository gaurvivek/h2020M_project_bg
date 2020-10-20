import { createStore } from "redux";
import rootReducer from "../reducers/index";
import StateLoader from "../StateLoader";

const stateLoader = new StateLoader();
const store = createStore(rootReducer, stateLoader.loadState());

store.subscribe(() => {
    stateLoader.saveState(store.getState());
});
export default store;