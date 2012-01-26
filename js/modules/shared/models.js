//data models

(function(exports){
	try {
		var _ = require('underscore')._,
			validationRules = require('./validation-rules.js');
	} catch(err) {
		var validationRules = this.validationRules || {};
	}
	
	//default empty model
	exports.Default = {
		schema: {
			name: 'Default',
			definition: {}
		},
		process: function(data) {
			return data;
		}
	}
			
	//validate inputs and perform multiplication
	exports.Config = {
		schema: {
			name: 'Config',
			definition: {
			    id: {type: String, index:true, required: true}
			}
		},
		process: function(data) {
			var data = _.extend(data, {models:exports})
			return data;
		}
	}
	
	//validate inputs and perform multiplication
	exports.User = {
		schema: {
			name: 'User',
			definition: {
				id: {type: Number, index:true, required: true, validate:[validationRules.isEven, 'Must be an even number']},
				name: {type: String, required: true},
				meta: {
					likes: [String],
					birth: { type: Date, default: Date.now }
				}
			}
		},
		process: function(data) {
			return {
				id: 2,
				name: 'ray'
			};
		}
	}


})(typeof exports === 'undefined'? this['models']={}: exports);


