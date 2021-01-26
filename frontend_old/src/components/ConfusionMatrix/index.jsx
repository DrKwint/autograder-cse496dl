import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';

function weightedAverage(col1, col2, proportion) {
    const r = (col1[0] * proportion + col2[0] * (1 - proportion)).toFixed(0);
    const g = (col1[1] * proportion + col2[1] * (1 - proportion)).toFixed(0);
    const b = (col1[2] * proportion + col2[2] * (1 - proportion)).toFixed(0);
    return `rgb(${r},${g},${b})`;
}

function calculateBlockWidth(matrix, blockgap) {
    return (100 - blockgap) / matrix.length - blockgap;
}

function calculateMaxMatrixValue(matrix) {
    return matrix ? Math.max(...matrix.map(x => Math.max(...x))) : 0;
}


class Heatmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockwidth: calculateBlockWidth(props.matrix, props.blockgap),
            maxMatrixValue: calculateMaxMatrixValue(props.matrix),
        };
    }

    updateHeight() {
        this.props.updateHeightCallback(this.svg);
    }

    componentDidMount() {
        this.updateHeight(this.svg);
        window.addEventListener('resize', this.updateHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight.bind(this));
    }

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" ref={(el) => {this.svg = el;}}>
                <g>
                    {this.props.matrix.map((row, i) =>
                        row.map((entry, j) =>
                            (<rect
                                 key={`${this.props.mkey}-mat-${i}-${j}`}
                                 width={this.state.blockwidth}
                                 height={this.state.blockwidth}
                                 x={this.props.blockgap + (this.props.blockgap + this.state.blockwidth) * j}
                                 y={this.props.blockgap + (this.props.blockgap + this.state.blockwidth) * i}
                                 style={{fill: weightedAverage([20,20,230],[255,255,255],this.props.matrix[i][j] / this.state.maxMatrixValue)}}
                                 onMouseOver={() => { this.props.onCellMouseOver(i,j); }}
                                 onMouseOut={() => { this.props.onCellMouseOut(); }}
                            />
                            )))}
                </g>
            </svg>
        );
    }
}

class ConfusionMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.heatmap = null;
        this.state = {
            blockwidth: calculateBlockWidth(props.matrix, props.blockgap),
            maxMatrixValue: calculateMaxMatrixValue(props.matrix),
            tooltip_x: 0,
            tooltip_y: 0,
            tooltip_visible: false,
            tooltip_text: "",
        };
        this.updateHeightCallback = this.updateHeightCallback.bind(this);
    }

    onCellMouseOver(i, j) {
        this.setState({
            tooltip_x: (this.props.blockgap + (this.props.blockgap + this.state.blockwidth) * (j + 3/4)) * this.svgDims.width / 100,
            tooltip_y: (this.props.blockgap + (this.props.blockgap + this.state.blockwidth) * (i + 3/4)) * this.svgDims.height / 100,
            tooltip_text: this.props.matrix[i][j],
            tooltip_visible: true,
        });
    }

    onCellMouseOut() {
        this.setState({
            tooltip_visible: false,
        });
    }

    updateHeightCallback(svg) {
        this.svgDims = svg.getBoundingClientRect();
    }

    render() {
        if (!this.props.matrix) return null;

        return (
            <div className={style['confusion-matrix']} style={{minWidth: this.props.width, minHeight: this.props.height}}>
                <Heatmap
                    matrix={this.props.matrix}
                    blockgap={this.props.blockgap}
                    onCellMouseOver={(i,j) => {this.onCellMouseOver(i,j);}}
                    onCellMouseOut={(i,j) => {this.onCellMouseOut(i,j);} }
                    updateHeightCallback={this.updateHeightCallback}
                />
                <div className={style['tooltip']} style={{left: this.state.tooltip_x, top: this.state.tooltip_y, display: (this.state.tooltip_visible) ? null : "none"}} >
                    {this.state.tooltip_text}
                </div>
            </div>
        );
    }
}


ConfusionMatrix.propTypes = {
    mkey: PropTypes.string.isRequired,
    matrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    blockgap: PropTypes.number,
};

ConfusionMatrix.defaultProps = {
    width: 160,
    height: 160,
    blockgap: 2,
};

export default ConfusionMatrix;
