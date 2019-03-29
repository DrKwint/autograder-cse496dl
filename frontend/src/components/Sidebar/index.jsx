import React from "react";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import { connect } from 'react-redux';
import PerfectScrollbar from "perfect-scrollbar";

import cn from 'classnames';
import style from './style.scss';

var ps;

const mapStateToProps = (state, ownProps) => ({
    scoreData: state.data.get('scoreData'),
    retrievingData: state.data.get('retrievingData'),
    ...ownProps
});

const mapDispatchToProps = (dispatch) => ({
});

class Sidebar extends React.Component {
    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(this.refs.sidebar, {
                suppressScrollX: true,
                suppressScrollY: false
            });
        }
    }
    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
        }
    }
    render() {
        return (
            <div className="sidebar" data-color={this.props.bgColor} data-active-color={this.props.activeColor}>
                <div className="logo">
                    <a className={cn("simple-text", "logo-normal title", style['title'])} href="#class-comparison">
                        Teams
                    </a>
                </div>
                <div className="sidebar-wrapper" ref="sidebar">
                    <Nav>
                        {this.props.scoreData.toJS().map(team => (
                            <li key={`sidebar-${team.name}`} >
                                <a href={`#team-${team.name}`}>
                                    <p>{team.name}</p>
                                </a>
                            </li>
                        ))}
                    </Nav>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Sidebar);
