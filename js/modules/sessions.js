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
var Server = function(_settings){

	events.EventEmitter.call(this);
	
	//confirm app is running
	console.log("Session Handler started");
	
	return this;

};

Server.super = events.EventEmitter;
Server.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Server,
        enumerable: false
    }
});

Server.prototype.createSession = function() {
	//creates new session object in sessions
	//returns object
	var md5sum = new crypto.createHash('sha1');
	md5sum.update(arguments.toString());
	
	var sessionId = md5sum.digest('base64');
	sessions[sessionId] = {models:{}};
	
	return sessionId;
};

Server.prototype.getSession = function(sessionId) {
	//if session with key md5 exists return it
	//else return undefined
	return sessions[sessionId];
};

Server.prototype.createModel = function(sessionId, modelName) {
	var that = this;
	var m = sessions[sessionId]['models'][modelName] = new model.Model(modelName);
	
	return m;
};

Server.prototype.query = function(m) {
	var that = this;
};

exports.Server = Server;
