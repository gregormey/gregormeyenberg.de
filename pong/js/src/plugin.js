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
				ctx.fillStyle = $me.css("color");
				ctx.strokeStyle=  $me.css("color");
				ctx.ball=new Ball(this); 
				ctx.player=new HumanPlayer(this,PLAYER_LEFT);
				ctx.opponent=new ComputerPlayer(this,PLAYER_RIGHT);
						
    		
			});
	}	
	$.fn.pong.defaults = {};
	$.fn.pong.ctx={};


})(jQuery)