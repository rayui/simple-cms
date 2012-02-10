//require web server module
var webserver = require('./modules/server');
var appconfig = require('./modules/appconfig');

var ws = new webserver.Server(appconfig.get('webserver'));
