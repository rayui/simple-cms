//validation functions
//requires utilities

(function(exports){
	try {
		var _ = require('underscore');
	} catch(err) {

	}
	
	var checkType = function(value) {
		var vType, vStr;
		
		//first check for undefined
		if (typeof value !== 'undefined') {
			vType = value.constructor.toString();
			vStr = value.toString();
		} else {
			return 'undefined';
		}
		
		if (vType.indexOf('Function') >= 0) {
			//then check for Function
			return typeof Function();
		} else if (vType.indexOf('Object') >= 0) {
			//then check for Object
			return typeof Object();
		} else if (vType.indexOf('Array') >= 0) {
			//then check for Array
			return 'array';
		} else if (vStr === 'true' || vStr === 'false') {
			//then check for Boolean
			return typeof Boolean();
		} else if (vType.indexOf('Number') >= 0) {
			//then check for Number
			return typeof Number();
		} else if (!isNaN(Date.parse(vStr))) {
			//then check for Date
			return 'date';
		} else if (vType.indexOf('String') >= 0) {
			//else if it is a String
			return typeof String();
		} else {
			return 'unknown';
		}
	}
	
	//function to guess what type of data is in an object
	exports.checkType = function (value) {
		return checkType(value);
	}
	
	//check if it is an even number
	exports.isEven = function(value) {
		return (value % 2 === 0);
	}
	
	//check if it is an even number
	exports.isString = function(value) {
		return (checkType(value) === 'string');
	}

	
})(typeof exports === 'undefined'? this['validationRules']={}: exports);
