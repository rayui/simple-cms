//validation functions
//requires utilities

(function(exports){
	try {
		var _ = require('underscore');
	} catch(err) {

	}

	var checkVarParsesType = function(type, value) {
		switch (typeof type) {
			case 'string':
				if (new String(value).toString() === value) {
					return true;
				}
				break;
			case 'number':
				if (new Number(value).toString() !== 'NaN') {
					return true;
				}
				break;
			case 'date':
				if (new Date(value).toString() !== 'Invalid Date') {
					return true;
				}
				break;
			case 'boolean':
				if (value.toString() === 'true' || value.toString() === 'false') {
					return true;
				}
				break;
			case 'buffer':
				//to write
				break;
			case 'objectid':
				//to write
				break;
			case 'mixed':
				//to write
				break;
			case 'array':
				if (value.constructor.toString().indexOf('Array') >= 0) {
					return true;
				}	
				break;
			default:
				return false;
				break;
		}
	};

	exports.checkVarParsesType = function(type, value) {
		return checkVarParsesType(type, value);
	}
	
	//check if it is an even number
	exports.isEven = function(value) {
		return (value % 2 === 0);
	}
	
	//check if it is an even number
	exports.isString = function(value) {
		return (checkVarParsesType(String(), value));
	}

	
})(typeof exports === 'undefined'? this['validationRules']={}: exports);
