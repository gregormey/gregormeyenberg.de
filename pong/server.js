var express = require('express')
  , cons = require('consolidate')
  , app = express();

// assign the swig engine to .html files
app.engine('html', cons.swig);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//GET public assets
app.use(express.static(__dirname + '/public'));

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


app.listen(80);
console.log('Pong Frontend Server listening port 80');