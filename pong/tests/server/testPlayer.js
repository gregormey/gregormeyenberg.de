var assert = require("assert");
// Player needed to be gloabal to test Computerplayer
var Yags=require("../../src/server/lib/Yags.js");


describe('Player', function(){

	it("registers a player and expects 201 response code",function(done){
		
		Yags.post("/player/new",
            {Nick:"test100",
              Mail:"test100",
              Password:"test100"},
              function(yags){
                	assert.equal(yags.statusCode,201);
					done();
              	}
             );
	});
});