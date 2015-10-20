/*[global-shim-start]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	global.System = {
		define: function(__name, __code){
			global.define = origDefine;
			eval("(function() { " + __code + " \n }).call(global);");
			global.define = ourDefine;
		},
		orig: global.System
	};
})({},window)
/*bit-graph@0.0.1#bit-series/viewmodel*/
define('bit-graph/bit-series/viewmodel', [
    'exports',
    'module',
    'can',
    'can/map/define/define',
    'd3'
], function (exports, module, _can, _canMapDefine, _d3) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var d3 = _interopRequire(_d3);
    module.exports = can.Map.extend({
        define: {
            serializedData: {
                get: function () {
                    return this.attr('data') && this.attr('data').serialize() || null;
                }
            },
            seriesLength: {
                get: function () {
                    return this.attr('data') && this.attr('data').attr('length') || 0;
                }
            },
            lowestValue: {
                get: function () {
                    var lowestValue = this.attr('serializedData') && d3.min(this.attr('serializedData'));
                    return lowestValue || lowestValue === 0 ? lowestValue : null;
                }
            },
            highestValue: {
                get: function () {
                    var highestValue = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                    return highestValue || highestValue === 0 ? highestValue : null;
                }
            },
            line: {
                get: function () {
                    if (this.attr('graph') && this.attr('seriesLength') && this.attr('lowestValue') !== null && this.attr('highestValue') !== null) {
                        if (this.attr('graph').attr('normalize')) {
                            var x = d3.scale.linear().domain([
                                    0,
                                    this.attr('seriesLength') - 1
                                ]).range([
                                    0,
                                    this.attr('graph').attr('width')
                                ]);
                            var y = d3.scale.linear().domain([
                                    this.attr('lowestValue'),
                                    this.attr('highestValue')
                                ]).range([
                                    this.attr('graph').attr('height'),
                                    0
                                ]);
                        } else {
                            var x = this.attr('graph').attr('xScale');
                            var y = this.attr('graph').attr('yScale');
                        }
                        var line = d3.svg.line().x(function (d, i) {
                                return x(i).toPrecision(8);
                            }).y(function (d) {
                                return y(d).toPrecision(8);
                            });
                        return line(this.attr('data'));
                    } else {
                        return null;
                    }
                }
            },
            data: {
                get: function (value) {
                    return this.convertListItemsToNumbers(value);
                }
            }
        },
        color: 'steelblue',
        graph: null,
        convertListItemsToNumbers: function (listItems) {
            if (listItems) {
                listItems.each(function (data, index) {
                    var floatValue = Number.parseFloat(data);
                    if (!Number.isNaN(floatValue)) {
                        listItems[index] = floatValue;
                    } else {
                        listItems.splice(index, 1);
                    }
                });
            }
            return listItems;
        }
    });
});
/*bit-graph@0.0.1#bit-series/bit-series*/
define('bit-graph/bit-series/bit-series', [
    'exports',
    'module',
    'can',
    'bit-graph/bit-series/viewmodel'
], function (exports, module, _can, _viewmodel) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var BitSeriesVM = _interopRequire(_viewmodel);
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
});
/*bit-graph@0.0.1#bit-graph.stache!can@2.3.0-pre.0#view/stache/system*/
define('bit-graph/bit-graph.stache', ['can/view/stache/stache'], function (stache) {
    return stache([
        {
            'tokenType': 'start',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['graph']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n']
        },
        {
            'tokenType': 'start',
            'args': [
                'content',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'content',
                false
            ]
        },
        {
            'tokenType': 'close',
            'args': ['content']
        },
        {
            'tokenType': 'done',
            'args': []
        }
    ]);
});
/*bit-graph@0.0.1#viewmodel*/
define('bit-graph/viewmodel', [
    'exports',
    'module',
    'can',
    'can/map/define/define',
    'd3'
], function (exports, module, _can, _canMapDefine, _d3) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var d3 = _interopRequire(_d3);
    module.exports = can.Map.extend({
        define: {
            margins: {
                value: [
                    20,
                    20,
                    20,
                    80
                ],
                type: '*'
            },
            width: {
                value: 768,
                get: function (val) {
                    var margins = this.attr('margins');
                    return val - margins[1] - margins[3];
                }
            },
            height: {
                value: 400,
                get: function (val) {
                    var margins = this.attr('margins');
                    return val - margins[0] - margins[2];
                }
            },
            transform: {
                get: function () {
                    var margins = this.attr('margins');
                    return 'translate(' + margins[3] + ',' + margins[0] + ')';
                }
            },
            graphContainerElement: { type: '*' },
            lineContainerElement: { type: '*' },
            axisContainerElement: { type: '*' },
            normalize: {
                value: false,
                type: 'htmlbool'
            },
            seriesSerialized: {
                get: function () {
                    return this.attr('series').serialize();
                }
            },
            longestSeriesLength: {
                value: 0,
                get: function () {
                    if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                        var longestSeriesLength = 0;
                        this.attr('series').each(function (s) {
                            longestSeriesLength = Math.max(longestSeriesLength, s.attr('seriesLength'));
                        });
                        return longestSeriesLength;
                    }
                    return 0;
                }
            },
            lowestSeriesValue: {
                value: 0,
                get: function () {
                    if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                        var lowestSeriesValue = Infinity;
                        this.attr('series').each(function (s) {
                            lowestSeriesValue = Math.min(lowestSeriesValue, s.attr('lowestValue'));
                        });
                        return lowestSeriesValue;
                    }
                    return 0;
                }
            },
            highestSeriesValue: {
                value: 0,
                get: function () {
                    if (this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                        var highestSeriesValue = -Infinity;
                        this.attr('series').each(function (s) {
                            highestSeriesValue = Math.max(highestSeriesValue, s.attr('highestValue'));
                        });
                        return highestSeriesValue;
                    }
                    return 0;
                }
            },
            xScale: {
                value: null,
                type: '*',
                get: function () {
                    var domainEndValue = this.attr('normalize') ? 5 : this.attr('longestSeriesLength');
                    return d3.scale.linear().domain([
                        0,
                        domainEndValue - 1
                    ]).range([
                        0,
                        this.attr('width')
                    ]);
                }
            },
            yScale: {
                value: null,
                type: '*',
                get: function () {
                    var normalize = this.attr('normalize'), domainBeginValue = normalize ? 0 : this.attr('lowestSeriesValue'), domainEndValue = normalize ? 5 : this.attr('highestSeriesValue');
                    return d3.scale.linear().domain([
                        domainBeginValue,
                        domainEndValue
                    ]).range([
                        this.attr('height'),
                        0
                    ]);
                }
            }
        },
        series: [],
        clearContainer: function (container, cb) {
            var counter = 0;
            if (container) {
                container.selectAll('*').call(function (selection) {
                    counter = selection.size();
                    if (counter === 0) {
                        cb();
                    }
                }).transition().duration(0).each('end', function () {
                    counter--;
                    if (counter === 0) {
                        cb();
                    }
                }).remove();
            }
        },
        clearGraphLines: function (cb) {
            this.clearContainer(this.attr('lineContainerElement'), cb);
        },
        refreshGraph: function () {
            var _this = this;
            this.attr('seriesSerialized');
            this.clearGraphLines(function () {
                var lineContainerElement = _this.attr('lineContainerElement');
                can.each(_this.attr('series'), function (series) {
                    if (series.attr('line')) {
                        lineContainerElement.append('svg:path').attr('d', series.attr('line')).style('stroke', series.attr('color'));
                    }
                });
            });
        },
        clearAxes: function (cb) {
            this.clearContainer(this.attr('axisContainerElement'), cb);
        },
        refreshAxes: function () {
            var _this = this;
            this.clearAxes(function () {
                var axisContainerElement = _this.attr('axisContainerElement');
                var xAxis = d3.svg.axis().scale(_this.attr('xScale')).tickSize(-_this.attr('height')).tickSubdivide(true);
                var yAxisLeft = d3.svg.axis().scale(_this.attr('yScale')).ticks(4).orient('left');
                if (_this.attr('normalize')) {
                    xAxis.tickFormat('');
                    yAxisLeft.tickFormat('');
                }
                axisContainerElement.append('svg:g').attr('class', 'x axis').attr('width', _this.attr('width')).attr('transform', 'translate(0,' + _this.attr('height') + ')').call(xAxis);
                axisContainerElement.append('svg:g').attr('class', 'y axis').attr('height', _this.attr('height')).attr('transform', 'translate(-25,0)').call(yAxisLeft);
            });
        },
        renderBaseGraph: function (graphBaseElement) {
            var margins = this.attr('margins');
            var graphContainerElement = graphBaseElement.append('svg:svg').attr('width', this.attr('width') + margins[1] + margins[3]).attr('height', this.attr('height') + margins[0] + margins[2]).append('svg:g').attr('transform', this.attr('transform'));
            this.attr('graphContainerElement', graphContainerElement);
            this.attr('axisContainerElement', graphContainerElement.append('svg:g').attr('class', 'axis'));
            this.attr('lineContainerElement', graphContainerElement.append('svg:g').attr('class', 'lines'));
            this.refreshAxes();
            this.refreshGraph();
        },
        addSeries: function (series) {
            can.batch.start();
            this.attr('series').push(series);
            can.batch.stop();
        },
        removeSeries: function (series) {
            var seriesList = this.attr('series');
            can.batch.start();
            seriesList.splice(seriesList.indexOf(series), 1);
            can.batch.stop();
        }
    });
});
/*bit-graph@0.0.1#bit-graph*/
define('bit-graph', [
    'exports',
    'module',
    'can',
    'can/map/define/define',
    'd3',
    'bit-graph/bit-series/bit-series',
    'bit-graph/bit-graph.stache',
    'bit-graph/bit-graph.less',
    'bit-graph/viewmodel'
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
/*[global-shim-end]*/
(function (){
	window._define = window.define;
	window.define = window.define.orig;
	window.System = window.System.orig;
})();