var assert = require("assert");
require("../src/class/Ball.js")
describe('Ball', function(){
  	var ball=new Ball();
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