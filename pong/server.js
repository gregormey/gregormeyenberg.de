// for command line execution
var sys = require('sys')
var exec = require('child_process').exec;

var express = require('express')
  , swig = require('swig')
  , app = express();

var player = require('./src/server/routes/player');
var views = require('./src/server/routes/views');

var yags_server = null;

//enable cookie session
app.use(express.cookieParser('MAIKE'));
app.use(express.cookieSession());


// assign the swig engine to .html files
app.engine('html', swig.renderFile);


// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/src/server/views');

//GET public assets
app.use(express.static(__dirname + '/public'));

//use url encode for post requests
app.use(express.urlencoded());


//disable view cache for developnment enviroment
if(process.argv[2]=='-dev'){
  app.set('view cache', false);
  swig.setDefaults({ cache: false });
}

//get YAGS connect data basically websocket server and port
app.use(function(req, res, next) {
 	if(yags_server===null){
		Yags.get("/wsinfo",
            function(yags,server){
                req.yags_server=yags_server={
                					host:server.Host,
                					wsport:server.Port
                				};
				next();
            }
        );
 	}else{
 		req.yags_server=yags_server;
 		next();
 	}
});


/**
 * route configuration
 */
app.get('/', player.index);
app.get('/login', player.login_form);
app.get('/register', player.registration_form);
app.post('/register', player.add);
app.post('/login', player.login);
app.get('/logout', player.logout);
app.get('/play', player.startGame);
app.get('/opponents', player.opponents);
app.get('/challange', player.challange);
app.get('/wait', player.wait);
app.get('/views/:template', views.template);


/**
 * Start server
 */
app.listen(80);
console.log('Pong Frontend Server listening port 80');
