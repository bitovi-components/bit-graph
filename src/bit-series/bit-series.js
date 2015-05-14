/**
 * @module {can.Component} series Series
 * @parent graph
 * @group series/events 0 Events
 * @group series/viewModel 1 ViewModel
 *
 * @author Kyle Gifford
 *
 *
 * @description
 * The series component generates lines for its data.
 *
 *
 * @signature '<bit-series></bit-series>'
 *
 * @param {can.List} data Data to be graphed for this series.
 * @param {String} color Color of the series line on the graph.
 *
 * @body
 *
 * ## Component Initialization
 *
 * ```html
 *   <bit-series data="{data}"></bit-series>
 * ```
 *
 * The color of the line can be modified using the `color` parameter.
 * ```html
 *   <bit-series data="{data}" color="#F00"></bit-series>
 * ```
 */
import can from "can";
import BitSeriesVM from './viewmodel';

can.Component.extend({
    tag: "bit-series",
    viewModel: BitSeriesVM,
    events: {

        /**
         * @function series.events.inserted Series Inserted Event
         * @parent autocomplete/events
         * @description Identifies the parent scope (`bit-graph`) and adds itself to it as a new series.
         */
        inserted: function() {
            var parentScope = this.element.parent().scope();
            this.scope.attr('graph', parentScope);
            parentScope.addSeries(this.scope);
        },

        /**
         * @function series.events.removed Series Removed Event
         * @parent autocomplete/events
         * @description Removes itself as a series from the parent scope (`bit-graph`).
         */
        removed: function() {
            this.element.parent().scope().removeSeries(this.scope);
        }
    }
});

export default BitSeriesVM;