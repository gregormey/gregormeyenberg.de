var Yags=require("../lib/Yags.js");
/**
 * Register a player
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.add = function(req, res, next){
	Yags.post("/player/new",
            {Nick:req.body.Nick,
              Mail:req.body.Mail,
              Password:req.body.Password},
              function(yags,body){
                	if(yags.statusCode==201){
                		res.redirect('/play');
                	}else if(yags.statusCode==409){
                    var msg="";
                    var exists=false;
                    if(body.Msg=="Mail exists"){
                        msg="*Another player is already registered with this email address";
                        exists = "mail";
                    }else if(body.Msg=="Nick exists"){
                      msg="*Another player is already registered with this nick";
                      exists = "nick";
                    }

                		res.render('register', {
                        title: 'Create Pong Account',
                        msg: msg,
                        exists: exists,
                        Nick:req.body.Nick,
                        Mail:req.body.Mail,
                        Password:req.body.Password
                     });
                	}else{
                		next(new Error('Error while registration.'));
                	}
              	}
             );
	
}