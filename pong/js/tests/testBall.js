var assert = require("assert");
var Ball=require("../src/class/Ball.js");
var HTMLCanvasElement=require("./class/HTMLCanvasElementMock.js");
var Window = require("./class/WindowMock.js");
var jQuery=require("./class/jQueryMock.js");
PLAYER_RIGHT=1
describe('Ball', function(){
	// Mock window variable globally
	 window = new Window();
  	 // Mock jqQery variable globally
   $ = new jQuery();
    var ball=new Ball(HTMLCanvasElement());

  	describe('#getEdgeHitValue()',function(){
  		var dimension=10
  		var radius=5;
  		it("turns the direction increment to be positive if ball would move to zero",
  			function(){
  				var increment=-1;
  				var reference=0;
  				increment=ball.getEdgeHitValue(reference, dimension ,increment, radius);
  				assert.equal(1,increment);

  			}
  		)

  		it("turns the direction increment to be negative if ball would move to dimension",
  			function(){
  				var increment=1;
  				var reference=10;
  				increment=ball.getEdgeHitValue(reference, dimension ,increment, radius);
  				assert.equal(-1,increment);

  			}
  		)
  		
  	});


  	describe('#move()',function(){
  		it("keeps the current x,y coordinate if no player was hit", function(){
  			ball.x=10;
  			ball.y=10;
  			ball.setPlayerHit(false,false,1);
  			assert.equal(10,ball.x);
  			assert.equal(10,ball.y);
  		});

  		it("turns the direction by setting x to negative value and y to the player hit value if a player was hit", 
  			function(){
  				ball.x=10;
  				ball.y=10;
  				ball.setPlayerHit(1,false,1);
  				assert.equal(9,ball.x);
  				assert.equal(11,ball.y);
  				assert.equal(ball.incX,-1);
  				assert.equal(ball.incY,1);

  		});

  		it("turns the direction by setting x to positve value and y to the opponent hit value if a opponent was hit", 
  			function(){
  				ball.x=10;
  				ball.y=10;
  				ball.setPlayerHit(false,1,-1);
  				assert.equal(11,ball.x);
  				assert.equal(11,ball.y);
  				assert.equal(ball.incX,1);
  				assert.equal(ball.incY,1);

  		});

      describe('#reset()',
          function(){
            it("sets x,y and inc  to initial values to restart game after score", function(){
                 ball.reset(PLAYER_RIGHT);
                  assert.equal(ball.incX,-2);
                  assert.equal(ball.incY,0);
                  assert.equal(ball.x,200);
                  assert.equal(ball.y,150);

            });
          }
      );

      describe('#checkScore()',
          function(){
            it("checks if ball is out of the x range of the playground and call player.addScore()")
            ball.x=301;
            ball.checkScore(300);
            assert.equal(ball.ctx.player.score,true);

            ball.x=-1;
            ball.checkScore(300);
            assert.equal(ball.ctx.opponent.score,true);            
          }
      );


  	});

})