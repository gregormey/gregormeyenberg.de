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
			(reference+increment)<(radius)){
			return increment*-1;	
		}else{
			return increment;
		}
	}

	/**
	 * Sets next position  of Ball by given direction parameters (incX,incY) 
	 * and checks if the ball hits a player or the outline
	 * @param  {[type]} incX
	 * @param  {[type]} incY
	 * @return {[type]}
	 */
	this.move=function(incX,incY){
		//clear ball
		ctx.clearRect(this.x-this.radius,this.y-this.radius-1,this.radius*2+ 2,this.radius*2+ 2);
		
		//get dimensions
		h=$(this.elem).innerHeight();
		w=$(this.elem).innerWidth();
		

		//check if ball hits upper or down edges and turns direction
		incY=this.getEdgeHitValue(this.y,h,incY,this.radius);
		incX=this.getEdgeHitValue(this.x,w,incX,this.radius);
		
		
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

module.exports=Ball;


