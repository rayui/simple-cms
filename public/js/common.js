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
			this.clearErrors();
			for (error in errors) {
				$('input[name="' + error.name + '"]').addClass('error');
				$('div#errors').append('<span>' + errors[error].name + ': ' + errors[error].error + '</span>');
			}
		},

		//- clears existing error notifications
		clearErrors: function() {
			$('input').removeClass('error');
			$('div#errors').empty();
		},
		
		//- when inputs change, save the model to the server
		//- if it fails validation, the error function will kick in
		//- when a success response is received, this will trigger the model's change event and causing it to render
		submit:function() {	
			var renderError = this.renderError;
			var clearErrors = this.clearErrors;
			
			this.model.set({
				id:$('#id').val(),
				name:$('#name').val()
			});

			this.model.save(null, {
				error: function(model, errors) {

				}
			});
			
			return false;
		},
		
		//- render result on server response
		render: function() {
			this.clearErrors();
			$('div#error').text(
				this.model.get('id') +
				' * ' +
				this.model.get('name') +
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
