var assert = require("assert");
// Player needed to be gloabal to test Computerplayer
Player=require("../../src/server/models/Player.js");


describe('Player', function(){
	myPlayer=new Player({
  			host: "127.0.0.1",
 			 port: 8000
	});
	
	it("registers a player and expects 201 response code",function(done){
		myPlayer.create("test4","test4","test",
			function(res){
				assert.equal(res.statusCode,201);
				done();
			},
			function(err){
				throw err;
			}
		);	
	});
});