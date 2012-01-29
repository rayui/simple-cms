//require web server module
var ws = require('./modules/server');
var db = require('./modules/db');
var appconfig = require('./modules/appconfig');

var webServer = new ws.webServer(appconfig.get('webServer'));
var database = new db.database(appconfig.get('database'));
