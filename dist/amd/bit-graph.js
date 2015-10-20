/*bit-graph@0.0.1#bit-graph*/
define([
    'exports',
    'module',
    'can',
    'can/map/define',
    'd3',
    './bit-series/bit-series',
    './bit-graph.stache',
    'css!./bit-graph.less.css',
    './viewmodel'
], function (exports, module, _can, _canMapDefine, _d3, _bitSeries, _bitGraphStache, _bitGraphLess, _viewmodel) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var d3 = _interopRequire(_d3);
    var template = _interopRequire(_bitGraphStache);
    var BitGraphVM = _interopRequire(_viewmodel);
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
});