var assert = require("assert");
// Player needed to be gloabal to test Computerplayer
Player=require("../../src/server/models/Player.js");


describe('Player', function(){
	myPlayer=new Player({
  			host: "127.0.0.1",
 			 port: 8000
	});

	it("register a player",function(done){
		myPlayer.create("test3","test3","test",
			function(){
				done();
			},
			function(err){
				throw err;
			}
		);	
	});
});