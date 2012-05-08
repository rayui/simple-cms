//data models

(function(exports){
		
	try {
		var validationRules = require('./validation-rules.js');
	} catch(err) {
		var validationRules = this.validationRules || {};
	}
	
	exports.Default = {
		name: 'Default',
		definition: {}
	},
	
	exports.Config = {
		name: 'Config',
		definition: {
		    id: {type: String, index:true, required: true}
		}
	},
	
	exports.User = {
		name: 'User',
		definition: {
			id: {type: Number, index:true, required: true, validate:[validationRules.isEven, 'Must be an even number']},
			name: {type: String, index:true, required: true},
			meta: {
				likes: [String],
				birth: { type: Date, default: Date.now }
			}
		}
	}
	
	
})(typeof exports === 'undefined'? this['schemas']={}: exports);
