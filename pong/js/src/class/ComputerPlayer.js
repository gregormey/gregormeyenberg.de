/**
 * Player extention for computer controlled player
 * @param {HTMLCanvasElement} elem
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var ComputerPlayer=function(elem,side){
	/**
	 * Referenze identification in canvas (ctx) scope
	 * @type {String}
	 */
	this.ctxReference="opponent";
	/**
	 * flags if a move down is already triggered
	 * @type {Boolean}
	 */
	this.moveDown=false;
	/**
	 * flags if a move up is already triggered
	 * @type {Boolean}
	 */
	this.moveUp=false;

	/**
	 * moves the player to the ball controlled by the middelpoint of player
	 * and the ball coordinates
	 * @return {Null}
	 */
	this.moveToBall=function(){
		var middle=this.y+(this.height/2);
		if(this.ctx.ball.y<middle && !this.moveUp){
			this.stop();
			this.moveUp=true;
			this.moveDown=false;
			this.move(PLAYER_MOVEUP);
		}
		else if (this.ctx.ball.y>middle && !this.moveDown){
			this.stop();
			this.moveUp=false;
			this.moveDown=true;
			this.move(PLAYER_MOVEDOWN);
		}
	};

	
	/**
	 * initial call of the move method
	 * @return {[type]}
	 */
	this.init=function(){
		window.setInterval("$.fn.pong.ctx['"+this.elem.id+"']."+this.ctxReference+".moveToBall();",1);
	};
	
	Player.call(this, elem,side);
	
};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=ComputerPlayer;
};
