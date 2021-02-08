import Immutable from 'immutable';

import {
    FETCH_SCORE_DATA,
    UPDATE_DATA_TYPE,
    UPDATE_SCORE_DATA,
    UPDATE_TITLE,
    UPDATE_LAST_MODIFIED,
} from 'actions/dataActions';

const compareStrings = (str1, str2) => (str1 > str2) ? 1 : ((str1 < str2) ? -1 : 0);

const initialState = Immutable.Map({
    scoreData: Immutable.List(),
    retrievingData: true,
    title: "",
    dataType: "classification",
    lastModified: null,
});

const msToDate = (ms) => {
    let d = new Date(0);
    d.setUTCMilliseconds(ms);
    return d;
};

const data = (state = initialState, action) => {
    switch (action.type) {

    case FETCH_SCORE_DATA:
        return state.set('retrievingData', true);

    case UPDATE_SCORE_DATA:
        return state.withMutations(s => {
            s.set('retrievingData', false);
            s.set('scoreData', Immutable.fromJS(action.data));
        });

    case UPDATE_TITLE:
        return state.set('title', action.title);

    case UPDATE_DATA_TYPE:
        return state.set('dataType', action.d_type);

    case UPDATE_LAST_MODIFIED:
        return state.set('lastModified', action.lastModified);

    default:
        return state;
    }
};

export default data;
