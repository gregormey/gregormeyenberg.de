(function($) {
	$.fn.pong = function(settings)
	{
		settings = $.extend({}, $.fn.pong.defaults, settings);
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

		var Ball=function(elem){
			this.x=100;
			this.y=100;
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

			this.draw(-1,0);

			this.move=function(incX,incY){
				ctx.clearRect(this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
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
				var hit=ctx.player.hit();
				if(hit)
		        {	
		        	incY=hit;
		        	incX=incX*-1;
		        	this.x+=incX;
					this.y+=incY;	
		        };
		        this.draw(incX,incY);
				
			};

		};

		

		return this.each(
			function()
			{
				$me=$(this);
				var me=this;
				var ctx = me.getContext('2d');
				$.fn.pong.ctx[me.id]=ctx;
				ctx.fillStyle = $me.css("color");
				ctx.strokeStyle=  $me.css("color"); 
				ctx.player=new Player(this,PLAYER_LEFT);
				ctx.opponent=new Player(this,PLAYER_RIGHT);
				ctx.ball=new Ball(this);
				

				
    		
			});
	}	
	$.fn.pong.defaults = {};
	$.fn.pong.ctx={};


})(jQuery)