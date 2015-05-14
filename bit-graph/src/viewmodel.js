import can from "can";
import 'can/map/define/';
import d3 from "d3";

export default can.Map.extend({
    define: {

        /**
         * @property {Array} graph.viewModel.margins margins
         * @parent graph/viewModel
         * @description Margins between the graph and its containing element. Should be a four-length array similar to a CSS margin property (`[margin-top, margin-right, margin-bottom, margin-left]`)
         * @option {Array} Defaults to `[20, 0, 20, 80]`.
         */
        margins: {
            value: [20, 0, 20, 80],
            type: "*"
        },

        /**
         * @property {Number} graph.viewModel.width width
         * @parent graph/viewModel
         * @description Width, in pixels, of the graph container. Note: the actual graph may be smaller due to margins, axes, etc.
         * @option {Number} Defaults to `768`.
         */
        width: {
            value: 768,
            get: function(val) {
                var margins = this.attr('margins');
                return val - margins[1] - margins[3];
            }
        },

        /**
         * @property {Number} graph.viewModel.height height
         * @parent graph/viewModel
         * @description Height, in pixels, of the graph container. Note: the actual graph may be smaller due to margins, axes, etc.
         * @option {Number} Defaults to `400`.
         */
        height: {
            value: 400,
            get: function(val) {
                var margins = this.attr('margins');
                return val - margins[0] - margins[2];
            }
        },

        /**
         * @property {String} graph.viewModel.transform transform
         * @parent graph/viewModel
         * @description Transformation function to be added to the graph container's grouping element.
         * @option {String} Defaults to `translate(80, 20)`.
         */
        transform: {
            get: function() {
                var margins = this.attr('margins');
                return "translate(" + margins[3] + "," + margins[0] + ")"
            }
        },

        /**
         * @property {Object} graph.viewModel.graphContainerElement graphContainerElement
         * @parent graph/viewModel
         * @description D3 element that contains all graph elements. This is set automatically when the component is inserted.
         * @option {Object} Defaults to `undefined`.
         */
        graphContainerElement: {
            type: "*"
        },

        /**
         * @property {Object} graph.viewModel.lineContainerElement lineContainerElement
         * @parent graph/viewModel
         * @description D3 element that contains all series' line elements. This is set automatically when the component is inserted.
         * @option {Object} Defaults to `undefined`.
         */
        lineContainerElement: {
            type: "*"
        },

        /**
         * @property {Object} graph.viewModel.axisContainerElement axisContainerElement
         * @parent graph/viewModel
         * @description D3 element that contains all axis elements. This is set automatically when the component is inserted.
         * @option {Object} Defaults to `undefined`.
         */
        axisContainerElement: {
            type: "*"
        },

        /**
         * @property {Boolean} graph.viewModel.normalize normalize
         * @parent graph/viewModel
         * @description Flag to indicate whether to normalize all series' data.
         * @option {Boolean} Defaults to `false`.
         */
        normalize: {
            value: false,
            type: "htmlbool"
        },

        /**
         * @property {can.List} graph.viewModel.seriesSerialized seriesSerialized
         * @parent graph/viewModel
         * @description Serialized version of series data. This is populated automatically when series are added to the graph using the `bit-series` sub-component.
         * @option {can.List} Defaults to `undefined`.
         */
        seriesSerialized: {
            get: function() {
                return this.attr('series').serialize();
            }
        },

        /**
         * @property {Number} graph.viewModel.longestSeriesLength longestSeriesLength
         * @parent graph/viewModel
         * @description Longest length of any series added to the graph using the `bit-series` subcomponent.
         * @option {Number} Defaults to `0`.
         */
        longestSeriesLength: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var longestSeriesLength = 0;
                    this.attr('series').each(function(s) {
                        longestSeriesLength = Math.max(longestSeriesLength, s.attr('seriesLength'));
                    });
                    return longestSeriesLength;
                }
                return 0;
            }
        },

        /**
         * @property {Number} graph.viewModel.lowestSeriesValue lowestSeriesValue
         * @parent graph/viewModel
         * @description Lowest value of any series added to the graph using the `bit-series` subcomponent.
         * @option {Number} Defaults to `0`.
         */
        lowestSeriesValue: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var lowestSeriesValue = Infinity;
                    this.attr('series').each(function(s) {
                        lowestSeriesValue = Math.min(lowestSeriesValue, s.attr('lowestValue'));
                    });
                    return lowestSeriesValue;
                }
                return 0;
            }
        },

        /**
         * @property {Number} graph.viewModel.highestSeriesValue highestSeriesValue
         * @parent graph/viewModel
         * @description Highest value of any series added to the graph using the `bit-series` subcomponent.
         * @option {Number} Defaults to `0`.
         */
        highestSeriesValue: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var highestSeriesValue = -Infinity;
                    this.attr('series').each(function(s) {
                        highestSeriesValue = Math.max(highestSeriesValue, s.attr('highestValue'));
                    });
                    return highestSeriesValue;
                }
                return 0;
            }
        },

        /**
         * @property {Object} graph.viewModel.xScale xScale
         * @parent graph/viewModel
         * @description D3 scale object representing the X scale of the graph.
         * @option {Object} Defaults to `null`.
         */
        xScale: {
            value: null,
            type: '*',
            get: function() {
                var domainEndValue = (this.attr('normalize')) ? 5 : this.attr('longestSeriesLength');

                // X scale will fit all values from data[] within pixels 0-w
                return d3.scale.linear().domain([0, domainEndValue-1]).range([0, this.attr('width')]);
            }  
        },

        /**
         * @property {Object} graph.viewModel.yScale yScale
         * @parent graph/viewModel
         * @description D3 scale object representing the Y scale of the graph.
         * @option {Object} Defaults to `null`.
         */
        yScale: {
            value: null,
            type: '*',
            get: function() {
                var normalize = this.attr('normalize'),
                    domainBeginValue = normalize ? 0 : this.attr('lowestSeriesValue'),
                    domainEndValue = normalize ? 5 : this.attr('highestSeriesValue');

                // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                return d3.scale.linear().domain([domainBeginValue, domainEndValue]).range([this.attr('height'), 0]);
            }
        }
    },

    /**
     * @property {Array} graph.viewModel.series series
     * @parent graph/viewModel
     * @description Series that are part of the graph.
     * @option {Array} Defaults to `[]`.
     */
    series: [],

    /**
     * @function graph.viewModel.clearContainer clearContainer
     * @parent graph/viewModel
     * @description Clears a D3 container of all elements and executes a callback when completed.
     * @param {Object} container D3 object who's elements are to be cleared.
     * @param {Function} cb Callback to be run once all elements are cleared.
     */
    clearContainer: function(container, cb) {
        // no clean way to remove all elements and receive a callback, so we have to make our own
        // http://stackoverflow.com/questions/23118779/d3-callback-function-after-remove
        var counter = 0;
        if(container) {
            container.selectAll('*').call(function(selection) {
                counter = selection.size();
                // if counter is zero, the each won't ever execute, so fire the callback here also
                if(counter === 0) {
                    cb();
                }
            }).transition().duration(0).each("end", function() {
                counter--;
                if(counter === 0) {
                    cb();
                }
            }).remove();
        }
    },

    /**
     * @function graph.viewModel.clearGraphLines clearGraphLines
     * @parent graph/viewModel
     * @description Clears the graph line container element and executes a callback when completed.
     * @param {Function} cb Callback to be run once all graph lines are cleared.
     */
    clearGraphLines: function(cb) {
        this.clearContainer(this.attr('lineContainerElement'), cb);
    },

    /**
     * @function graph.viewModel.refreshGraph refreshGraph
     * @parent graph/viewModel
     * @description Clears the graph lines and re-renders all lines.
     */
    refreshGraph: function() {
        // TODO this method should just capture changes to any element on the graph and move into a define
        // TODO append all elements to a document fragment instead and update in the change event
        // TODO only refresh lines that have changed, not all lines

        // bind to the serialized changes
        this.attr('seriesSerialized');

        this.clearGraphLines(() => {
            // Add the line by appending an svg:path element with the data line
            var lineContainerElement = this.attr('lineContainerElement');
            can.each(this.attr('series'), function(series) {
                if(series.attr('line')) {
                    lineContainerElement.append("svg:path").attr("d", series.attr('line')).style("stroke", series.attr("color"));
                }
            });
        });
    },

    /**
     * @function graph.viewModel.clearAxes clearAxes
     * @parent graph/viewModel
     * @description Clears the graph axes container element and executes a callback when completed.
     * @param {Function} cb Callback to be run once all graph axes are cleared.
     */
    clearAxes: function(cb) {
        this.clearContainer(this.attr('axisContainerElement'), cb);
    },

    /**
     * @function graph.viewModel.refreshAxes refreshAxes
     * @parent graph/viewModel
     * @description Clears the graph axes and re-renders all axes.
     */
    refreshAxes: function() {
        // TODO this method should just capture changes to the x/y scales or graph height/width and reload accordingly
        // TODO split this up so that the X and Y axis can be refresh separately

        this.clearAxes(() => {
            var axisContainerElement = this.attr('axisContainerElement');

            // create xAxis
            var xAxis = d3.svg.axis().scale(this.attr('xScale')).tickSize(-this.attr('height')).tickSubdivide(true);

            // create left yAxis
            var yAxisLeft = d3.svg.axis().scale(this.attr('yScale')).ticks(4).orient("left");

            // if we are normalizing, remove the values
            if(this.attr('normalize')) {
                xAxis.tickFormat("");
                yAxisLeft.tickFormat("");
            }

            // Add the x-axis.
            axisContainerElement.append("svg:g")
                  .attr("class", "x axis")
                  .attr("width", this.attr('width'))
                  .attr("transform", "translate(0," + this.attr('height') + ")")
                  .call(xAxis);

            // Add the y-axis to the left
            axisContainerElement.append("svg:g")
                  .attr("class", "y axis")
                  .attr("height", this.attr('height'))
                  .attr("transform", "translate(-25,0)")
                  .call(yAxisLeft);
        });
    },

    /**
     * @function graph.viewModel.renderBaseGraph renderBaseGraph
     * @parent graph/viewModel
     * @description Renders the base graph container and builds out structure of graph (axis and line container).
     * @param {Object} graphBaseElement D3 object that will contain the graph structure.
     */
    renderBaseGraph: function(graphBaseElement) {
        var margins = this.attr('margins');
        
        // create the container elements
        var graphContainerElement = graphBaseElement.append("svg:svg")
              .attr("width", this.attr('width') + margins[1] + margins[3])
              .attr("height", this.attr('height') + margins[0] + margins[2])
            .append("svg:g")
              .attr("transform", this.attr('transform'));
        this.attr('graphContainerElement', graphContainerElement);
        this.attr('axisContainerElement', graphContainerElement.append("svg:g").attr("class", "axis"));
        this.attr('lineContainerElement', graphContainerElement.append("svg:g").attr("class", "lines"));

        // TODO remove this eventually and make axes dependent on line data?
        this.refreshAxes();
        this.refreshGraph();
    },

    /**
     * @function graph.viewModel.addSeries addSeries
     * @parent graph/viewModel
     * @description Adds a series to the graph. This is called automatically when a `bit-series` subcomponent is inserted.
     * @param {Object} series BitSeriesVM object.
     */
    addSeries: function(series) {
        can.batch.start();
        this.attr('series').push(series);
        can.batch.stop();
    },

    /**
     * @function graph.viewModel.removeSeries removeSeries
     * @parent graph/viewModel
     * @description Removes a series from the graph. This is called automatically when a `bit-series` subcomponent is removed.
     * @param {Object} series BitSeriesVM object.
     */
    removeSeries: function(series) {
        var seriesList = this.attr('series');
        can.batch.start();
        seriesList.splice(seriesList.indexOf(series), 1);
        can.batch.stop();
    }
});