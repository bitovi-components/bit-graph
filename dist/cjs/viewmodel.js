/*bit-graph@0.0.1#viewmodel*/
'use strict';
var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
};
var can = _interopRequire(require('can'));
require('can/map/define/define');
var d3 = _interopRequire(require('d3'));
module.exports = can.Map.extend({
    define: {
        margins: {
            value: [
                20,
                20,
                20,
                80
            ],
            type: '*'
        },
        width: {
            value: 768,
            get: function (val) {
                var margins = this.attr('margins');
                return val - margins[1] - margins[3];
            }
        },
        height: {
            value: 400,
            get: function (val) {
                var margins = this.attr('margins');
                return val - margins[0] - margins[2];
            }
        },
        transform: {
            get: function () {
                var margins = this.attr('margins');
                return 'translate(' + margins[3] + ',' + margins[0] + ')';
            }
        },
        graphContainerElement: { type: '*' },
        lineContainerElement: { type: '*' },
        axisContainerElement: { type: '*' },
        normalize: {
            value: false,
            type: 'htmlbool'
        },
        seriesSerialized: {
            get: function () {
                return this.attr('series').serialize();
            }
        },
        longestSeriesLength: {
            value: 0,
            get: function () {
                if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var longestSeriesLength = 0;
                    this.attr('series').each(function (s) {
                        longestSeriesLength = Math.max(longestSeriesLength, s.attr('seriesLength'));
                    });
                    return longestSeriesLength;
                }
                return 0;
            }
        },
        lowestSeriesValue: {
            value: 0,
            get: function () {
                if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var lowestSeriesValue = Infinity;
                    this.attr('series').each(function (s) {
                        lowestSeriesValue = Math.min(lowestSeriesValue, s.attr('lowestValue'));
                    });
                    return lowestSeriesValue;
                }
                return 0;
            }
        },
        highestSeriesValue: {
            value: 0,
            get: function () {
                if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var highestSeriesValue = -Infinity;
                    this.attr('series').each(function (s) {
                        highestSeriesValue = Math.max(highestSeriesValue, s.attr('highestValue'));
                    });
                    return highestSeriesValue;
                }
                return 0;
            }
        },
        xScale: {
            value: null,
            type: '*',
            get: function () {
                var domainEndValue = this.attr('normalize') ? 5 : this.attr('longestSeriesLength');
                return d3.scale.linear().domain([
                    0,
                    domainEndValue - 1
                ]).range([
                    0,
                    this.attr('width')
                ]);
            }
        },
        yScale: {
            value: null,
            type: '*',
            get: function () {
                var normalize = this.attr('normalize'), domainBeginValue = normalize ? 0 : this.attr('lowestSeriesValue'), domainEndValue = normalize ? 5 : this.attr('highestSeriesValue');
                return d3.scale.linear().domain([
                    domainBeginValue,
                    domainEndValue
                ]).range([
                    this.attr('height'),
                    0
                ]);
            }
        }
    },
    series: [],
    clearContainer: function (container, cb) {
        var counter = 0;
        if (container) {
            container.selectAll('*').call(function (selection) {
                counter = selection.size();
                if (counter === 0) {
                    cb();
                }
            }).transition().duration(0).each('end', function () {
                counter--;
                if (counter === 0) {
                    cb();
                }
            }).remove();
        }
    },
    clearGraphLines: function (cb) {
        this.clearContainer(this.attr('lineContainerElement'), cb);
    },
    refreshGraph: function () {
        var _this = this;
        this.attr('seriesSerialized');
        this.clearGraphLines(function () {
            var lineContainerElement = _this.attr('lineContainerElement');
            can.each(_this.attr('series'), function (series) {
                if (series.attr('line')) {
                    lineContainerElement.append('svg:path').attr('d', series.attr('line')).style('stroke', series.attr('color'));
                }
            });
        });
    },
    clearAxes: function (cb) {
        this.clearContainer(this.attr('axisContainerElement'), cb);
    },
    refreshAxes: function () {
        var _this = this;
        this.clearAxes(function () {
            var axisContainerElement = _this.attr('axisContainerElement');
            var xAxis = d3.svg.axis().scale(_this.attr('xScale')).tickSize(-_this.attr('height')).tickSubdivide(true);
            var yAxisLeft = d3.svg.axis().scale(_this.attr('yScale')).ticks(4).orient('left');
            if (_this.attr('normalize')) {
                xAxis.tickFormat('');
                yAxisLeft.tickFormat('');
            }
            axisContainerElement.append('svg:g').attr('class', 'x axis').attr('width', _this.attr('width')).attr('transform', 'translate(0,' + _this.attr('height') + ')').call(xAxis);
            axisContainerElement.append('svg:g').attr('class', 'y axis').attr('height', _this.attr('height')).attr('transform', 'translate(-25,0)').call(yAxisLeft);
        });
    },
    renderBaseGraph: function (graphBaseElement) {
        var margins = this.attr('margins');
        var graphContainerElement = graphBaseElement.append('svg:svg').attr('width', this.attr('width') + margins[1] + margins[3]).attr('height', this.attr('height') + margins[0] + margins[2]).append('svg:g').attr('transform', this.attr('transform'));
        this.attr('graphContainerElement', graphContainerElement);
        this.attr('axisContainerElement', graphContainerElement.append('svg:g').attr('class', 'axis'));
        this.attr('lineContainerElement', graphContainerElement.append('svg:g').attr('class', 'lines'));
        this.refreshAxes();
        this.refreshGraph();
    },
    addSeries: function (series) {
        can.batch.start();
        this.attr('series').push(series);
        can.batch.stop();
    },
    removeSeries: function (series) {
        var seriesList = this.attr('series');
        can.batch.start();
        seriesList.splice(seriesList.indexOf(series), 1);
        can.batch.stop();
    }
});