/**
 * Player extention for human controlled player
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var HumanPlayer=function(ctx,side){
	/**
	 * Referenze identification in canvas (ctx) scope
	 * @type {String}
	 */
	this.ctxReference="player";
	/**
	 * sets key events for player controll
	 * @return {Null}
	 */
	this.init=function(){
		$(document).keydown(
			$.proxy(function(event){
				if(event.keyCode==38){ // up
					this.move(PLAYER_MOVEUP);
				}else if(event.keyCode==40){ // down
					this.move(PLAYER_MOVEDOWN);
				}
			},this)
		);

		$(document).keyup(
			$.proxy(function(){
				this.stop();
			},this)	
		);
	};
	
	Player.call(this, ctx,side);
	
};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=HumanPlayer;
};
