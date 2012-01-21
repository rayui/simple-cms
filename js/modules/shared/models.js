//data models

(function(exports){
	try {
		var validationRules = require('./validation-rules.js');
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
			return data;
		}
	}
	
	//validate inputs and perform multiplication
	exports.User = {
		schema: {
			name: 'Default',
			definition: {
				id: {type: Number, index:true, required: true, validate:[validationRules.isEven, 'Must be unique']},
				name: {type: String, index:true, required: true, validate:[validationRules.isString, 'Must be unique']},
			}
		},
		process: function(data) {
			return data;
		}
	}


})(typeof exports === 'undefined'? this['models']={}: exports);


