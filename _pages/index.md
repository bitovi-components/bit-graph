@page index
@hide sidebar
@hide title
@hide footer
@hide container
@hide article
@body

<section style="width: 800px; margin:100px auto 20px auto; overflow:hidden;">

# bit-graph

[![Build Status](https://travis-ci.org/bitovi-components/bit-graph.svg?branch=master)](https://travis-ci.org/bitovi-components/bit-graph)

A live-reloading graph widget that can be loaded by:

- StealJS + ES6
- npm / browserify / CJS
- RequireJS / AMD
- Standalone with CanJS and jQuery

Graphs can be either normalized to fit the dimensions of the graph, or the graph can auto-scale around the data set(s).

## Usage

A `bit-graph` contains many series. Series are added as sub-components (`bit-series`) of the graph, and receive a data object in the form of an Array or can.List. The graph automatically binds to changes on these data objects (`push`, `pop`, `splice`, etc.) and will update the graph lines and resize the graph automatically.

`bit-graph` can function in two modes:
- un-normalized (default): each `bit-series` will be plotted relative to the others, so if one series changes the scale, all other series will be plotted on the new scale
- normalized: each `bit-series` is plotted in a fixed graph space, so if one series changes, all other series remain the same. The mode can be activated with the `normalized` param (`<bit-graph normalized>...</bit-graph>`)

Graphs can be resized and have their margins specified through parameters, and series can have their line color specified as well.

## Install

```bash
npm install bit-graph --save
```

## ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```html
<script type="text/stache" id="demo" can-autorender>
	<can-import from="bit-graph" />
	<bit-graph>
		<bit-series data="{dataSource}" />
  	</bit-tabs>
</script>

<script src='./node_modules/steal/steal.js'
	main="can/view/autorender/">

	import can from "can";
	import $ from "jquery";

	$("#demo").viewModel().attr({
		dataSource1: new can.List([1, 2, 3])
	});
</script>

```

Alternatively, you can import this module like:

```js
import "bit-graph";
import can from "can";
import $ from "jquery";
import stache from "can/view/stache/stache";

var template = stache('<bit-graph>' +
	'<bit-series data="{dataSource}" />' +
'</bit-tabs>');

$("body").append(template({
	dataSource1: new can.List([1, 2, 3])
}));

```

## CJS use

Use `require` to load `bit-graph` and everything else
needed to create a template that uses `bit-graph`:

```js
var can = require("canjs");
var $ = require("jquery")

// Add's bit-graph tag
require("bit-graph");
// Use stache
require("canjs/view/stache/stache");

var template = can.stache('<bit-graph>' +
	'<bit-series data="{dataSource}" />' +
'</bit-tabs>');

$("body").append(template({
	dataSource1: new can.List([1, 2, 3])
}));

```

## AMD use

Configure the `can` and `jquery` paths and the `bit-graphs` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'bit-graph',
		    	location: 'node_modules/bit-graph/dist/amd',
		    	main: 'bit-graph'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

Make sure you have the `css` plugin configured also!

Use bit-graph like:

```js
define(["can", "jquery", "can/view/stache", "bit-graph"], function(can, $) {
	var template = can.stache('<bit-graph>' +
		'<bit-series data="{dataSource}" />' +
	'</bit-tabs>');

	$("body").append(template({
		dataSource1: new can.List([1, 2, 3])
	}));
});
```

## Standalone use

Load the `global` css and js files:

```html
<link rel="stylesheet" type="text/css" 
      href="./node_modules/bit-graph/dist/global/bit-graph.css">
      
<script src='./node_modules/jquery/dist/jquery.js'></script>
<script src='./node_modules/canjs/dist/can.jquery.js'></script>
<script src='./node_modules/canjs/dist/can.stache.js'></script>
<script src='./node_modules/bit-graph/dist/global/bit-graph.js'></script>
<script id='main-stache' text='text/stache'>
  <bit-graph>
    <bit-series data="{dataSource}" />
  </bit-tabs>
</script>
<script>
  $("body").append( can.view("main-stache", {
  	dataSource: new can.List([1, 2, 3])
  }) );
</script>
```

</section>
