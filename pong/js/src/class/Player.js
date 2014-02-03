var PLAYER_LEFT=0;
var PLAYER_RIGHT=1;

var PLAYER_MOVEUP=0;
var PLAYER_MOVEDOWN=1;


var Player = function(elem,side){
	
	this.y=15;
	this.interval=false;
	this.width=10;
	this.height=40;
	this.speed=1;
	this.direct=0;
	this.elem=elem;
	side=side?side:PLAYER_LEFT;
	if(side==PLAYER_LEFT){
		this.x=5;
	}else if(side==PLAYER_RIGHT){
		this.x=$(this.elem).innerWidth()-(this.width+5);
	}

	var ctx=elem.getContext('2d');
	ctx.fillRect(this.x,this.y,this.width,this.height);

	this.hit=function(){
		if((ctx.ball.x-ctx.ball.radius) < 
						(this.x+this.width)
					&&
					(ctx.ball.y-ctx.ball.radius) > this.y &&
					(ctx.ball.y+ctx.ball.radius) < (this.y+this.height)
				)
					return -((this.y+(this.height/2))-ctx.ball.y)/10;
				else
					return false;
	};

	this.draw=function(){
		h=$(this.elem).innerHeight();
		var inc=this.speed*this.direct;
		if((this.y+inc)<(h-this.height)
			&& (this.y+inc)>0
		){
			ctx.clearRect(0,0,this.width+6,h);
			ctx.player.y+=inc;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
			this.speed+=0.2;
	};

	this.move=function(direction){
		if(direction==PLAYER_MOVEUP){
			if(!this.interval){
				this.direct=-1;
				this.interval=window.setInterval("$.fn.pong.ctx['"+this.elem.id+"'].player.draw();",1);
			}
		}else if(direction==PLAYER_MOVEDOWN){
			if(!this.interval){	
				this.direct=1;
				this.interval=window.setInterval("$.fn.pong.ctx['"+this.elem.id+"'].player.draw();",1);
			}
		}
	};

	this.stop=function(){
		window.clearInterval(this.interval);
		this.interval=false;
		this.speed=1;
		this.direct=0;	
	};

	this.init();

};