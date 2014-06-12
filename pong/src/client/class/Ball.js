/**
 * Ball class, handles the Ball movements
 * @param {CanvasRenderingContext2D} ctx
 */
var Ball=function(ctx){
	

	/**
	 * Initial Y movement of Ball
	 * @type {Number}
	 */
	this.incY=0;

	/**
	 * Ball move speed
	 * @type {Number}
	 */
	this.speed=1;
	/**
	 * Move interval handle
	 * @type {Boolean}
	 */
	this.move=false;
	/**
	 * Ball radius size
	 * @type {Number}
	 */
	this.radius=5;
	
	

	/**
	 * Rendering Context
	 * @type {CanvasRenderingContext2D}
	 */
	this.ctx=ctx;

	/**
	 * Returns the Player who has the ball or NULL
	 * @return {Player|null} [description]
	 */
	this.getHasBall=function(){
		var hasBall=null;
		if(this.ctx.opponent.hasBall){
			hasBall=this.ctx.opponent;
		}else if(this.ctx.player.hasBall){
			hasBall=this.ctx.player;
		}
		return hasBall;
	}

	/**
	 * sets ball back to middle point after score
	 * @return {Null}      [description]
	 */
	this.reset=function(side){
		var hasBall=this.getHasBall();
		
		if(hasBall!=null){
			//set initial position of ball
			if(hasBall.side==PLAYER_RIGHT){
				this.incX=-2;
				this.x=hasBall.x;
			}else{
				this.incX=2;
				this.x=hasBall.x+this.ctx.opponent.width;
			}
			
			this.y=hasBall.y+(this.ctx.opponent.height/2);

			//set the direction related to the side parameter
			this.incX=hasBall.side==PLAYER_RIGHT?-2:2;
			this.incY=0;
		}

	}

	//initial ball palce
	this.reset();

	/**
	 * relases the ball to start the game
	 * @return {null} 
	 */
	this.release=function(){
		var hasBall=this.getHasBall();
		hasBall.hasBall=false;
		//move ball a bit to not trigger player hit
		if(hasBall.side==PLAYER_RIGHT){
			this.x-=hasBall.width;
		}else{
			this.x+=hasBall.width;
		}

	}

	/**
	 * Draws Ball at current position and triggers move interval
	 * @param  {Number} incX
	 * @param  {Number} incY
	 * @return {Null}
	 */
	this.draw=function(){

		if(this.ctx.opponent.hasBall){ //move ball with player if game is not started
    		this.y=this.ctx.opponent.y+(this.ctx.opponent.height/2);
    	}else if(this.ctx.player.hasBall){
    		this.y=this.ctx.player.y+(this.ctx.player.height/2);
    	}

		this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);// Outer circle
        this.ctx.fill();
        
        //only move if game is started
        if(!this.ctx.opponent.hasBall &&
        	!this.ctx.player.hasBall){
        	this.move();
    	}


	};


	/**
	 * Checks if ball is on the edge's of the playground
	 * and returns rebound coordinate by changeing the direction of the currentValue
	 * @param  {Number} reference (this.x | this.y)
	 * @param  {Number} dimension (x | y)
	 * @param  {Number} increment (incX | incY)
	 * @param  {Number} radius (Ball radius idr. this.radius)
	 * @return {Number} (increment | increment*-1)
	 */
	this.getEdgeHitValue=function(reference, dimension ,increment, radius){
		if((reference+increment)>(dimension-radius) ||
			(reference+increment)<(radius))
		{
			return increment*-1;	
		}else{
			return increment;
		}
	}

	/**
	 * if a player hits the ball the ball will turn its x direction
	 * the y value is higher then more the hit is away from the middle of the player
	 * @param {Number} playerHit
	 * @param {Number} opponentHit
	 * @param {Number} incX
	 */
	this.setPlayerHit=function(playerHit,opponentHit,incX){
		if(playerHit || opponentHit)
        {	
        	this.incX=incX*-1;
        	this.incY=playerHit?playerHit:opponentHit;
        	this.x+=this.incX;
			this.y+=this.incY;	
        };
	}


	/**
	 * checks if balls y coordinate is lower then 0 or higher then with
	 * @param  {Nimber} w witdh of the playground
	 * @return {[type]}   
	 */
	this.checkScore=function(w){
		if(this.x<0){
			this.ctx.opponent.addScore();
		}else if(this.x>w){
			this.ctx.player.addScore();
		}
	}

	/**
	 * Sets next position  of Ball by given direction parameters (incX,incY) 
	 * and checks if the ball hits a player or the outline
	 * @return {void}
	 */
	this.move=function(){
		
		
		//get dimensions
		h=ctx.height;
		w=ctx.width;
		

		//check if ball hits upper or down edges and turns direction or just returns increment valte
		this.incY=this.getEdgeHitValue(this.y,h,this.incY,this.radius);
		
		this.x+=this.incX;
		this.y+=this.incY;
		
		

		//reset x,y coordinates if player hits the ball
		this.setPlayerHit(this.ctx.player.hit(),this.ctx.opponent.hit(),this.incX);

		//checks if a player scores
		this.checkScore(w);
	
	};



};

if(typeof module !== 'undefined'){
//Export Module for require Node.js
module.exports=Ball;
};

