import { connect } from 'react-redux';

import Dashboard from 'views/Dashboard';
import { fetchScoreData } from 'actions/dataActions';

const mapStateToProps = (state) => ({
    scoreData: state.data.get('scoreData'),
    dataType: state.data.get('dataType'),
    retrievingData: state.data.get('retrievingData'),
});

const mapDispatchToProps = (dispatch) => ({
    fetchScoreData: () => { dispatch(fetchScoreData()); },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
