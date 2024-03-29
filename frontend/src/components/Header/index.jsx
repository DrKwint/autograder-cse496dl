import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const mapStateToProps = (state) => ({
    title: state.data.get('title'),
});

const mapDispatchToProps = () => ({
});

class Header extends React.Component {
    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow:1}}>
                        {this.props.title ? this.props.title : "Loading..."}
                    </Typography>
                    <Typography>
                        Last updated {this.props.lastModified ? moment(this.props.lastModified).fromNow() : null}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header);
