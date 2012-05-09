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
	read: function(body) {
		var that = this;
		
		this.find({}, ['id','name'], function(data) {
			console.log(data);
			that.end(data);
		});	
	},
	create:function(body) {
		//new model
		var that = this;
		this.data.id = body.id;
		this.data.name = body.name;
		
		this.save({id:this.data.id}, this.data, function(data) {
			console.log(data);
			that.end(data);	
		});
		
		//this.end(this.data);
	},
	update:function(body) {
		//update model
		var that = this;
		this.data.id = body.id;
		this.data.name = body.name;
		
		this.update({id:this.data.id}, this.data, function(data) {
			console.log(data);
			that.end(data);	
		});
		
		//this.end(this.data);
	},
	delete:function(body) {
		this.end({});
	}
};
