//validation routines

(function(exports){
	exports.validateRecord = function(definition, record) {
		if (definition.required && record === undefined ||
			definition.required && record.toString().length === 0 ) {
			//if is required and not present return error message
			return 'field required';
		}
		
		if (definition.hasOwnProperty('type')) {
			//else if is present check that data parses with supplied type to produce snesible result
			//write new function for this in validation-rules
			var _type = definition.type.toString().match(/function\ ([A-Za-z0-9]+)/)[1];
			if (!validationRules.checkVarParsesType(_type, record)) {
				return _type + ' expected';
			}
		}
		
		if (definition.hasOwnProperty('validate')) {
			if (!definition.validate[0](record)) {
				return definition.validate[1];
			}
		}
			
		//else return null
		return null;
	};
	
	//recursively loop through each item in the model's data set and validate it against its schema
	exports.validateModel = function(data) {
		
		var errors = [];
		
		function validate(def, data) {
			var error = validation.validateRecord(def, data);
			if (error) {
				//push to error array
				errors.push({name:key,error:error});
			}
		};
		
		function parse(definition, _data) {
			_data = _data || {};
			//for each key in schema definition
			for (key in definition) {
				var def = definition[key];
				var kt = def.constructor.toString();
				
				if (kt.indexOf('Array') >= 0 && _data.hasOwnProperty(key)) {
					//if the definition contructor is an array validate each object in _data is of the type specified at index 0 in the array					
					for (record in _data[key]) {
						validate({type:def[0]}, _data[key][record]);
					}
					
				} else if (kt.indexOf('Object') >= 0 && typeof(def.type) === 'undefined') {
					//if the definition is an object without a type key we step into it
					parse(def, _data[key]);
				} else {
					//else we validate it
					//if data doesn't conform to type
					validate(def, _data[key]);
				}
			}
		};
		
		parse(this.schema.definition, data);
			
		//return error array if errors, otherwise nothing
		if (errors.length) return errors;
	};

})(typeof exports === 'undefined'? this['validation']={}: exports);
