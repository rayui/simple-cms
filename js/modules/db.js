//set up dependencies
var _ = require('underscore')._,
    utilities = require('./shared/utilities'),
    Mongoose = require('mongoose');
    
exports.database = function(_settings) {
	//default settings
	var settings = {
		options:{}
	};
	
	var onOpen = function() {
		console.log('Connected to database ' + 'mongodb://' + settings.options.host + '/' + settings.options.database);
	};
	
	var onError = function(err) {
		console.log('Database connection error: ' + err.message);
	}
	
	_.extend(settings, _settings);
		
	var app = Mongoose.connect('mongodb://' + settings.options.host + '/' + settings.options.database);
	app.connection.on('open', onOpen);
	app.connection.on('error', onError);
};
