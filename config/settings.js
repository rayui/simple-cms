var dev = {
	webserver:{
		options:{
			port:8000,
			template_dir:'/../../templates'
		},
		routing:[
			{
				regex:'^\\/css\\/(\\w+\\.css)?',
				type:'static',
				methods:['get'],
				headers:function(headers, params) {
					return {
						'Content-Type':'text/css'
					}	
				},
				path: function(params) {
					return '/../../public/css/' + params[0]
				}
			},
			{
				regex:'^(\\/js(\\/lib)?(\\/[\\w\\-\\.]+\\.js))',
				type:'static',
				methods:['get'],
				headers: function(headers, params) {
					return {
						'Content-Type':'application/javascript'
					}
				},
				path: function(params) {
					return '/../../public' + params[0]
				}
			},
			{
				regex:'^\\/js\\/shared(\\/[\\w\\-\\.]+\\.js)',
				type:'static',
				methods:['get'],
				headers: function(headers, params) {
					return {
						'Content-Type':'application/javascript'
					}
				},
				path: function(params) {
					return '/shared' + params[0]
				}
			},
			{
				regex:'^\\/docs\\/([\\w\\-\\.]+\\.(css|html))?$',
				type:'static',
				methods:['get'],
				headers: function(headers, params) {
					return {
						'Content-Type':'text/' + (params[1] === 'css' ? 'css' : 'html')
					}
				},
				path: function(params) {
					var path = '/../../public/docs/';
					if (!params[0]) {
						return path += 'index.html';
					}
					return '/../../public/docs/' + params[0];
				}
			},
			{
				regex:'^\\/config/$',
				type:'dynamic',
				methods:['get'],
				headers: function(headers, params) {
					return {
						'Content-Type':'text/html'
					}	
				},
				model: 'Config',
				template: 'config'
			},
			{
				regex:'^\\/$',
				type:'dynamic',
				methods:['get','put','post','delete'],
				headers:function(headers, params) {
					return {
						'Content-Type':String(headers['content-type']).indexOf('json') >= 0 ? 'application/json' : 'text/html'
					}
				},
				model: 'User',
				template: 'index'
			},
			{
				regex:'^(\\/[\\w\\-\\.]+)$',
				type:'302',
				methods:['get'],
				headers:function(headers, params) {
					return {
						'Location':params[0] + '/'
					}
				}
				
			},	
			{
				regex:'^.*?',
				methods:['get'],
				type:'404',
				headers:function(headers, params) {
					return {}
				}
			}
		],
		sessions:{},
		database:{
			options:{
				host:'localhost',
				database:'test'
			}
		}
	}
};
