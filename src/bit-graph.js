/**
 * @module {can.Component} graph Graph
 * @parent components
 * @group graph/events 0 Events
 * @group graph/viewModel 1 ViewModel
 *
 * @author Kyle Gifford
 *
 *
 * @description
 * The graph component renders a live-updating line graph of multiple sets of data.
 *
 *
 * @signature '<bit-graph></bit-graph>'
 *
 * @param {Array} margins Margins of the graph inside the SVG element.
 * @param {Number} height The height of the graph element.
 * @param {Number} width The width of the graph element.
 * @param {Boolean} normalize Whether to normalize series data against each other or not.
 *
 * @body
 *
 * ## Component Initialization
 *
 * ```html
 *   <bit-graph></bit-graph>
 * ```
 *
 * The layout of the graph can be modified with the `width`, `height`, and `margins` parameters.
 * ```html
 *   <bit-graph width="500" height="300"></bit-graph>
 * ```
 *
 * The graph can be set to normalize mode by adding the `normalize` boolean parameter
 * ```html
 *   <bit-graph normalize></bit-graph>
 * ```
 *
 * @demo bit-graph.html
 */
import can from "can";
import 'can/map/define/';
import d3 from "d3";
import './bit-series/'
import template from "./bit-graph.stache!";
import './bit-graph.less!';
import BitGraphVM from './viewmodel';

can.Component.extend({
    tag: "bit-graph",
    template: template,
    viewModel: BitGraphVM,
    events: {

        /**
         * @function graph.events.inserted Graph Inserted Event
         * @parent autocomplete/events
         * @description Sets up the graph container elements in D3 and builds the base graph SVG elements.
         * @param {viewModel} viewModel The viewModel of the graph
         * @param {event} ev The jQuery event triggered by DOM insertion 
         */
        inserted: function(viewModel, ev) {
            var rootElement = ev.target,
                graphBaseElement = d3.select(rootElement.getElementsByClassName('graph')[0]);
            this.viewModel.renderBaseGraph(graphBaseElement);
        },

        /**
         * @function graph.events.seriesSerialized Serialized Series Change Event
         * @parent autocomplete/events
         * @description Refresh graph data and axes when series' line(s) change.
         */
        "{viewModel} seriesSerialized": function() {
            // TODO figure out how these can just listen and auto refresh
            this.viewModel.refreshAxes();
            this.viewModel.refreshGraph();
        }
    }
});

export default BitGraphVM;