import can from "can";
import BitSeriesVM from './viewmodel';

can.Component.extend({
    tag: "bit-series",
    viewModel: BitSeriesVM,
    events: {
        inserted: function() {
            var parentScope = this.element.parent().scope();
            this.scope.attr('graph', parentScope);
            parentScope.addSeries(this.scope);
        },
        removed: function() {
            this.element.parent().scope().removeSeries(this.scope);
        }
    }
});

export default BitSeriesVM;