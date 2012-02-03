//page model
//- data model functionality
//- emits events
//-- 'model:query' - needs data
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

var onReady = 

Model.super = events.EventEmitter;
Model.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Model,
        enumerable: false
    }
});

Model.prototype.onReady = function(callback) {
	this.removeAllListeners('model:ready');
	this.on('model:ready', function(data) {
		//send back an empty model if null result
		callback.call(callback, data);
	});
};

Model.prototype.query = function(query, fields, callback) {
	this.emit('db:query', this.schema.name, query, fields, function(data) {
		data = data || {};
		callback.call(this, data);
	});
};

Model.prototype.end = function(data) {
	this.emit('model:ready', data);
};

exports.Model = Model;
