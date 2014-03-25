var http=require("http");
var querystring = require('querystring');

var Player=function(config){
	this.hash=null;
	this.config=config;
};

Player.prototype.login=function(nick,password){};

/**
 * [create description]
 * @param  {[type]} nick      [description]
 * @param  {[type]} mail      [description]
 * @param  {[type]} password  [description]
 * @param  {[type]} onSuccess [description]
 * @param  {[type]} onError   [description]
 * @return {[type]}           [description]
 */
Player.prototype.create=function(nick,mail,password,onSuccess,onError){
	var data = querystring.stringify({
      Nick: nick,
      Mail: mail,
      Password:password
    });

	var options = {
		host: this.config.host,
  		port: this.config.port,
  		path: '/player/new',
  		method: 'POST',
		  headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': data.length
    	}
	};

	var post_req=http.request(options, function(res) {
  			res.setEncoding('utf8');
  			
  			res.on('error', function(e) {
  					onError(e);
			});
	});
  post_req.write(data);
  post_req.end();
};

module.exports=Player;