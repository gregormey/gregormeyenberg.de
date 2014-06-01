/**
 * Player extention for human controlled player
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var RemotePlayer=function(ctx,side){
	/**
	 * Referenze identification in canvas (ctx) scope
	 * @type {String}
	 */
	this.ctxReference="opponent";

	/**
	 * speed increment
	 * @type {Number}
	 */
	 this.speedInc=0.01;
	 /**
	  * set direction of player
	  * @param  {[type]} data [description]
	  * @return {[type]}      [description]
	  */
	 this.setRemoteData=function(data){
	 	this.move(data);
	 }
	
	Player.call(this, ctx,side);
	
};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=RemotePlayer;
};
