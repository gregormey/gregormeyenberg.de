(function($) {
	$.fn.pong = function(settings)
	{
		settings = $.extend({}, $.fn.pong.defaults, settings);
		
		return this.each(
			function()
			{
				$me=$(this);
				var me=this;
				var ctx = me.getContext('2d');
				ctx.fillStyle = $me.css("color");
				ctx.strokeStyle=  $me.css("color"); 
				ctx.player={
					"x":5,
					"y":15,
					"move":false,
					"width":10,
					"height":40,
					"speed"	:1,
					"direct":0,
					"hitBall":function(){
						if((ctx.ball.x-ctx.ball.radius) < 
								(ctx.player.x+ctx.player.width)
							&&
							(ctx.ball.y-ctx.ball.radius) > ctx.player.y &&
							(ctx.ball.y+ctx.ball.radius) < (ctx.player.y+ctx.player.height)
						)
							return true;
						else
							return false;
							
					}
				};
				
				ctx.ball={
					"x":100,
					"y":100,
					"move":false,
					"radius":5	
				};
				
				$(document).keydown(
					function(event){
						if(event.keyCode==38){
							if(!ctx.move){
								ctx.player.direct=-1;
								ctx.move=window.setInterval("$.fn.pong.movePlayer('"+me.id+"')",1);
							}
						}else if(event.keyCode==40){
							if(!ctx.move){	
								ctx.player.direct=1;
								ctx.move=window.setInterval("$.fn.pong.movePlayer('"+me.id+"')",1);
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
				
    			ctx.fillRect(ctx.player.x,ctx.player.y,ctx.player.width,ctx.player.height);  
    			//ctx.arc(0,0,2,0,Math.PI*2,true); 
    			 ctx.beginPath();
          		 ctx.arc(ctx.ball.x,ctx.ball.y,ctx.ball.radius,0,Math.PI*2,true);// Outer circle
         			ctx.fill();
         		window.setTimeout("$.fn.pong.moveBall('"+me.id+"',-1,0)",1);
				//Ausfallswinkel = (x*Padgeschwindigkeit+(180°-Einfallswinkel);
    			//ctx.clearRect(45,45,60,60);  
    			//ctx.strokeRect(50,50,50,50);	
			});
	}	
	$.fn.pong.defaults = {};
	$.fn.pong.moveBall=function(id,incX,incY){
		elem=$("#"+id)[0];
		ctx=elem.getContext('2d');
		ctx.clearRect(ctx.ball.x-ctx.ball.radius,ctx.ball.y-ctx.ball.radius,ctx.ball.radius*2,ctx.ball.radius*2);
		h=$(elem).innerHeight();
		w=$(elem).innerWidth();
		
		
		if((ctx.ball.y+incY)>(h-ctx.ball.radius) ||
			(ctx.ball.y+incY)<(ctx.ball.radius)){
			incY=incY*-1;	
		}
		
		if((ctx.ball.x+incX)>(w-ctx.ball.radius) ||
			(ctx.ball.x+incX)<(ctx.ball.radius)){
			incX=incX*-1;	
		}
		
		ctx.ball.x+=incX;
		ctx.ball.y+=incY;
		
		if(ctx.player.hitBall())
        {
        	incY+=(ctx.player.speed)*(ctx.player.direct*-1);
        	incX=incX*-1;
        	ctx.ball.x+=incX;
			ctx.ball.y+=incY;	
        }
		ctx.beginPath();
        ctx.arc(ctx.ball.x,ctx.ball.y,ctx.ball.radius,0,Math.PI*2,true);// Outer circle
        ctx.fill();
        
        window.setTimeout("$.fn.pong.moveBall('"+id+"',"+incX+","+incY+")",1);
	};
		
	$.fn.pong.movePlayer=function(id,direct){
		elem=$("#"+id)[0];
		ctx=elem.getContext('2d');
		h=$(elem).innerHeight();
		var inc=ctx.player.speed*ctx.player.direct;
		if((ctx.player.y+inc)<(h-ctx.player.height)
		&& (ctx.player.y+inc)>0
		){
			ctx.clearRect(0,0,ctx.player.width+6,h);
			ctx.player.y+=inc;
			ctx.fillRect(ctx.player.x,ctx.player.y,ctx.player.width,ctx.player.height);
		}
		ctx.player.speed+=0.2;
	};
	

})(jQuery)