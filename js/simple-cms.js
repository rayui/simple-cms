//require web server module
var webserver = require('./modules/server');
var database = require('./modules/db');
var appconfig = require('./modules/appconfig');

var ws = new webserver.Server(appconfig.get('webserver'));
var db = new database.Database(appconfig.get('database'));
	
//we only do this once because a response is an http one-time thing
ws.on('db:query', function() {
	db.query.apply(db, arguments);
});

