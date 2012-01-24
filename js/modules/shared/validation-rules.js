//validation functions
//requires utilities

(function(exports){
	try {
		var _ = require('underscore');
	} catch(err) {

	}

	var checkVarParsesType = function(type, value) {
		//if true, we return
		//we are not testing for required value so undefined is okay
		//we leave type conversion til later
		
		if (typeof value === 'undefined') {
			return true;
		}
		
		switch (type) {
			case 'String':
				if (new String(value).toString() === value) {
					return true;
				}
				break;
			case 'Number':
				if (new Number(value).toString() !== 'NaN') {
					return true;
				}
				break;
			case 'Date':
				if (new Date(value).toString() !== 'Invalid Date') {
					return true;
				}
				break;
			case 'Boolean':
				if (value.toString() === 'true' || value.toString() === 'false') {
					return true;
				}
				break;
			case 'Buffer':
				//to write
				break;
			case 'ObjectId':
				//to write
				break;
			case 'Mixed':
				//to write
				break;
			case 'Array':
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
