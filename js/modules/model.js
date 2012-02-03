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

Model.super = events.EventEmitter;
Model.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Model,
        enumerable: false
    }
});

Model.prototype.ready = function(callback) {
	this.on('model:ready', function(data) {
		callback.call(callback, data);
	});
};

Model.prototype.query = function(query, fields, callback) {
	this.emit('db:query', query, fields, callback);
};

Model.prototype.end = function(data) {
	this.emit('model:ready', data);
};

exports.Model = Model;
