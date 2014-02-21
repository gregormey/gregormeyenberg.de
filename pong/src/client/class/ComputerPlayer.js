/**
 * Player extention for computer controlled player
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var ComputerPlayer=function(ctx,side){
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
	 * and the ball coordinates, uses before draw hook method of player 
	 * @return {Null}
	 */
	this.beforeDraw=function(){
		var middle=this.y+(this.height/2);
		if(this.ctx.ball.y<middle){
			
			//only of if distance is greater then 5 px
			if((middle-this.ctx.ball.y)>5){
				this.moveUp=true;
				this.moveDown=false;
				this.move(PLAYER_MOVEUP);
			}else{
				this.stop();
			}
		}
		else if (this.ctx.ball.y>middle){	
				
			//only of if distance is greater then 5 px
			if((this.ctx.ball.y-middle)>5){
				this.moveUp=false;
				this.moveDown=true;
				this.move(PLAYER_MOVEDOWN);
			}else{
				this.stop();
			}
		}else{
			this.stop();
		}
	};
	//computer should be faster for abalcing reasons
	this.speedInc=0.01;
	
	Player.call(this, ctx,side);
	
	
};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=ComputerPlayer;
};
