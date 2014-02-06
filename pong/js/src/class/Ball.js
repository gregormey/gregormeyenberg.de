var Ball=function(elem){
	this.x=100;
	this.y=100;
	this.speed=1;
	this.move=false;
	this.radius=5;
	this.elem=elem;

	var ctx=elem.getContext('2d');

	this.draw=function(incX,incY){
		ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);// Outer circle
        ctx.fill();
        
        window.setTimeout("$.fn.pong.ctx['"+this.elem.id+"'].ball.move("+incX+","+incY+")",1);

	};

	this.draw(-2,0);

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
