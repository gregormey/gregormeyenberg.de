var Yags=require("../lib/Yags.js")
var TextCatalog=require("../lib/TextCatalog.js");

/**
 * [Player description]
 * @type {Object}
 */
var Player={
  /**
   * Validates if mail is a valid mail addres
   * @param  {Sting}  mail mail adress
   * @return {Boolean}      [description]
   */
  isMailValid:function(mail){
      var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      return emailRegEx.test(mail);
  },

  /**
   * Validates if Nick is at least 3 digits long
   * @param  {[type]}  nick [description]
   * @return {Boolean}      [description]
   */
  isNickValid:function(nick){
      return nick.length >= 3;
  },

  /**
   * Validates if password is at least 3 digist long
   * @param  {[type]}  password [description]
   * @return {Boolean}          [description]
   */
  isPasswordValid:function(password){
    return password.length >= 3;

  },

  /**
   * validates input fields and return error render object if an input is not valid
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {boolean}     [description]
   */
  validateInput:function(req, res){
      if(!Player.isNickValid(req.body.Nick)){
        Player.renderErr(res,req,TextCatalog.invalidNick,"nick");
      }else if(!Player.isMailValid(req.body.Mail)){
        Player.renderErr(res,req,TextCatalog.invalidMail,"mail");
      }else if(!Player.isPasswordValid(req.body.Password))
        Player.renderErr(res,req,TextCatalog.invalidPassword,"password");
      else{
        return true;
      }
  },

  /**
   * Returns render Object in case if an error occures during 
   * registartion
   * @param  {[type]} res       [description]
   * @param  {[type]} req       [description]
   * @param  {[type]} msg       [description]
   * @param  {[type]} erroField [description]
   * @return {[type]}           [description]
   */
  renderErr:function(res,req,msg,errorField){
    res.render('register', {
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
    if(Player.validateInput(req, res)){
          Yags.post("/player/new",
                    {Nick:req.body.Nick,
                      Mail:req.body.Mail,
                      Password:req.body.Password},
                      function(yags,body){
                          if(yags.statusCode==201){
                            res.redirect("/play");
                          }else if(yags.statusCode==409){
                            // player already exits
                            var msg="";
                            var errorField=false;
                            if(body.Msg=="Mail exists"){
                                msg=TextCatalog.mailExists;
                                errorField = "mail";
                            }else if(body.Msg=="Nick exists"){
                              msg=TextCatalog.nickExists;
                              errorField = "nick";
                            }
                            Player.renderErr(res,req,msg,errorField);                   
                          }else{
                            next(new Error('Error while registration.'));
                          }
                        }
                     );
    }
  }
}

//public routs
exports.add = Player.add;
