// for command line execution
var sys = require('sys')
var exec = require('child_process').exec;

var express = require('express')
  , swig = require('swig')
  , app = express();



// assign the swig engine to .html files
app.engine('html', swig.renderFile);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/src/server/views');

//GET public assets
app.use(express.static(__dirname + '/public'));

//disable view cache for developnment enviroment
if(process.argv[2]=='-dev'){
  app.set('view cache', false);
  swig.setDefaults({ cache: false });
}

app.get('/', function(req, res){
	res.send("");
});

app.get('/login', function(req, res){
	res.render('login', {
    	title: 'Pong Login'
  	});
});

app.get('/register', function(req, res){
	res.render('register', {
    	title: 'Crete Pong Account'
  	});
});

app.get('/play', function(req, res){
	res.render('playground', {
    	title: 'Play Pong'
  	});
});

//start yags
exec("erl -pa yags/ebin yags/deps/*/ebin -noshell -s yags start_server", 
  function puts(error, stdout, stderr) { console.log(stdout) });

app.listen(80);
console.log('Pong Frontend Server listening port 80');
console.log('Pong Backend Server listening port 8000');
