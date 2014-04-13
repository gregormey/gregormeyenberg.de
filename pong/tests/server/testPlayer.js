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

	it("trys to create an existing player and expects 409 response code",function(done){
		
		Yags.post("/player/new",
            {Nick:"test100",
              Mail:"test100",
              Password:"test100"},
              function(yags){
                assert.equal(yags.statusCode,409);
					       done();
              	}
         );
	});

  

  it("trys to find an existing player by and expects a valid player Object",function(done){
      Yags.get("/player/test100?pwd=test100",
          function(yags,player){
                  assert.equal(yags.statusCode,200);
                  assert.equal(player.Nick,"test100");
                  done();
                }
      );
  });

  it("trys to delete an existing player and expects 200 response code",function(done){
      var options = {
        path: "/player/test100",
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
      };
      var post_req=Yags.request(options,
          function(yags){
            assert.equal(yags.statusCode,200);
              done();
          }
      );
      post_req.end();
  });

});