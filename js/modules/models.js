//default model passes back contents of request body (headers and request parameters)
var _ = require('underscore')._,
	schemas = require('./shared/schemas.js'),
	models = exports;

models.Default = {
	schema: schemas.Default,
	get: function(body) {
		this.end({});
		end
	}
};
			
models.Config = {
	schema: schemas.Config,
	get: function(body) {
		var data = _.extend(body, {models:models});
		this.end(data);
	}
};
	
models.User = {
	schema: schemas.User,
	get: function(body) {
		var that = this,
			data = {
				id:2,
				name:'ray'
			};

		this.query({}, [], function(_data) {
			console.log(_data);
			that.end(data);
		});
	},
	post:function(body) {
		var data = {
			id:2,
			name:'ray'
		};
		this.end(data);
	},
	put:function(body) {
		var data = {
			id:2,
			name:'ray'
		};
		this.end(data);
	},
	delete:function(body) {
		this.end({});
	}
};
