//set up dependencies
var _ = require('underscore')._,
    mongoose = require('mongoose'),
    events = require('events'),
    utilities = require('./shared/utilities'),
    schemas = require('./shared/schemas.js');

var Database = function(_settings) {
	//default settings
	var settings = {
		options:{}
	};
	
	var onOpen = function() {
		console.log('Connected to database ' + settings.options.database + ' on ' + settings.options.host + ':' + settings.options.port + ', registering schemas...');
		for (schema in schemas) {
			var s = new mongoose.Schema(schemas[schema].definition);
			mongoose.model(schemas[schema].name, s);
			console.log('- ' + schemas[schema].name);
		}
	};
	
	var onError = function(err) {
		console.log('Database connection error: ' + err.message);
	}
	
	_.extend(settings, _settings);
		
	this.db = mongoose.connect(settings.options.host, settings.options.database, settings.options.port);
	this.db.connection.on('open', onOpen);
	this.db.connection.on('error', onError);
	
	_.bind(this.find, this);
	_.bind(this.save, this);
	_.bind(onOpen, this);
	
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

Database.prototype.find = function(schemaName, query, fields, callback) {
	var model = mongoose.model(schemaName);
	model.find(query, fields, function(err, data) {
		//error handling!!
		callback.call(callback, data);
	});
};

Database.prototype.update = function(schemaName, conditions, update, callback) {
	var model = mongoose.model(schemaName);
	var m = new model();
	_.extend(m, update);
	m.save(function(err) {
		//error handling!!
		var query = conditions;
		model.find(query, function(err, data) {
			callback.call(callback, data);
		});
	});
	
};

Database.prototype.save = function(schemaName, data, callback) {
	var model = mongoose.model(schemaName);
	var m = new model();
	_.extend(m, data);
	m.save(function(err) {
		//error handling!!
		callback.call(callback, data);
	});
	
};

exports.Database = Database;
