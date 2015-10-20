/*bit-graph@0.0.1#bit-series/viewmodel*/
'use strict';
var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
};
var can = _interopRequire(require('can'));
require('can/map/define/define');
var d3 = _interopRequire(require('d3'));
module.exports = can.Map.extend({
    define: {
        serializedData: {
            get: function () {
                return this.attr('data') && this.attr('data').serialize() || null;
            }
        },
        seriesLength: {
            get: function () {
                return this.attr('data') && this.attr('data').attr('length') || 0;
            }
        },
        lowestValue: {
            get: function () {
                var lowestValue = this.attr('serializedData') && d3.min(this.attr('serializedData'));
                return lowestValue || lowestValue === 0 ? lowestValue : null;
            }
        },
        highestValue: {
            get: function () {
                var highestValue = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                return highestValue || highestValue === 0 ? highestValue : null;
            }
        },
        line: {
            get: function () {
                if (this.attr('graph') && this.attr('seriesLength') && this.attr('lowestValue') !== null && this.attr('highestValue') !== null) {
                    if (this.attr('graph').attr('normalize')) {
                        var x = d3.scale.linear().domain([
                                0,
                                this.attr('seriesLength') - 1
                            ]).range([
                                0,
                                this.attr('graph').attr('width')
                            ]);
                        var y = d3.scale.linear().domain([
                                this.attr('lowestValue'),
                                this.attr('highestValue')
                            ]).range([
                                this.attr('graph').attr('height'),
                                0
                            ]);
                    } else {
                        var x = this.attr('graph').attr('xScale');
                        var y = this.attr('graph').attr('yScale');
                    }
                    var line = d3.svg.line().x(function (d, i) {
                            return x(i).toPrecision(8);
                        }).y(function (d) {
                            return y(d).toPrecision(8);
                        });
                    return line(this.attr('data'));
                } else {
                    return null;
                }
            }
        },
        data: {
            get: function (value) {
                return this.convertListItemsToNumbers(value);
            }
        }
    },
    color: 'steelblue',
    graph: null,
    convertListItemsToNumbers: function (listItems) {
        if (listItems) {
            listItems.each(function (data, index) {
                var floatValue = Number.parseFloat(data);
                if (!Number.isNaN(floatValue)) {
                    listItems[index] = floatValue;
                } else {
                    listItems.splice(index, 1);
                }
            });
        }
        return listItems;
    }
});