import { connect } from 'react-redux';

import Header from 'components/Header';

const mapStateToProps = (state) => ({
    title: state.data.get('title'),
    lastModified: state.data.get('lastModified'),
    retrievingData: state.data.get('retrievingData'),
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
