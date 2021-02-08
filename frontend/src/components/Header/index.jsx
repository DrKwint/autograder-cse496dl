import React from 'react';
import { connect } from 'react-redux';

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
                    <Typography variant="h6">
                        {this.props.title ? this.props.title : "Loading..."}
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
