import can from "can";
import 'can/map/define/';
import './bit-series/'
import template from "./bit-graph.stache!";
import './bit-graph.less!';
import d3 from "d3";
import BitGraphVM from './viewmodel';

can.Component.extend({
    tag: "bit-graph",
    template: template,
    viewModel: BitGraphVM,
    events: {
        inserted: function(scope, ev) {
            var rootElement = ev.target,
                graphBaseElement = d3.select(rootElement.getElementsByClassName('graph')[0]);
            this.scope.renderBaseGraph(graphBaseElement);
        },
        // "{scope} xScale": function() {
        //     this.scope.refreshAxes();
        // },
        // "{scope} yScale": function() {
        //     this.scope.refreshAxes();
        // },
        "{scope} seriesSerialized": function() {
            // TODO figure out how these can just listen and auto refresh
            this.scope.refreshAxes();
            this.scope.refreshGraph();
        }
    }
});

export default BitGraphVM;