import * as d3 from 'd3';

export function Heatmap(w, h, bgColor, cSchema, haslegend, labs) {
    const boxBorderColor = '#FFFFFF';
    const boxBorderSize = 4;
    const backgroundColor = bgColor;
    var labels = labs;
    const width = w;
    const height = h;
    const boxSize_h = ((height)/labels.length);
    const boxSize_w = ((width)/labels.length);
    const boxInitialColor = '#BBBBBB';
    const animationDuration = 300;
    const legend = haslegend;

    // Configurable properties
    let colorSchema = cSchema;
    let margin = {
        top: 30, right: 80, bottom: 30, left: 30
    };

    let svg;
    let data;
    let colorScale;
    let boxes;

    function exports(_selection) {
        _selection.each(function(_data) {
            data = _data;

            buildScales();
            buildSVG(this);
            drawBoxes();
        });
    }

    function buildContainerGroups() {
        let background = svg.append("rect")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", backgroundColor);

        let container = svg
              .append('g')
                .classed('container-group', true)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('width', width)
                .attr('height',  height);

        if (legend) {
            let legend1 = container
                .append('g')
                .classed('legend', true);

            for (let i = 1; i < colorSchema.length - 1; i++) {
                legend1.append('circle').classed('legendtext', true)
                    .attr('cx', margin.left + width)
                    .attr('cy', 25 * i)
                    .attr('r', 4)
                    .style('opacity', 0.1)
                    .style('fill', colorSchema[i]);

                legend1.append('text').text(i / (colorSchema.length - 1) * 100).classed('legendtext', true)
                    .style('opacity', 0.1)
                    .attr('x', margin.left + width + 25)
                    .attr('y', (25 * i) + 5)
                    .attr('font-size', '14px')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'midle');
            }

            for (let i = 0; i < colorSchema.length; i++) {
                legend1.append('rect').classed('legendtext', true)
                    .attr('x', 2 + (10 * i + i* 3))
                    .attr('y', height + 8)
                    .attr('width', 10)
                    .attr('height', 10)
                    .style('opacity', 0.1)
                    .style('fill', colorSchema[i]);
            }

            // show label on x and y axis
            svg.append('text').text('predicted').classed('legendtext', true)
                .attr('x', width - margin.left/2 - 10)
                .attr('y', height + margin.top + 20)
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'midle')
                .style('opacity', 0.1);

            // show label on x and y axis
            svg.append('text').text('ground truth').classed('legendtext', true)
                //.attr('x', width+margin.left)
                //.attr('y', height + margin.top)
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'midle')
                .attr('transform', 'translate('+(+width+margin.left + 25)+','+(+height-margin.top)+') rotate(270)')
                .style('opacity', 0.1);

            svg.on('mouseover', function(d) {
                d3.selectAll('.legendtext').transition()
                    .duration(animationDuration).style('opacity', 1.0);
            }).on('mouseout', function (d) {
                d3.selectAll('.legendtext').transition()
                    .duration(animationDuration).style('opacity', 0.1);
            });

        }

        container
          .append('g')
            .classed('chart-group', true);

        container
          .append('g')
            .classed('metadata-group', true);

    }

    function buildScales() {
        colorScale = d3.scaleLinear()
                .range([colorSchema[0], colorSchema[colorSchema.length-1]])
                .domain(d3.extent(data, function (d) { return d[2] }))
                .interpolate(d3.interpolateHslLong);
    }

    function buildSVG(container) {
        if (!svg) {
            svg = d3.select(container)
                  .append('svg')
                    .classed('heatmap', true);

            buildContainerGroups();
        }

        svg
            .attr('width', width + margin.left + margin.right)
            .attr('height',  height + margin.top + margin.bottom);
    }

    d3.selection.prototype.moveUp = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    function drawBoxes() {
        boxes = svg.select('.chart-group').selectAll('.box').data(data);

        // draw boxes
        boxes.enter()
          .append('rect')
            .classed('box', true)
            .attr('width', boxSize_w)
            .attr('height', boxSize_h)
            .attr('x', function (d) { return d[1] * boxSize_w; })
            .attr('y', function (d) { return d[0] * boxSize_h; })
            .style('opacity', 0.2)
            .style('fill', boxInitialColor)
            .style('stroke', boxBorderColor)
            .style('stroke-width', boxBorderSize)
            .style('z-index', 0)
            .style('shape-rendering',"crispEdges")
            .transition()
            .duration(animationDuration)
            .style('fill', function (d) { return colorScale(d[2]); })
            .style('opacity', 1);

        // show the text of value above the cell
        svg.selectAll('.box').on('mouseover', function(d) {

            // get the position of the clicked cell
            var xPos = parseFloat(d3.select(this).attr('x'));
            var yPos = parseFloat(d3.select(this).attr('y'));

            // move the cell to the front and make transition with stroke
            d3.select(this).moveUp();
            d3.select(this).transition()
            .duration(animationDuration).style('stroke', 'white')
                          .style('stroke-width', boxBorderSize*2);

            // show label on x and y axis
            svg.append('text').text(labels[d[1]]).classed('corrlabelx', true)
                .attr('x', margin.left + width/2)
                .attr('y', margin.top/2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'midle');

            svg.append('text').text(labels[d[0]]).classed('corrlabely', true)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'midle')
                .attr('transform', 'translate('+margin.left/2+','+(+height/2+margin.top)+') rotate(270)');

        }).on("mousemove", function(d)
            {
                // show the tooltip
                const coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];
                d3.selectAll('.tooltip').remove();

                svg.append('rect').classed('tooltip', true)
                .attr('x', x + 0 + margin.left)
                .attr('y', y - 30 + margin.top)
                .attr('width', 60)
                .attr('height', 20)
                .attr('fill', 'rgba(200, 200, 200, 0.5)')
                .attr('stroke', 'black');

                svg.append('text').classed('tooltip', true)
                .attr('x', x + 30 + margin.left)
                .attr('y', y - 15 + margin.top)
                .attr('text-anchor','middle')
                .attr('fill', 'black')
                .attr('stroke', 'black')
                .text(d3.format('.2f')(d[2]*100) + ' %');
            }
        ).on('mouseout', function(d) {
            d3.select('#corrtext').remove();
            d3.select(this).transition()
                .duration(animationDuration)
                .style('stroke', boxBorderColor)
                .style('stroke-width', boxBorderSize)
                .style('z-index', 99);

            d3.selectAll('.tooltip').remove();
            d3.selectAll('.corrlabelx').remove();
            d3.selectAll('.corrlabely').remove();
        });
        boxes.exit().remove();
    }

    // API
    exports.colorSchema = function(_x) {
        if (!arguments.length) {
            return colorSchema;
        }
        colorSchema = _x;

        return this;
    };

    exports.height = function(_x) {
        if (!arguments.length) {
            return height;
        }
        height = _x;

        return this;
    };

    exports.margin = function(_x) {
        if (!arguments.length) {
            return margin;
        }
        margin = _x;

        return this;
    };

    exports.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = _x;

        return this;
    };

    return exports;
};
