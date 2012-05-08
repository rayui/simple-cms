//set up dependencies
var _ = require('underscore')._,
	fs = require('fs'),
	events = require('events'),
	crypto = require('crypto'),
	utilities = require('./shared/utilities'),
	model = require('./model');

	//think about doing htis in redis, eventually
	var sessions = [];
	
//set up server model
var Handler = function(_settings){

	events.EventEmitter.call(this);
	
	//confirm app is running
	console.log("Session Handler started");
	
	return this;

};

Handler.super = events.EventEmitter;
Handler.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Handler,
        enumerable: false
    }
});

Handler.prototype.createSession = function(sessionId) {
	//creates new session object in sessions
	//returns object
	sessions[sessionId] = {models:{}};
	
	return sessions[sessionId];
};

Handler.prototype.destroySession = function(sessionId) {
	//destroys session
	//should be called when user logs out/session cookie times out
	delete sessions[sessionId];
};


Handler.prototype.getSession = function(sessionId) {
	//if session with key md5 exists return it
	//else return undefined
	return sessions[sessionId];
};

Handler.prototype.createModel = function(sessionId, modelName) {
	var that = this;
	var m = new model.Model(modelName);
	sessions[sessionId]['models'][modelName] = m;
	
	return m;
};

Handler.prototype.query = function(m) {
	var that = this;
};

exports.Handler = Handler;
