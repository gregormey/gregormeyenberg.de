var assert = require("assert");
var Ball=require("../src/class/Ball.js");
var HTMLCanvasElement=require("./class/HTMLCanvasElementMock.js");
var Window = require("./class/WindowMock.js");

describe('Ball', function(){
	// Mock window variable globally
	window = new Window();
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
  		
  	})
})