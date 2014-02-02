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
				ctx.player=new Player(this,PLAYER_LEFT);
				ctx.opponent=new Player(this,PLAYER_RIGHT);
				ctx.ball=new Ball(this);			
    		
			});
	}	
	$.fn.pong.defaults = {};
	$.fn.pong.ctx={};


})(jQuery)