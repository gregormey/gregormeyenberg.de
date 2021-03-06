/**
 * initialisation of iQuery Plugin
 */

(function($) {
	$.fn.pong = function(settings)
	{

		settings = $.extend({}, $.fn.pong.defaults, settings);
		//collection for objects to draw
		var objects=[];
		var gameLoop=false;

		var loop=function(){

			//clean playground(s)
			$.fn.pong.ctx.forEach(
				function(ctx){
					ctx.clearRect(0, 0, ctx.width, ctx.height);
				}
			);

			//draw objects
			objects.forEach(
				function(object){
					
					//calls draw interface
					object.draw();
				}
			);
		};

		
		

		//start rendering interval
		window.setInterval(loop,1000/settings.fps);

		return this.each(
			function()
			{
				$me=$(this);
				var me=this;
				var ctx = me.getContext('2d');

				//set canvas dimensions
				ctx.width=$me.innerWidth();
				ctx.height=$me.innerHeight();

				
				$.fn.pong.ctx.push(ctx);
				/**
				 * Set style of canvas		 
				 * * 
				 */
				ctx.fillStyle = $me.css("color");
				ctx.strokeStyle=  $me.css("color");
				
				
				//if opponent is set
				//

				if(YagsClient.opponent!=null){
					/**
					 * Player entity
					 * @type {HumanPlayer}
					 */
					ctx.player=new HumanPlayer(ctx,settings.player_side,YagsClient.opponent);

					/**
					 * Opponent Entity
					 * @type {RemotePlayer}
					 */
					ctx.opponent=new RemotePlayer(ctx,settings.opponent_side);

				}else{
		
					/**
					 * Player entity
					 * @type {HumanPlayer}
					 */
					ctx.player=new HumanPlayer(ctx,PLAYER_LEFT);
					/**
					 * Opponent Entity
					 * @type {ComputerPlayer}
					 */
					ctx.opponent=new ComputerPlayer(ctx,PLAYER_RIGHT);
				}
				
				/**
				 * Ball entity
				 * @type {Ball}
				 */
				ctx.ball=new Ball(ctx);
				
				//register game objects to be drawn
				objects.push(ctx.ball);
				objects.push(ctx.player);
				objects.push(ctx.opponent);

    		
			});
	}	
	$.fn.pong.defaults = {
		/**
		 * frames per secound
		 * @type {Number}
		 */
		fps:100
	};
	$.fn.pong.ctx=[];


})(jQuery)