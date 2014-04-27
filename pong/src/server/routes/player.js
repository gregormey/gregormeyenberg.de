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
  }

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
                            res.redirect("/play");
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
