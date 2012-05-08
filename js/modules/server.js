//set up dependencies
var _ = require('underscore')._,
	fs = require('fs'),
	events = require('events'),
	express = require('express'),
	jade = require('jade'),
	utilities = require('./shared/utilities'),
	database = require('./db'),
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
		jade.renderFile(__dirname + template, {data:data}, function(err,html) {
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
				var sessionId = req.session.id,
					session = sessionHandler.getSession(sessionId);
				
				//get or create a session
				if (!session) {
					session = sessionHandler.createSession(sessionId);
				}
				
				var m = session.models[route.model];
				
				if (!m) {
					//get or create the model for this route
					m = sessionHandler.createModel(sessionId, route.model);
					m.on('db:fetch', utilities.callback(db.fetch, {scope:db}));	//db.fetch.apply(db)??
					m.on('db:update', utilities.callback(db.update, {scope:db}));
				}
				
				//bind response callbacks based on request type
				headers['Content-Type'] === 'application/json' ? m.onReady(sendJSON) : m.onReady(sendHTML);
				
				//get the model ready
				m[req.method.toString().toLowerCase()](req.body);
				
				break;
		}
	};
	
	//extend default options	
	_.extend(settings, _settings);
	
	//create express server and configure
	var app = express.createServer(),
		db = new database.Database(settings.database),
		sessionHandler = new sessions.Handler(settings.sessions),
		appPort = process.env.PORT || parseInt(settings.options['port'], 10)
	
	
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
	app.listen(appPort);

	events.EventEmitter.call(this);
	
	//confirm app is running
	console.log("Web server started at " + appPort);
	
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
