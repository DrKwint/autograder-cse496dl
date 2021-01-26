import React, { Component } from 'react';

import Header from "components/Header";
import Footer from "components/Footer";
import Sidebar from "components/Sidebar";

import Dashboard from "containers/Dashboard";

import PerfectScrollbar from 'perfect-scrollbar';

var ps;

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
        }
    }
    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(this.refs.mainPanel);
            document.body.classList.toggle("perfect-scrollbar-on");
        }
    }
    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
            document.body.classList.toggle("perfect-scrollbar-on");
        }
    }

    handleActiveClick = (color) => {
        this.setState({ activeColor: color });
    }
    handleBgClick = (color) => {
        this.setState({ backgroundColor: color });
    }

    render() {
    return (
        <div className="App">
            <div className="wrapper">
                <Sidebar
                    {...this.props}
                    bgColor={this.state.backgroundColor}
                    activeColor={this.state.activeColor}
                />
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <Dashboard />
                    <Footer fluid />
                </div>
            </div>
        </div>
    );
  }
}

export default App;
