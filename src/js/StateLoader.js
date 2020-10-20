import {
    REDUX_STATE_DATA
  } from "../__helpers/constants";
export default class StateLoader {

    loadState() {
        try {
            let serializedState = localStorage.getItem(REDUX_STATE_DATA);

            if (serializedState === null) {
                return this.initializeState();
            }

            return JSON.parse(serializedState);
        }
        catch (err) {
            return this.initializeState();
        }
    }

    saveState(state) {
        try {
            let serializedState = JSON.stringify(state);
            localStorage.setItem(REDUX_STATE_DATA, serializedState);

        }
        catch (err) {
        }
    }

    initializeState() {
        return {
            //state object
        };
    }
}