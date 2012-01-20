var _ = require('underscore')._,
	utilities = require('./shared/utilities'),
	validate = require('./shared/validate');

//validate inputs and perform multiplication
exports.default = {
	schema: {
		name: 'Default',
		definition: {
		    id: {type: String, index:true, required: true}
		}
	},
	process: function(data) {
		return data;
	}
}
	
//validate inputs and perform multiplication
exports.config = {
	schema: {
		name: 'Config',
		definition: {
		    id: {type: String, index:true, required: true}
		}
	},
	process: function(data) {
		return data;
	}
};


