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
 * @param {HTMLCanvasElement} elem
 * @param {Number} side (PLAYER_LEFT|PLAYER_RIGHT)
 */
var Player = function(elem,side){
	
	/**
	 * initial y cordinate of the player
	 * @type {Number}
	 */
	this.y=15;
	/**
	 * movement interval handle
	 * @type {Boolean}
	 */
	this.interval=false;
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
	 * Canvas element
	 * @type {HTMLCanvasElement}
	 */
	this.elem=elem;
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

	if(this.side==PLAYER_LEFT){
		/**
		 * place player on left side
		 * @type {Number}
		 */
		this.x=5;
	}else if(this.side==PLAYER_RIGHT){
		/**
		 * place player on right side
		 * @type {Number}
		 */
		this.x=$(this.elem).innerWidth()-(this.width+5);
	}

	/**
	 * Rendering Context
	 * @type {CanvasRenderingContext2D}
	 */
	this.ctx=elem.getContext('2d');

	//Draw Player initially
	this.ctx.fillRect(this.x,this.y,this.width,this.height);

	/**
	 * increments score points and displays score
	 * in DOM
	 */
	this.addScore=function(){
		this.score++;
		$('#'+this.ctxReference+"Score").html(this.score);
		this.ctx.ball.reset(this.side);
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
		h=$(this.elem).innerHeight();
		var inc=this.speed*this.direct;
		if((this.y+inc)<(h-this.height)
			&& (this.y+inc)>0
		){
			this.ctx.clearRect(this.x,0,this.width+6,h);
			this.y+=inc;
			this.ctx.fillRect(this.x,this.y,this.width,this.height);
		}
			this.speed+=0.2;
	};

	/**
	 * Sets move interval by the given direction
	 * @param  {Number} direction (PLAYER_MOVEUP|PLAYER_MOVEDOWN)
	 * @return {Null}
	 */
	this.move=function(direction){
		if(direction==PLAYER_MOVEUP){
			if(!this.interval){
				this.direct=-1;
				this.interval=window.setInterval("$.fn.pong.ctx['"+this.elem.id+"']."+this.ctxReference+".draw();",1);
			}
		}else if(direction==PLAYER_MOVEDOWN){
			if(!this.interval){	
				this.direct=1;
				this.interval=window.setInterval("$.fn.pong.ctx['"+this.elem.id+"']."+this.ctxReference+".draw();",1);
			}
		}
	};

	/**
	 * Stops player move by killing the move interval
	 * @return {Null}
	 */
	this.stop=function(){
		window.clearInterval(this.interval);
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