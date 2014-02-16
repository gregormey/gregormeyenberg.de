var assert = require("assert");
var Player=require("../src/class/player.js");
var ComputerPlayer=require("../src/class/ComputerPlayer.js");
var HTMLCanvasElement=require("./class/HTMLCanvasElementMock.js");
var Window = require("./class/WindowMock.js");
var jQuery=require("./class/jQueryMock.js");

describe('Player', function(){
		// Mock jqQery variable globally
	 $ = new jQuery();
	 var playerLeft=new Player(HTMLCanvasElement(),0);
	 var playerRight=new Player(HTMLCanvasElement(),1);

	it("places Player on the left side of the playground",
  			function(){
  				assert.equal(5,playerLeft.x);
  			}
  		);

	it("places Player on the right side of the playground",
  			function(){
  				assert.equal(385,playerRight.x);
  			}
  	);

	describe('#getHitPoint()',
		function(){
			it("returns true if ball is in the x range of the left player",function(){
				playerLeft.ctx.setBall(16,0);
				assert.equal(true,playerLeft.getHitPoint());
			});

			it("returns true if ball is in the x range of the right player",function(){
				playerRight.ctx.setBall(386,0);
				assert.equal(true,playerRight.getHitPoint());
			});
		}
	);

	describe('#hit()',
		function(){
			
			it("returns the distance of a ball hit to the players center",function(){
				playerLeft.getHitPoint=function(){return true;}// expects that player was hit on the x range
				playerLeft.ctx.setBall(0,50);	
				playerLeft.y=50;
				assert.equal(-2,playerLeft.hit());
			});

			it("returns the false because there is no ball hit",function(){
				playerRight.getHitPoint=function(){return false;}// expects that player was hit on the x range
				playerRight.ctx.setBall(0,50);	
				playerRight.y=100;
				assert.equal(false,playerRight.hit());
			});

		}
	);

	describe('#draw()',function(){
			it("sets new y coordinate for Player by speed and direction and increments speed",
				function(){
					playerRight.direct=1;
					playerRight.speed=1;
					playerRight.y=100;
					playerRight.draw();
					assert.equal(1.2,playerRight.speed);
					assert.equal(101,playerRight.y);	
				}
			);
			it("does not set new y coordinate for Player if player hits lower playground edge",
				function(){
					playerRight.direct=1;
					playerRight.speed=1;
					playerRight.y=260;
					playerRight.draw();
					assert.equal(260,playerRight.y);	
				}
			);
			it("does not set new y coordinate for Player if player hits upper playground edge",
				function(){
					playerRight.direct=-1;
					playerRight.speed=1;
					playerRight.y=0;
					playerRight.draw();
					assert.equal(0,playerRight.y);	
				}
			);
	});

describe('ComputerPlayer',function(){
	var computer=new ComputerPlayer(HTMLCanvasElement(),0);
	describe('#moveToBall()', function(){
		it("movesUp if the ball is above the player",function(){
			computer.y=100;
			playerRight.ctx.setBall(0,50);
			computer.moveToBall();
			assert.equal(true,playerRight.moveUp);
			assert.equal(false,playerRight.moveDown);
		});
		it("movesDown if the ball is below the player",function(){
			computer.y=100;
			playerRight.ctx.setBall(0,150);
			computer.moveToBall();
			assert.equal(false,playerRight.moveUp);
			assert.equal(true,playerRight.moveDown);
		});


	});
});

});