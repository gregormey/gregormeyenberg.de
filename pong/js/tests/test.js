var assert = require("assert");
var Ball=require("../src/class/Ball.js");
var HTMLCanvasElement=require("./class/HTMLCanvasElementMock.js");
var Window = require("./class/WindowMock.js");

describe('Ball', function(){
	// Mock window variable globally
	window = new Window();
  	var ball=new Ball(HTMLCanvasElement());

  	describe('#getEdgeHitValue()',function(){
  		it("turns the direction if ball hits the x edge",
  			function(){
  				var increment=-1;
  				var reference=0;
  				var dimension=10
  				var radius=5;

  				increment=ball.getEdgeHitValue(reference, dimension ,increment, radius);
  				assert.equal(1,increment);

  				reference=10;
  				increment=ball.getEdgeHitValue(reference, dimension ,increment, radius);

  				assert.equal(-1,increment);

  			}
  		)
  	})
})