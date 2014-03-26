var Yags=require("../lib/Yags.js");

/**
 * Player Class
 * @param {array of funcions} call back events
 * Supported events are:
 * onLoad -> player is loaded
 */
var Player=function(events){
	this.hash=null;
  this.events=events;

};

Player.prototype.login=function(nick,password){};

/**
 * [create description]
 * @param  {[type]} nick      [description]
 * @param  {[type]} mail      [description]
 * @param  {[type]} password  [description]
 */
Player.prototype.create=function(nick,mail,password){
	var me=this;
  Yags.post("/player/new",
            {Nick:nick,
              Mail:mail,
              Password:password},
              function(res){
                if(me.events['load'])  
                  me.events['load'](res);
              }
              );
};

module.exports=Player;