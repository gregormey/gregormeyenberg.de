var Yags=require("../lib/Yags.js")
var TextCatalog=require("../lib/TextCatalog.js");

/**
 * [Player description]
 * @type {Object}
 */
var Player={

  /**
   * Returns render Object in case if an error occures during 
   * registartion
   * @param  {[type]} res       [description]
   * @param  {[type]} req       [description]
   * @param  {[type]} msg       [description]
   * @param  {[type]} erroField [description]
   * @return {[type]}           [description]
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
 * Register a player
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
  add:function(req, res, next){
    Yags.post("/player/new",
          {Nick:req.body.Nick,
            Mail:req.body.Mail,
            Password:req.body.Password},
            function(yags,body){
                if(yags.statusCode==201){
                  Player.login(req, res, next);
                }else if(yags.statusCode==406){
                  // player already exits
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
                }else{
                  next(new Error('Error while registration.'));
                }
              },
              next
           );

    },

    /**
     * Player Login
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    login:function(req, res, next){
         Yags.get("/player/"+req.body.Nick+"?pwd="+req.body.Password,
                      function(yags,myPlayer){
                          if(myPlayer.Hash){
                            req.session.myPlayer=myPlayer;
                             Yags.put("/player/"+req.session.myPlayer.Hash,
                                {Login:1},
                                function(yags,player){
                                  req.session.myPlayer=player;
                                },
                                next
                              );
                            res.redirect("/play");
                          }else{
                            Player.renderErr(res,req,TextCatalog.loginFail,"","login"); 
                          }
                      }
                    );
    },

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
     * start a game
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    startGame:function(req, res, next){
        if(req.session.myPlayer){
           res.render("playground", {
              title: TextCatalog.playgroundTitle,
              PlayerNick:req.session.myPlayer.Nick
           });
        }else{
          res.redirect("/login");
        }
    }
}

//public routs
exports.add = Player.add;
exports.login = Player.login;
exports.logout = Player.logout;
exports.startGame = Player.startGame;
