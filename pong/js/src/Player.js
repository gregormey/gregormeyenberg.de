var PLAYER_LEFT=0;
var PLAYER_RIGHT=1;

var PLAYER_MOVEUP=0;
var PLAYER_MOVEDOWN=1;

var PLAYER_HUMAN=0;
var PLAYER_COMPUTER=1;

var Player = function(elem,side,ruledBy){
	
	this.y=15;
	this.move=false;
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
			if(!ctx.move){
				ctx.player.direct=-1;
				ctx.move=window.setInterval("$.fn.pong.ctx['"+me.id+"'].player.draw();",1);
			}
		}else if(direction==PLAYER_MOVEDOWN){
			if(!ctx.move){	
				ctx.player.direct=1;
				ctx.move=window.setInterval("$.fn.pong.ctx['"+me.id+"'].player.draw();",1);
			}
		}
	};

	this.initAsHuman=function(){
		this.isHuman=true;
		this.isComputer=false;
		$(document).keydown(
			function(event){
				if(event.keyCode==38){
					if(!ctx.move){
						ctx.player.direct=-1;
						ctx.move=window.setInterval("$.fn.pong.ctx['"+me.id+"'].player.move();",1);
					}
				}else if(event.keyCode==40){
					if(!ctx.move){	
						ctx.player.direct=1;
						ctx.move=window.setInterval("$.fn.pong.ctx['"+me.id+"'].player.move();",1);
					}
				}
			}
		);

		$(document).keyup(
			function(){
				window.clearInterval(ctx.move);
				ctx.move=false;
				ctx.player.speed=1;
				ctx.player.direct=0;	
			}	
		);
	};

	this.initAsComputer=function(){
		this.isHuman=false;
		this.isComputer=true;
	};
	
	if(ruledBy==PLAYER_HUMAN){
		this.initAsHuman();
	}else if(ruledBy==PLAYER_COMPUTER){
		this.initAsComputer();
	}

};