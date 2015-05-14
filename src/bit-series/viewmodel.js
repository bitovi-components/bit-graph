import can from "can";
import 'can/map/define/';
import d3 from "d3";

export default can.Map.extend({
    define: {
        serializedData: {
            get: function() {
                return this.attr('data') && this.attr('data').serialize() || null;
            },
        },
        seriesLength: {
            get: function() {
                return this.attr('data') && this.attr('data').attr('length') || 0;
            }
        },
        lowestValue: {
            get: function() {
                var lowestValue = this.attr('serializedData') && d3.min(this.attr('serializedData'));
                return (lowestValue || lowestValue === 0) ? lowestValue : null;
            }
        },
        highestValue: {
            get: function() {
                var highestValue = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                return (highestValue || highestValue === 0) ? highestValue : null;
            }
        },
        line: {
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
        data: {
            get: function(value) {
                return this.convertListItemsToNumbers(value);
            }
        }
    },
    color: "steelblue",
    data: null,
    graph: null,
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