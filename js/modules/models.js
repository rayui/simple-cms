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
	data:{
		id:"",
		name:""
	},
	schema: schemas.User,
	get: function(body) {
		var that = this;
		
		/*this.query({}, [], function(_data) {
			console.log(_data);
			that.end(that.data);
		});*/
		
		this.end(this.data);
	},
	post:function(body) {
		this.data.id = body.id;
		this.data.name = body.name;
		this.end(this.data);
	},
	put:function(body) {
		this.data.id = body.id;
		this.data.name = body.name;
		this.end(this.data);
	},
	delete:function(body) {
		this.end({});
	}
};
