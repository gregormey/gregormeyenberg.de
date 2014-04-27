var http=require("http");
var querystring = require('querystring');

/**
 * REST API wrapper for YAGS 
 * @type {Object}
 */
Yags={
	/**
	 * YAGS host IP or DNS
	 * @type {String}
	 */
	host: "127.0.0.1",
	/**
	 * TCP port for yags connection
	 * @type {Number}
	 */
  	port: 8000,


  	/**
  	 * Does a request to YAGS
  	 * @param  {Objectt}   Request options (Route, Header, Method, Body data)  
  	 * @param  {Function} callback  will be called in case of a successfull request with the response object
  	 * @param  {Function} next      will be called in case of a not successful request
  	 * @return {null}           
  	 */
  	request:function(options,callback,next){

  		//add host and port to options
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
	  						 next(new Error('Invalid JSON:'+body));
	  					}
	  					callback(res,bodyObj);
	  				}
				  });


		});
      // Request error
	  	req.on('error', function(e) {
	             next(new Error('Error while YAGS request.'));
	     });
	  	return req;
  	},

  	/**
  	 * Does a request with body parameters.
     * Used for PUT or POST requests 
  	 * @param  {Stirng}   route    route to call
  	 * @param  {[type]}   data     post data object
  	 * @param  {Function} callback Callback function on success
  	 * @param  {Function} next error handler
  	 * @param  {Function} method PUT or POST
  	 * @return {Null}            null
  	 */
  	write:function(route,data,callback,next,method){
  		data=querystring.stringify(data); //format parameters to string
  		var options = {
		
  		path: route,
  		method: method,
		  headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': data.length
    	}
		};
		var post_req=this.request(options,callback,next);
	  	post_req.write(data);
	  	post_req.end();
  	},

    /**
     * Does a POST call to yags
     * @param  {Stirng}   route    route to call
     * @param  {[type]}   data     post data object
     * @param  {Function} callback Callback function on success
     * @param  {Function} next error handler
     * @return {null}           
     */
  	post:function(route,data,callback,next){
  		Yags.write(route,data,callback,next,"POST");
  	},

    /**
     * Does a PUT call to yags
     * @param  {Stirng}   route    route to call
     * @param  {[type]}   data     post data object
     * @param  {Function} callback Callback function on success
     * @param  {Function} next error handler
     * @return {null}           
     */
  	put:function(route,data,callback,next){
  		Yags.write(route,data,callback,next,"PUT");
  	},

    /**
     * Does a GET call to yags
     * @param  {Stirng}   route    route to call
     * @param  {Function} callback Callback function on success
     * @param  {Function} next error handler
     * @return {null}  
     */
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


// Export for require
module.exports=Yags;