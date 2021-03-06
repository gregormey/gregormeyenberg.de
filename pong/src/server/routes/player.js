var Yags=require("../lib/Yags.js")
var TextCatalog=require("../lib/TextCatalog.js");

/**
 * Handels player Routes
 * @type {Object}
 */
var Player={

  /**
   * Returns render Object in case if an error occures during 
   * registartion
   * @param  {Object} res       response Object
   * @param  {Object} req       request Obkect
   * @param  {String} msg       User Message
   * @param  {String} erroField  Css class of field that raises the error
   * @return {null}           
   */
  renderErr:function(res,req,msg,errorField,template){
    res.render(template, {
                    title: TextCatalog.createAccountTitle,
                    msg: msg,
                    errorField: errorField,
                    Nick:req.body.Nick,
                    Mail:req.body.Mail,
                    Password:req.body.Password
    });
  },

   /**
    * In relation to the response message differend user messages are rendered
    * @param  {Object} res  response Object
    * @param  {Object} req  request Object
    * @param  {Object} body YAGS response Object
    * @return {null}      
    */
  renderInvalidRegistration:function(res,req,body){
    var msg="";
      var errorField=false;
      if(body.Msg=="Mail exists"){
          msg=TextCatalog.mailExists;
          errorField = "mail";
      }else if(body.Msg=="Nick exists"){
          msg=TextCatalog.nickExists;
          errorField = "nick";
      }else if(body.Msg=="Mail not valid"){
          msg=TextCatalog.invalidMail;
          errorField = "mail";
      }else if(body.Msg=="Nick not valid"){
          msg=TextCatalog.invalidNick;
          errorField = "nick";
      }else if(body.Msg=="Password not valid"){
          msg=TextCatalog.invalidPassword;
          errorField = "password";
      }

      Player.renderErr(res,req,msg,errorField,'register');  
  },

/**
 * Route callback to register a  new player
 * @param  {Object}   req  Request Object
 * @param  {Object}   res  Response Object
 * @param  {Function} next  call back to throw exceptions
 * @return {null}        
 */
  add:function(req, res, next){
    Yags.post("/player/new",
          {Nick:req.body.Nick,
            Mail:req.body.Mail,
            Password:req.body.Password},
            function(yags,body){
                if(yags.statusCode==201){ // Add new Player was successfull 
                  Player.login(req, res, next);
                }else if(yags.statusCode==406){
                  //Some input is invalid
                    Player.renderInvalidRegistration(res, req, body);
                }else{
                  next(new Error('Error while registration.'));
                }
              },
              next
           );

    },

    /**
     * Route callback to login a Player
     * @param  {[type]}   req  Request Object
     * @param  {[type]}   res  Response Object
     * @param  {Function} next call back to throw exceptions
     * @return {null}     
     */
    login:function(req, res, next){
         Yags.get("/player/"+req.body.Nick+"?pwd="+req.body.Password,
                      function(yags,myPlayer){
                          if(myPlayer.Hash){ // if response has a Player Hash Player will be logged in
                            req.session.myPlayer=myPlayer;
                             Yags.put("/player/"+req.session.myPlayer.Hash,
                                {Login:1},
                                function(yags,player){
                                  req.session.myPlayer=player; //add Player Object to session
                                },
                                next
                              );
                            res.redirect("/opponents");
                          }else{
                            Player.renderErr(res,req,TextCatalog.loginFail,"","login"); 
                          }
                      }
                    );
    },

    /**
    * Route callback to logout a Player. 
    * Removes player Object from Session.
    * @param  {Object}   req  Request Object
    * @param  {Object}   res  Response Object
    * @param  {Function} next Callback to throw exception
    * @return {null}        
    */
    logout:function(req, res, next){
      callback=function(){
        delete req.session.myPlayer;
      }
      Yags.put("/player/"+req.session.myPlayer.Hash,
        {Logout:1},
        callback,
        callback //do a logout even in a error case
      );
       res.redirect("/login");
    },

    /**
     * Route callback to start a game
     * @param  {Object}   req  Request Object
     * @param  {Object}   res  Response Object
     * @param  {Function} next Callback to throw exception
     * @return {null}       
     */
    startGame:function(req, res, next){
        if(req.session.myPlayer){
          if(req.query.opponent){
            // find opponent
            Yags.get("/player/"+req.query.opponent,
              function(yags,opponent){
                if(opponent.Hash){
                  res.render("playground", {
                          title: TextCatalog.playgroundTitle,
                          Host:req.yags_server.host,
                          wsPort:req.yags_server.wsport,
                          PlayerNick:req.session.myPlayer.Nick,
                          OpponentNick: opponent.Nick,
                          UserHash:req.session.myPlayer.Hash,
                          OpponentHash: opponent.Hash,
                          remoteEvent: req.query.start?"sendStartGame":null,
                          player_side: req.query.start?"PLAYER_RIGHT":"PLAYER_LEFT",
                          opponent_side: req.query.start?"PLAYER_LEFT":"PLAYER_RIGHT"
                    });
                }else{
                  res.redirect("/opponents");
                }
              }
            );
          }else{
             res.render("playground", {
                          title: TextCatalog.playgroundTitle,
                          PlayerNick:req.session.myPlayer.Nick,
                          OpponentNick: "Computer",
                          UserHash:req.session.myPlayer.Hash
                    });
          }
        }else{
          res.redirect("/login");
        }
    },

    /**
     * Index route. Redirects to play or login if no player object is set 
      * @param  {Object}   req  Request Object
     * @param  {Object}   res  Response Object
     * @return {[type]}     [description]
     */
    index:function(req, res){
      if(req.session.myPlayer){
        res.redirect('/opponents');
      }else{
        res.redirect('/login');
      }
    },

    /**
     * Route to get login form
     * @param  {Object}   req  Request Object
     * @param  {Object}   res  Response Object
     * @return {[type]}     [description]
     */
    login_form:function(req, res){
        res.render('login', {
          title: 'Pong Login'
        });
    },

     /**
     * Route to get registration form
     * @param  {Object}   req  Request Object
     * @param  {Object}   res  Response Object
     * @return {[type]}     [description]
     */
    registration_form:function(req, res){
      res.render('register', {
        title: 'Create Pong Account'
      });
    },

    /**
     * renders the challanged dialog
     * @param  {[type]} req Request Object
     * @param  {[type]} res Response Object
     * @return {[type]}     [description]
     */
    challange:function(req, res){
      if(req.query.opponent){
            // find opponent
            Yags.get("/player/"+req.query.opponent,
              function(yags,player){
                if(player.Hash){
                     res.render('challanged', {
                      title: 'You are challanged',
                      OpponentNick: player.Nick,
                      OpponentHash: player.Hash
                    });
                }else{
                  res.redirect('/opponents');
                }
              }
            );  
      }else{
        res.redirect('/opponents');
      }
     
    },

    /**
     * renders the wait dialog
     * @param  {[type]} req Request Object
     * @param  {[type]} res Response Object
     * @return {[type]}     [description]
     */
    wait:function(req, res){
       if(req.query.opponent){
            // find opponent
            Yags.get("/player/"+req.query.opponent,
              function(yags,player){
                if(player.Hash){
                     res.render('wait', {
                      title: 'Wait for opponent',
                      OpponentNick: player.Nick,
                      OpponentHash: player.Hash,
                      UserHash: req.session.myPlayer.Hash,
                      Host:req.yags_server.host,
                      wsPort:req.yags_server.wsport,
                      remoteEvent: 'sendChallangePlayer'
                    });
                }else{
                  res.redirect('/opponents');
                }
              }
            );  
      }else{
        res.redirect('/opponents');
      }
    },

    /**
     * 
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    opponents:function(req,res){
      if(req.session.myPlayer){
            var renderOptions=  {
                      title: 'Currently Online',
                      Host:req.yags_server.host,
                      wsPort:req.yags_server.wsport,
                      UserHash:req.session.myPlayer.Hash
            };

            //add refuse opponent call
            if(req.query.refuse){
              renderOptions.RefuseHash=req.query.refuse;
              renderOptions.remoteEvent='sendRefuseGame';
            }

            //render refused nick name
            if(req.query.refused){
                  Yags.get("/player/"+req.query.refused,
                      function(yags,player){
                        if(player.Hash){
                            renderOptions.RefusedNick=player.Nick;
                            res.render('opponents',renderOptions);
                        }else{
                          res.render('opponents',renderOptions);
                        }
                      }
                  )
            }else{
                res.render('opponents',renderOptions);
            }
          
      }else{
        res.redirect('/login');
      }

    }

}

//public routs
exports.add = Player.add;
exports.login = Player.login;
exports.logout = Player.logout;
exports.startGame = Player.startGame;
exports.index=Player.index;
exports.login_form=Player.login_form;
exports.registration_form=Player.registration_form;
exports.opponents=Player.opponents;
exports.challange=Player.challange;
exports.wait=Player.wait;

