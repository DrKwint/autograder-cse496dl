import { combineReducers } from 'redux';
import data from 'reducers/data';

const leaderboard = combineReducers({
    data,
});

export default leaderboard;
