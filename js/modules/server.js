//set up dependencies
var _ = require('underscore')._,
	fs = require('fs'),
	events = require('events'),
	express = require('express'),
	jade = require('jade'),
	utilities = require('./shared/utilities'),
	sessions = require('./sessions');
	
//set up server model
var Server = function(_settings){
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
		var that = this;
		var headers = route.headers(req.headers, req.params);

		function sendJSON(data) {
			res.json(data, 200);	
		};
		
		function sendHTML(data) {
			var template = settings.options['template_dir'] + '/' + route['template'] + '.jade';
			serveHTML(data, template, utilities.callback(sendResponse, {args:[headers,res]}));
		};
		
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
				var sessionId = req.session.sessionId;
				
				//get or create a session
				if (!sessionId) {
					sessionId = ss.createSession(new Date().getTime());
					req.session.sessionId = sessionId;
				}
				
				if (!ss.getSession(sessionId)[route.model]) {
					m = ss.createModel(req.session.sessionId, route.model);
					m.on('db:query', function(query, fields, _callback) {
						that.emit('db:query', m.schema.name, query, fields, _callback);
					});
				}
				
				headers['Content-Type'] === 'application/json' ? m.ready(sendJSON) : m.ready(sendHTML);
				m[req.method.toString().toLowerCase()](req.body);
				
				console.log(sessionId);
				
				break;
		}
	};
	
	//extend default options	
	_.extend(settings, _settings);
	
	//create express server and configure
	var app = express.createServer();    
	var ss = new sessions.Server(settings.sessions);
	
	app.configure(function(){
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({ secret: "keyboard cat" })); //change this
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

	events.EventEmitter.call(this);
	
	//confirm app is running
	console.log("Web server started at " + settings.options['port']);
	
	return this;

};

Server.super = events.EventEmitter;
Server.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Server,
        enumerable: false
    }
});

exports.Server = Server;
