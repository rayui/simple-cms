//set up dependencies
var _ = require('underscore')._,
	fs = require('fs'),
	express = require('express'),
	jade = require('jade'),
	utilities = require('./shared/utilities'),
	models = require('./models');	
	
//set up server model
exports.webServer = function(_settings){
	//default settings
	var settings = {
		options:{
		    port:8000,
		    template_dir:'/../../templates'
		}
	};
	
	//server error pages
	function serveError(number, data, callback) {
	    data = data || {};
		var template = __dirname + settings.options['template_dir'] + '/' + number + '.jade';
		jade.renderFile(template, data, function(err,html){
			if (err) {
				if (number !== 500) {
				    data.err = err;
					serveError(500, data, function(html, http_code) {
						callback.apply(this, [html, http_code]);
					});
				} else {
					callback.apply(this, ['<h1>FATAL SERVER ERROR</h1>' + JSON.stringify(err), 500]);
				}
			} else {
				callback.apply(this, [html, number]);
			}
		});	
	};
	
	//serve static files
	function serveStatic(path, callback) {
		fs.readFile(__dirname + path, function(err, data){
			if(err) {
			  serveError(404, {}, function(html, http_code) {
					callback.apply(this, [html, http_code]);
				});
			} else {
				callback.apply(this, [data, 200]);
			}
		});
	};
	
	//renders a chunk of markup to the response object
	function serveHTML(data, template, callback) {
	    data.settings = settings
		jade.renderFile(__dirname + template, data, function(err,html) {
			if (err) {
			    data.err = err;
				serveError(500, data, function(html, http_code) {
					callback.apply(this, [html, http_code]);
				});
			} else {
				callback.apply(this, [html, 200]);
			}
		});
	};
	
	//this is the callback that sends the response
	function sendResponse(data, http_code, headers, res) {
		for (header in headers) {
			res.header(header, headers[header]);
		}
		res.statusCode = http_code;
		res.write(data);
		res.end();
	};
	
	function requestHandler(req, res, next, route) {
		var headers = route.headers(req.headers, req.params);
		
		//choose our render method based on request content type
		switch (headers['Content-Type']) {
			case 'application/json':
				var data = utilities.callFunctionByName(route.model + '.' + req.method.toString().toLowerCase(), models, req.body);
				res.json(data, 200);
				break;
			case 'text/html':
			default:
				switch (route.type) {
					case '302':
						res.redirect(headers['Location']);
						break;
					case '404':
						var template = settings.options['template_dir'] + '/404.jade';
						serveError(404, {}, utilities.callback(sendResponse, {args:[{'Content-Type':'text/html'},res]}));
						break;
					case 'static':
						var path = route.path(req.params);
						serveStatic(path, utilities.callback(sendResponse, {args:[headers,res]}));
						break;
					case 'dynamic':
					default:
						//use model to generate response data for route
						//need some kind of error checking in here in case model process function fails
						var data = utilities.callFunctionByName(route.model + '.' + req.method.toString().toLowerCase(), models, req.body);
						var template = settings.options['template_dir'] + '/' + route['template'] + '.jade';
						serveHTML(data, template, utilities.callback(sendResponse, {args:[headers,res]}));
						break;
				}
				break;
		}
	};
	
	//extend default options	
	_.extend(settings, _settings);
	
	//create express server and configure
	var app = express.createServer();    
	app.configure(function(){
		app.use(express.bodyParser());
	});
		
	//set up routing loop
	//to pick our express method dynamically
	
	for (var i in settings.routing) {
		var route = settings.routing[i];
		for (method in route.methods) {
			app[route.methods[method]](new RegExp(route.regex), utilities.callback(requestHandler, {args:[route], scope:this}));
		}
	}
	
	//get app to listen to requests
	app.listen(process.env.PORT || parseInt(settings.options['port'], 10));

	//confirm app is running
	console.log("Web server started at " + settings.options['port']);

};
