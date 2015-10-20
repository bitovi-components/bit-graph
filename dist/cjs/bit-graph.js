/*bit-graph@0.0.1#bit-graph*/
'use strict';
var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
};
var can = _interopRequire(require('can'));
require('can/map/define/define');
var d3 = _interopRequire(require('d3'));
require('./bit-series/bit-series.js');
var template = _interopRequire(require('./bit-graph.stache.js'));
require('./bit-graph.less.css');
var BitGraphVM = _interopRequire(require('./viewmodel.js'));
can.Component.extend({
    tag: 'bit-graph',
    template: template,
    viewModel: BitGraphVM,
    events: {
        inserted: function (viewModel, ev) {
            var rootElement = ev.target, graphBaseElement = d3.select(rootElement.getElementsByClassName('graph')[0]);
            this.viewModel.renderBaseGraph(graphBaseElement);
        },
        '{viewModel} seriesSerialized': function () {
            this.viewModel.refreshAxes();
            this.viewModel.refreshGraph();
        }
    }
});
module.exports = BitGraphVM;