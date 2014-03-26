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

  	error:function(e){
  		throw e;
  	},

  	/**
  	 * [post description]
  	 * @param  {Stirng}   route    route to call
  	 * @param  {[type]}   data     post object
  	 * @param  {Function} callback Callback function on success
  	 * @return {Null}            null
  	 */
  	post:function(route,data,callback){
  		data=querystring.stringify(data); //format parameters to string
  		var options = {
		host: this.host,
  		port: this.port,
  		path: route,
  		method: 'POST',
		  headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': data.length
    	}
		};

		var post_req=http.request(options, function(res) {
	  			res.setEncoding('utf8');
	  			if(callback)	
	  				callback(res);
		});

	  	post_req.on('error', function(e) {
	            Yags.error(e);
	     });
	  	post_req.write(data);
	  	post_req.end();
  	}
};

module.exports=Yags;