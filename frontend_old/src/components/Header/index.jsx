import React from 'react';
import { connect } from 'react-redux';
import {
    Navbar,
    Container,
} from 'reactstrap';

import cn from 'classnames';

const mapStateToProps = (state, ownProps) => ({
    title: state.data.get('title'),
    ...ownProps,
});

const mapDispatchToProps = () => ({
});

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dropdownOpen: false,
            color: "transparent"
        };
    }

    openSidebar() {
        document.documentElement.classList.toggle("nav-open");
        this.refs.sidebarToggle.classList.toggle("toggled");
    }

    render() {
        return (
            // add or remove classes depending if we are on full-screen-maps page or not
            <Navbar
                color={this.state.color}
                expand="lg"
                className={cn("navbar-absolute fixed-top", "navbar-transparent")}
            >
                <Container fluid>
                    <div className="navbar-wrapper">
                        <div className="navbar-toggle">
                            <button
                                type="button"
                                ref="sidebarToggle"
                                className="navbar-toggler"
                                onClick={() => this.openSidebar()}
                            >
                                <span className="navbar-toggler-bar bar1" />
                                <span className="navbar-toggler-bar bar2" />
                                <span className="navbar-toggler-bar bar3" />
                            </button>
                        </div>
                        <div className="title">
                            CSE 496/896 Standings{this.props.title ? `: ${this.props.title}` : null}
                        </div>
                    </div>
                </Container>
            </Navbar>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header);
