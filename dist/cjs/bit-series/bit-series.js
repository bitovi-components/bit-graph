/*bit-graph@0.0.1#bit-series/bit-series*/
'use strict';
var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
};
var can = _interopRequire(require('can'));
var BitSeriesVM = _interopRequire(require('./viewmodel.js'));
can.Component.extend({
    tag: 'bit-series',
    viewModel: BitSeriesVM,
    events: {
        inserted: function () {
            var parentScope = this.element.parent().scope();
            this.scope.attr('graph', parentScope);
            parentScope.addSeries(this.scope);
        },
        removed: function () {
            this.element.parent().scope().removeSeries(this.scope);
        }
    }
});
module.exports = BitSeriesVM;