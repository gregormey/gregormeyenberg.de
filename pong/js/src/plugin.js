/**
 * initialisation of iQuery Plugin
 */

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
				$.fn.pong.ctx[me.id]=ctx;
				/**
				 * Set style of canvas		 
				 * * 
				 */
				ctx.fillStyle = $me.css("color");
				ctx.strokeStyle=  $me.css("color");
				/**
				 * Ball entity
				 * @type {Ball}
				 */
				ctx.ball=new Ball(this);
				/**
				 * Player entity
				 * @type {HumanPlayer}
				 */
				ctx.player=new HumanPlayer(this,PLAYER_LEFT);
				/**
				 * Opponent Entity
				 * @type {ComputerPlayer}
				 */
				ctx.opponent=new ComputerPlayer(this,PLAYER_RIGHT);
						
    		
			});
	}	
	$.fn.pong.defaults = {};
	$.fn.pong.ctx={};


})(jQuery)