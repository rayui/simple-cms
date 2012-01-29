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
			'click input[type="submit"]':		'submit',
			'change input[type="text"]':		'update'
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
		
		update: function() {
			var success = this.model.set({
				id:$('input[name="id"]').val(),
				name:$('input[name="name"]').val()
			});
			success ? $('input[type="submit"]').attr('disabled', false) : $('input[type="submit"]').attr('disabled', true);
		},
		
		//- when inputs change, save the model to the server
		//- if it fails validation, the error function will kick in
		//- when a success response is received, this will trigger the model's change event and causing it to render
		submit:function(e) {
			this.model.save();
			
			return false;
		},
		
		//- render result on server response
		render: function() {
			this.clearErrors();
			$('div#model').text(
				this.model.get('id') +
				': ' +
				this.model.get('name')
			);
		},
		
		//- init
		initialize:function() {		
			//-- instantiate Model inside View and bind new model's change event to this View's render method
			//-- note that this is backbone's bind, different from jQuery
			this.model = new Model();
			this.model.schema = schemas.User;
			this.model.bind('error', this.renderErrors, this);
			this.model.bind('change', this.render, this);
		}
	});
	
	//instantiate view	
	new View();
});
