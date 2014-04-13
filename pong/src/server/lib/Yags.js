var http=require("http");
var querystring = require('querystring');

/**
 * Provide an interface to tags for node.js
 * @type {Object}
 */
Yags={
	/**
	 * ygas host IP or DNS
	 * @type {String}
	 */
	host: "127.0.0.1",
	/**
	 * TCP port for yags connection
	 * @type {Number}
	 */
  	port: 8000,


  	/**
  	 * [request description]
  	 * @param  {[type]}   options  [description]
  	 * @param  {Function} callback [description]
  	 * @param  {Function} next     [description]
  	 * @return {[type]}            [description]
  	 */
  	request:function(options,callback,next){

  		//add host and port
  		options.host = this.host;  		
  		options.port =this.port;

  		var req=http.request(options, function(res) {
	  			res.setEncoding('utf8');
	  			var body = '';
				  res.on('data', function(chunk) {
				    body += chunk;
				  });
				  res.on('end', function() {
				    if(callback){	
	  					try{
	  						var bodyObj= JSON.parse(body);
	  					}catch (err) {
	  						 next(new Error('Invalid JSON.'));
	  					}
	  					callback(res,bodyObj);
	  				}
				  });


		});

	  	req.on('error', function(e) {
	             next(new Error('Error while YAGS request.'));
	     });
	  	return req;
  	},

  	/**
  	 * [post description]
  	 * @param  {Stirng}   route    route to call
  	 * @param  {[type]}   data     post object
  	 * @param  {Function} callback Callback function on success
  	 * @param  {Function} next error handler
  	 * @return {Null}            null
  	 */
  	post:function(route,data,callback,next){
  		data=querystring.stringify(data); //format parameters to string
  		var options = {
		
  		path: route,
  		method: 'POST',
		  headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': data.length
    	}
		};
		var post_req=this.request(options,callback,next);
	  	post_req.write(data);
	  	post_req.end();
  	},

  	get:function(route,callback,next){
  		var options = {
  		path: route,
  		method: 'GET',
		  headers: {
        	'Content-Type': 'application/json'
    	}
		};
  		var post_req=this.request(options,callback,next);
  		post_req.end();
  	}
};



module.exports=Yags;