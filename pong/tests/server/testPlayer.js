var assert = require("assert");
// Player needed to be gloabal to test Computerplayer
var Yags=require("../../src/server/lib/Yags.js");


describe('Player', function(){
  var myPlayer=null;

	it("registers a player and expects 201 response code",function(done){
		
		Yags.post("/player/new",
            {Nick:"test100",
              Mail:"test@test.de",
              Password:"test100"},
              function(yags){
                	assert.equal(yags.statusCode,201);
					         done();
              	}
         );
	});

	it("trys to create an existing player and expects 406 response code",function(done){
		
		Yags.post("/player/new",
            {Nick:"test100",
              Mail:"test@test.de",
              Password:"test100"},
              function(yags){
                assert.equal(yags.statusCode,406);
					       done();
              	}
         );
	});

  it("trys to create an player with an invalid mail and expects 406 response code and the body message 'Mail not valid' ",
    function(done){    
        Yags.post("/player/new",
            {Nick:"test100",
              Mail:"test100",
              Password:"test100"},
              function(yags,response){
                assert.equal(yags.statusCode,406);
                assert.equal(response.Msg, "Mail not valid");
                done();
                },
                function(e){
                  throw e;
                }
         );
  });

  it("trys to create an player with an invalid nick and expects 406 response code and the body message 'Nick not valid' ",
    function(done){    
        Yags.post("/player/new",
            {Nick:"te",
              Mail:"test@test.de",
              Password:"test100"},
              function(yags,response){
                assert.equal(yags.statusCode,406);
                assert.equal(response.Msg, "Nick not valid");
                done();
                },
                function(e){
                  throw e;
                }
         );
  });

  it("trys to create an player with an invalid password and expects 406 response code and the body message 'Password not valid' ",
    function(done){    
        Yags.post("/player/new",
            {Nick:"test",
              Mail:"test@test.de",
              Password:"test"},
              function(yags,response){
                assert.equal(yags.statusCode,406);
                assert.equal(response.Msg, "Password not valid");
                done();
                },
                function(e){
                  throw e;
                }
         );
  });

  

  it("trys to find an existing player by and expects a valid player Object",function(done){
      Yags.get("/player/test100?pwd=test100",
          function(yags,player){
                  assert.equal(yags.statusCode,200);
                  assert.equal(player.Nick,"test100");
                  myPlayer=player; //save player Object for further use
                  done();
                }
      );
  });

  it("trys to login an existing player  and expects a valid player Object were isOnline is set",function(done){
      Yags.put("/player/"+myPlayer.Hash,
            {Login:1},
              function(yags,player){
                  assert.equal(yags.statusCode,200);
                  assert.equal(player.IsOnline,1);
                   done();
                },
                function(e){
                  throw e;
                }
         );
  });

  it("trys to logout an existing player  and expects a valid player Object were isOnline is set",function(done){
       Yags.put("/player/"+myPlayer.Hash,
              {Logout:1},
              function(yags,player){
                  assert.equal(yags.statusCode,200);
                   assert.equal(player.IsOnline,0);
                   done();
                },
                function(e){
                  throw e;
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
          },
          function(e){
            throw e;
          }
      );
      post_req.end();
  });

});