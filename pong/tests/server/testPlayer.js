var assert = require("assert");
// Player needed to be gloabal to test Computerplayer
Player=require("../../src/server/models/Player.js");


describe('Player', function(){

	
	it("registers a player and expects 201 response code",function(done){
		var myPlayer= new Player(
			{
				load:function(res){
					assert.equal(res.statusCode,201);
					done();
				}
			}
		);
		myPlayer.create("test6","test6","test");	
	});
});