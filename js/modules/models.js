//data models
var _ = require('underscore')._,
	schemas = require('./shared/schemas.js');

//default empty model
exports.Default = {
	schema: schemas.Default,
	get: function(data) {
		return data;
	}
}
		
//validate inputs and perform multiplication
exports.Config = {
	schema: schemas.Config,
	get: function(data) {
		var data = _.extend(data, {models:exports})
		return data;
	}
}

//validate inputs and perform multiplication
exports.User = {
	schema: schemas.User,
	get: function(data) {
		return {};
	},
	post:function(data) {
		return {
			id:2,
			name:'ray'
		};
	},
	put:function(data) {
		return {
			id:2,
			name:'ray'
		};
	},
	delete:function(data) {
		return {};	
	}
}
