import React, { Component } from 'react';

import Header from "containers/Header";

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
                    <div className="main-panel" ref="mainPanel">
                        <Header />
                        <Dashboard />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
