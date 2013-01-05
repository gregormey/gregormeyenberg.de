HOST = null; // localhost
PORT = 80;
DOCROOT = "/var/www/gregormeyenberg.de/card/content";
var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs");
var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname;
  uri=uri==='/'?'index.html':uri;	
  var filename = path.join(DOCROOT, uri);
  path.exists(filename, function (exists) {	
    if(!exists) {  
	  res.writeHead(404, { "Content-Type": "text/plain"});
  	  res.end("Not Found");
    }
    fs.readFile(filename, function (err, data) {	
        if(err) {  
            res.writeHead(500, {"Content-Type": "text/plain"});  
            res.end(err + "\n");    
            return;  
        }
        res.writeHead(200); 
        res.write(data, "binary");
        res.end();
	});
  });
});
listen = function (port, host) {
  server.listen(port, host);
  sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
};
listen(Number(PORT), HOST);