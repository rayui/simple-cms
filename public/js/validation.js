//validation routines

(function(exports){
	exports.validateRecord = function(definition, record) {
		if (definition.required && record === undefined) {
			//if is required and not present return error message
			return 'field required';
		} else if (definition.required && record.toString().length === 0) {
			//else if is required and has string length of 0
			return 'field required';
		}
		
		if (definition.hasOwnProperty('type')) {
			console.log(validationRules.checkType(definition.type()));
			console.log(record + ' ' + validationRules.checkType(record));
			//else if is present check that data parses with supplied type to produce snesible result
			//write new function for this in validation-rules
			if (validationRules.checkType(definition.type()) !== validationRules.checkType(record)) {
				return validationRules.checkType(definition.type()) + ' expected'; 
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
		
		function parse(definition, _data) {
			_data = _data || {};
			//for each keyin schema definition
			for (key in definition) {
				var kt = validationRules.checkType(definition[key]);
				var rt = validationRules.checkType(definition[key].type);
				
				if (kt === 'array' && _data.hasOwnProperty(key)) {
					//if the definition is an array validate each object in _data is of the type specified at index 0 in the array					
					for (record in _data[key]) {
						var error = validation.validateRecord({type:definition[key][0]}, _data[key][record]);
						if (error) {
							//push to error array
							errors.push({name:key + ':' + record,error:error});
						}
					}
					
				} else if (kt === 'object' && rt === 'undefined') {
					//if the definition is an object without a type key we step into it
					parse(definition[key], _data[key]);
				} else {
					//else we validate it
					//if data doesn't conform to type
					var error = validation.validateRecord(definition[key], _data[key]);
					if (error) {
						//push to error array
						errors.push({name:key,error:error});
					}
				}
			}
		};
		
		parse(this.schema.definition, data);
			
		//return error array
		return errors;
	};

})(typeof exports === 'undefined'? this['validation']={}: exports);
