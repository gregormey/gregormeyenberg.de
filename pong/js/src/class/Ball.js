/**
 * Ball class, handles the Ball movements
 * @param {HTMLCanvasElement} elem
 */
var Ball=function(elem){
	/**
	 * initial x coordinate
	 * @type {Number}
	 */
	this.x=100;
	/**
	 * initial y coordinate
	 * @type {Number}
	 */
	this.y=100;
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
	 * Canvas Element
	 * @type {HTMLCanvasElement}
	 */
	this.elem=elem;

	/**
	 * Rendering Context
	 * @type {CanvasRenderingContext2D}
	 */
	var ctx=elem.getContext('2d');

	/**
	 * Draws Ball at current position and triggers move interval
	 * @param  {Number} incX
	 * @param  {Number} incY
	 * @return {Null}
	 */
	this.draw=function(incX,incY){
		ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);// Outer circle
        ctx.fill();
        
        window.setTimeout("$.fn.pong.ctx['"+this.elem.id+"'].ball.move("+incX+","+incY+")",1);

	};

	/**
	 * initian callof the draw method
	 */
	this.draw(-2,0);

	/**
	 * Sets next position  of Ball by given direction parameters (incX,incY) 
	 * and checks if the ball hits a player or the outline
	 * @param  {[type]} incX
	 * @param  {[type]} incY
	 * @return {[type]}
	 */
	this.move=function(incX,incY){
		ctx.clearRect(this.x-this.radius,this.y-this.radius-1,this.radius*2+ 2,this.radius*2+ 2);
		h=$(this.elem).innerHeight();
		w=$(this.elem).innerWidth();
		
	
		if((this.y+incY)>(h-this.radius) ||
			(this.y+incY)<(this.radius)){
			incY=incY*-1;	
		}
		
		if((this.x+incX)>(w-this.radius) ||
			(this.x+incX)<(this.radius)){
			incX=incX*-1;	
		}
		
		this.x+=incX;
		this.y+=incY;
		var playerHit=ctx.player.hit();
		var opponentHit=ctx.opponent.hit();
			
		if(playerHit || opponentHit)
        {	
        	incY=playerHit?playerHit:opponentHit;
        	incX=incX*-1;
        	this.x+=incX;
			this.y+=incY;	
        };
        this.draw(incX,incY);
	
	};

};
