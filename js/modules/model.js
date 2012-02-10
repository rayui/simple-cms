//page model
//- data model functionality
//- emits events
//-- 'db:fetch' - needs data
//-- 'db:update' - sends data
//-- 'mode:ready' - ready to render

//processes requests from server

var util = require('util'),
	_ = require('underscore')._,
	events = require('events'),
	models = require('./models.js');

var Model = function(name) {
	//mix in model actions
	_.extend(this, models[name]);
	events.EventEmitter.call(this);
	return this;
};

Model.super = events.EventEmitter;
Model.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Model,
        enumerable: false
    }
});

Model.prototype.onReady = function(callback) {
	this.once('model:ready', function(data) {
		//send back an empty model if null result
		callback.call(callback, data);
	});
};

Model.prototype.fetch = function(query, fields, callback) {
	this.emit('db:fetch', this.schema.name, query, fields, function(data) {
		data = data || {};
		//clone it! do not take a reference or all the sessions will reference the same object
		callback.call(this, _.extend({},data));
	});
};

Model.prototype.update = function(conditions, update, options, callback) {
	
};

Model.prototype.end = function(data) {
	this.emit('model:ready', data);
};

exports.Model = Model;
