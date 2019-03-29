import Immutable from 'immutable';

import {
    FETCH_SCORE_DATA,
    UPDATE_DATA_TYPE,
    UPDATE_SCORE_DATA,
    UPDATE_TITLE,
} from 'actions/dataActions';

const compareStrings = (str1, str2) => (str1 > str2) ? 1 : ((str1 < str2) ? -1 : 0);

const initialState = Immutable.Map({
    scoreData: Immutable.List(),
    retrievingData: true,
    title: "",
    dataType: "classification",
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
            s.set('scoreData', Immutable.List());
            Object.entries(action.data)
                .sort((e1, e2) => compareStrings(e1[0], e2[0]))
                .forEach(entry => {
                    const threeDaysAgo = new Date();
                    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

                    const timestamps = Object.entries(entry[1])
                          .sort((a,b) => a[0] - b[0])
                          .filter(a => msToDate(parseInt(a[0], 10)) > threeDaysAgo);

                    const meta_data = timestamps.length > 0 ? timestamps[timestamps.length - 1][1].metadata : {};

                    const teamData = {
                        name: entry[0],
                        meta_data,
                    };

                    if (state.get('dataType') === 'classification') {
                        const train_steps = timestamps.map(timestamp => ({
                            x: msToDate(parseInt(timestamp[0], 0)),
                            y: timestamp[1].train.accuracy
                        }));
                        const test_steps = timestamps.map(timestamp => ({
                            x: msToDate(parseInt(timestamp[0], 10)),
                            y: timestamp[1].test.accuracy
                        }));
                        const train_matrix = timestamps.length > 0 ? timestamps[timestamps.length - 1][1].train.confusion_matrix : [[]];
                        const test_matrix = timestamps.length > 0 ? timestamps[timestamps.length - 1][1].test.confusion_matrix : [[]];
                        teamData['train_steps'] = train_steps;
                        teamData['test_steps'] = test_steps;
                        teamData['train_matrix'] = train_matrix;
                        teamData['test_matrix'] = test_matrix;
                    } else if (state.get('dataType') === 'value') {
                        const test_steps = timestamps
                              .map(timestamp => ({
                                  x: msToDate(parseInt(timestamp[0], 10)),
                                  y: timestamp[1].test.total_reward,
                              }))
                              .filter(d => d.y !== undefined);
                        teamData['test_steps'] = test_steps;
                    }

                    s.updateIn(['scoreData'], (d) => d.push(Immutable.fromJS(teamData)));
                });

        });

    case UPDATE_TITLE:
        return state.set('title', action.title);

    case UPDATE_DATA_TYPE:
        return state.set('dataType', action.d_type);

    default:
        return state;
    }
};

export default data;
