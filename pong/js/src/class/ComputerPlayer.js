var ComputerPlayer=function(elem,side){
	this.ctxReference="opponent";
	this.moveDown=false;
	this.moveUp=false;

	this.moveToBall=function(){
		var middle=this.y+(this.height/2);
		if(this.ctx.ball.y<middle && !this.moveUp){
			this.stop();
			this.moveUp=true;
			this.moveDown=false;
			this.move(PLAYER_MOVEUP);
		}
		else if (this.ctx.ball.y>middle && !this.moveDown){
			this.stop();
			this.moveUp=false;
			this.moveDown=true;
			this.move(PLAYER_MOVEDOWN);
		}
	};

	this.init=function(){
		window.setInterval("$.fn.pong.ctx['"+this.elem.id+"']."+this.ctxReference+".moveToBall();",1);
	};
	
	Player.call(this, elem,side);
	
};