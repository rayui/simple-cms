//on jquery init
$(function($){
	//simplest possible model
	var Model = Backbone.Model.extend({
		url:'/',
		validate:validation.validateModel
	});

	//basic view for multiplier calculator
	var View = Backbone.View.extend({
		//- element to bind view to
		el:$('#page'),
		
		//- default events
		events:{
			'click input[type="submit"]':		'submit'
		},

		//- renders and error notification
		renderErrors: function(model, errors) {
			clearErrors();
			for (error in errors) {
				$('input[name="' + error.name + '"]').addClass('error');
				$('div#errors').append('<span>' + error.name + ': ' + error.error + '</span>');
			}
		},

		//- clears existing error notifications
		clearErrors: function() {
			$('input').removeClass('error');
			$('div#result').empty();
		},
		
		//- when inputs change, save the model to the server
		//- if it fails validation, the error function will kick in
		//- when a success response is received, this will trigger the model's change event and causing it to render
		submit:function() {	
			var renderError = this.renderError;
			var clearErrors = this.clearErrors;
			
			this.model.set({id:1});

			this.model.save(null, {
				error: function(model, errors) {

				}
			});
			
			return false;
		},
		
		//- render result on server response
		render: function() {
			this.clearErrors();
			$('div#result').text(
				this.model.get('operand1') +
				' * ' +
				this.model.get('operand2') +
				' = ' +
				this.model.get('result')
			);
		},
		
		//- init
		initialize:function() {		
			//-- instantiate Model inside View and bind new model's change event to this View's render method
			//-- note that this is backbone's bind, different from jQuery
			this.model = new Model();
			this.model.schema = models.User.schema;
			this.model.bind('change', this.render, this);
			this.model.bind('error', this.renderErrors, this);
		}
	});
	
	//instantiate view	
	new View();
});
