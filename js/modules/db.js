//set up dependencies
var _ = require('underscore')._,
    mongoose = require('mongoose'),
    events = require('events'),
    utilities = require('./shared/utilities'),
    schemas = require('./shared/schemas.js');

var Database = function(_settings) {
	//default settings
	var settings = {
		options:{},
		path:function() {
			return 'mongodb://' + settings.options.host + '/' + settings.options.database;
		}
	};
	
	var onOpen = function() {
		console.log('Connected to database ' + settings.path());
	};
	
	var onError = function(err) {
		console.log('Database connection error: ' + err.message);
	}
	
	_.extend(settings, _settings);
		
	this.db = mongoose.connect(settings.path());
	this.db.connection.on('open', onOpen);
	this.db.connection.on('error', onError);
	
	_.bind(this.fetch, this);
	_.bind(this.update, this);
	
	events.EventEmitter.call(this);

	return this;
};

Database.super = events.EventEmitter;
Database.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Database,
        enumerable: false
    }
});

Database.prototype.fetch = function(schemaName, query, fields, callback) {
	var schema = new mongoose.Schema(schemas[schemaName].definition);
	var model = this.db.model(schemaName, schema);
	var results = model.find(query, fields, callback);
};

Database.prototype.update = function(schemaName, query, fields, callback) {
	/*var schema = new mongoose.Schema(schemas[schemaName].definition);
	var model = this.db.model(schemaName, schema);
	var results = model.update(query, fields, callback);*/
};


exports.Database = Database;
