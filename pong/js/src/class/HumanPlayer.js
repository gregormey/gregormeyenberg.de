
var HumanPlayer=function(elem,side){

	this.init=function(){
		this.isHuman=true;
		this.isComputer=false;
		$(document).keydown(
			$.proxy(function(event){
				if(event.keyCode==38){
					this.move(PLAYER_MOVEUP);
				}else if(event.keyCode==40){
					this.move(PLAYER_MOVEDOWN);
				}
			},this)
		);

		$(document).keyup(
			$.proxy(function(){
				this.stop();
			},this)	
		);
	};
	
	Player.call(this, elem,side);
	
};
