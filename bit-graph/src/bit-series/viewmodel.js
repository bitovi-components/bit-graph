import can from "can";
import 'can/map/define/';
import d3 from "d3";

export default can.Map.extend({
    define: {
        /**
         * @property {can.List} series.viewModel.serializedData serializedData
         * @parent series/viewModel
         * @description Serialized version of data. This is populated automatically when data changes.
         * @option {can.List} Defaults to `undefined`.
         */
        serializedData: {
            get: function() {
                return this.attr('data') && this.attr('data').serialize() || null;
            },
        },

        /**
         * @property {Number} series.viewModel.seriesLength seriesLength
         * @parent series/viewModel
         * @description Length of the series' data.
         * @option {Number} Defaults to `undefined`.
         */
        seriesLength: {
            // TODO should this have a default value of 0?
            get: function() {
                return this.attr('data') && this.attr('data').attr('length') || 0;
            }
        },

        /**
         * @property {Number} series.viewModel.lowestValue lowestValue
         * @parent series/viewModel
         * @description Lowest value of the series' data.
         * @option {Number} Defaults to `undefined`.
         */
        lowestValue: {
            // TODO should this default to 0?
            get: function() {
                var lowestValue = this.attr('serializedData') && d3.min(this.attr('serializedData'));
                return (lowestValue || lowestValue === 0) ? lowestValue : null;
            }
        },

        /**
         * @property {Number} series.viewModel.highestValue highestValue
         * @parent series/viewModel
         * @description Hightest value of the series' data.
         * @option {Number} Defaults to `undefined`.
         */
        highestValue: {
            // TODO should this default to 0?
            get: function() {
                var highestValue = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                return (highestValue || highestValue === 0) ? highestValue : null;
            }
        },

        /**
         * @property {Object} series.viewModel.line line
         * @parent series/viewModel
         * @description D3 line object representing the series' data, scaled using the parent component (`bit-graph`)'s X and Y scales.
         * @option {Number} Defaults to `undefined`.
         */
        line: {
            // TODO should this have a default value of null?
            get: function() {
                if(this.attr('graph') && this.attr('seriesLength') && this.attr('lowestValue') !== null && this.attr('highestValue') !== null) {
                    if(this.attr('graph').attr('normalize')) {
                        // X scale will fit all values from data[] within pixels 0-w
                        var x = d3.scale.linear().domain([0, this.attr('seriesLength')-1]).range([0, this.attr('graph').attr('width')]);
                        // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                        var y = d3.scale.linear().domain([this.attr('lowestValue'), this.attr('highestValue')]).range([this.attr('graph').attr('height'), 0]);
                    } else {
                        var x = this.attr('graph').attr('xScale');
                        var y = this.attr('graph').attr('yScale');
                    }

                    // create a line function that can convert this.attr('data')[] into x and y points
                    var line = d3.svg.line()
                        // assign the X function to plot our line as we wish
                        .x(function(d,i) {
                            // verbose logging to show what's actually being done
                            // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                            // return the X coordinate where we want to plot this datapoint
                            return x(i).toPrecision(8);
                        })
                        .y(function(d) {
                            // verbose logging to show what's actually being done
                            // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                            // return the Y coordinate where we want to plot this datapoint
                            return y(d).toPrecision(8);
                        });

                    // TODO return the attribute instead?
                    return line(this.attr('data'));
                } else {
                    return null;
                }
            }
        },

        /**
         * @property {can.List} series.viewModel.data data
         * @parent series/viewModel
         * @description Raw series' data. All values are converted to Numbers.
         * @option {can.List} Defaults to `undefined`.
         */
        data: {
            get: function(value) {
                return this.convertListItemsToNumbers(value);
            }
        }
    },

    /**
     * @property {String} series.viewModel.color color
     * @parent series/viewModel
     * @description Color of the series' line. Can be a hex value or a supported color name.
     * @option {String} Defaults to `steelblue`.
     */
    color: "steelblue",

    /**
     * @property {BitGraphVM} series.viewModel.graph graph
     * @parent series/viewModel
     * @description Parent container object (`bit-graph`) of the series. Set automatically when inserted.
     * @option {BitGraphVM} Defaults to `null`.
     */
    graph: null,

    /**
     * @function series.viewModel.convertListItemsToNumbers convertListItemsToNumbers
     * @parent series/viewModel
     * @description Converts list items to float values. Removes NaN values.
     * @param {can.List} listItems List who's contents are to be converted to numbers.
     */
    convertListItemsToNumbers: function(listItems) {
        if(listItems) {
            listItems.each(function(data, index) {
                var floatValue = Number.parseFloat(data);
                if(!Number.isNaN(floatValue)) {
                    listItems[index] = floatValue;
                } else {
                    listItems.splice(index, 1);
                }
            });
        }
        return listItems;
    }
});