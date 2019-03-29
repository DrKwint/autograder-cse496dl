export const FETCH_SCORE_DATA = 'FETCH_SCORE_DATA';
export const UPDATE_SCORE_DATA = 'UPDATE_SCORE_DATA';
export const UPDATE_TITLE = 'UPDATE_TITLE';
export const UPDATE_DATA_TYPE = 'UPDATE_DATA_TYPE';

export const updateScoreData = (data) => ({
    type: UPDATE_SCORE_DATA,
    data,
});

export const updateTitle = (title) => ({
    type: UPDATE_TITLE,
    title,
});

export const updateDataType = (d_type) => ({
    type: UPDATE_DATA_TYPE,
    d_type,
});

export const fetchScoreData = () => (dispatch) => {
    const configHeaders = new Headers();
    configHeaders.append('pragma', 'no-cache');
    configHeaders.append('cache-control', 'no-cache');
    const configInit = {
        method: 'GET',
        headers: configHeaders,
    };
    const configRequest = new Request('config.json');

    fetch(configRequest, configInit)
        .then(res => res.json())
        .then(config => {
            dispatch(updateTitle(config.title));
            dispatch(updateDataType(config.type));

            const scoreHeaders = new Headers();
            scoreHeaders.append('pragma', 'no-cache');
            scoreHeaders.append('cache-control', 'no-cache');
            scoreHeaders.append('cache-control', 'no-store');
            const scoreInit = {
                method: 'GET',
                headers: scoreHeaders,
            };
            const scoreRequest = new Request(config.dataPath);

            return fetch(scoreRequest, scoreInit);
        })
        .then(res => res.json())
        .then((data) => dispatch(updateScoreData(data)))
        .catch(console.error);
}
