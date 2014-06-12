/**
 * Const to set Player on the left side
 * @type {Number}
 */
var PLAYER_LEFT=0;
/**
 * Const to set Player on the left side
 * @type {Number}
 */
var PLAYER_RIGHT=1;

/**
 * Const to indicate Player move up
 * @type {Number}
 */
var PLAYER_MOVEUP=0;

/**
 * Const to indicate Player move down
 * @type {Number}
 */
var PLAYER_MOVEDOWN=1;


/**
 * Player Class, handles Player interactions with user, ball and opponenents
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var Player = function(ctx,side){
	
	/**
	 * initial y cordinate of the player
	 * @type {Number}
	 */
	this.y=15;
	
	/**
	 * Player width
	 * @type {Number}
	 */
	this.width=10;
	/**
	 * Player height
	 * @type {Number}
	 */
	this.height=40;
	/**
	 * Movement Speed
	 * @type {Number}
	 */
	this.speed=1;

	/**
	 * Indicates Player move direction 0=stand, 1=down, -1 = up
	 * @type {Number}
	 */
	this.direct=0;

	
	/**
	 * side (PLAYER_LEFT|PLAYER_RIGHT)
	 * @type {Number}
	 */
	this.side=side?side:PLAYER_LEFT;

	/**
	 * bounding area, amount of pixel around player 
	 * to detect ball hits
	 * @type {Number}
	 */
	this.bounding=2;

	/**
	 * Score Points of the Player
	 * @type {Number}
	 */
	this.score = 0

	/**
	 * Rendering Context
	 * @type {CanvasRenderingContext2D}
	 */
	this.ctx=ctx;

	if(this.side==PLAYER_LEFT){
		/**
		 * place player on left side
		 * @type {Number}
		 */
		this.x=5;

		/**
		 * If player hasball game needs to be started by this player
		 * @type {Boolean}
		 */
		this.hasBall= true;
	}else if(this.side==PLAYER_RIGHT){
		/**
		 * place player on right side
		 * @type {Number}
		 */
		this.x=this.ctx.width-(this.width+5);

		/**
		 * If player hasball game needs to be started by this player
		 * right player always starts the game
		 * @type {Boolean}
		 */
		this.hasBall= false;

	}

	


	/**
	 * increments score points and displays score
	 * in DOM
	 */
	this.addScore=function(){
		this.score++;
		$('#'+this.ctxReference+"Score").html(this.score);
		this.hasBall=true;
		this.ctx.ball.reset();
	}

	/**
	 *  retruns true if ball is in the x range of the Player
	 *  used to check hit
	 * @return {Boolean}
	 */
	this.getHitPoint=function(){
		if(this.side==PLAYER_LEFT)
			return (this.ctx.ball.x-this.ctx.ball.radius) < ((this.x+this.width)+this.bounding);
		else if(this.side==PLAYER_RIGHT)
			return (this.ctx.ball.x+this.ctx.ball.radius) > (this.x-this.bounding);
	};

	/**
	 * returns false if player does not hit the ball and difference between ball and player middle point
	 * if player hist the ball
	 * @return {Boolean|Number}
	 */
	this.hit=function(){
		if(	this.getHitPoint()
					&&
					(this.ctx.ball.y-this.ctx.ball.radius) > (this.y-10) &&
					(this.ctx.ball.y+this.ctx.ball.radius) < (this.y+this.height+10)
				)
					return -((this.y+(this.height/2))-this.ctx.ball.y)/10;
				else
					return false;
	};


	/**
	 * Set new coordinate for Player by speed and direction
	 * and draws the player
	 * @return {Null}
	 */
	this.draw=function(){
		/**
		 * call back function that can be used
		 * to inject behaviour before the draw of a player
		 */
		if(this.beforeDraw){
			this.beforeDraw();
		}
		//checks if player is allowed to move
		h=this.ctx.height;
		var inc=this.speed*this.direct;
		if((this.y+inc)<(h-this.height)
			&& (this.y+inc)>0
		){
			this.y+=inc;
		}
		//no speed booth by default
		this.speed+=this.speedInc?this.speedInc:0;
		this.ctx.fillRect(this.x,this.y,this.width,this.height);
	};

	/**
	 * Sets move interval by the given direction
	 * @param  {Number} direction (PLAYER_MOVEUP|PLAYER_MOVEDOWN)
	 * @return {Null}
	 */
	this.move=function(direction){
		if(direction==PLAYER_MOVEUP){
				this.direct=-1;
		}else if(direction==PLAYER_MOVEDOWN){
				this.direct=1;
		}
	};

	/**
	 * Stops player move by killing the move interval
	 * @return {Null}
	 */
	this.stop=function(){
		this.interval=false;
		this.speed=1;
		this.direct=0;	
	};

	//calls init method if the method is set
	if(this.init){
		this.init();
	}
	

};


if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=Player;
};