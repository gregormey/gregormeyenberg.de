/**
 * Player extention for human controlled player
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 * @param {String} opponent Opponent Hash
 */
var HumanPlayer=function(ctx,side,opponent){
	/**
	 * Referenze identification in canvas (ctx) scope
	 * @type {String}
	 */
	this.ctxReference="player";

	/**
	 * Opponent Hash
	 * @type {String}
	 */
	this.opponent=opponent;

	
	/**
	 * speed increment
	 * @type {Number}
	 */
	 this.speedInc=0.01;
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
				}else if(event.keyCode==32){ //start game
					this.hasBall=false
				}

				if(YagsClient){
					YagsClient.sendObjectsToRemote(this.direct);
				}
			},this)
		);

		$(document).keyup(
			$.proxy(function(){
				this.stop();
				if(YagsClient){
					YagsClient.sendObjectsToRemote(this.direct);
				}
			},this)	
		);
	};
	
	Player.call(this, ctx,side);
	
};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=HumanPlayer;
};
