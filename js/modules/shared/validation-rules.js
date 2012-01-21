//validation functions
//requires utilities

(function(exports){
	try {
		var _ = require('underscore');
	} catch(err) {

	}
	
	exports.isEven = function(value) {
		return (value % 2 === 0);
	}
	
})(typeof exports === 'undefined'? this['validationRules']={}: exports);
