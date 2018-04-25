var express			= require('express'),
	path			= require('path'),
	bodyParser		= require('body-parser'),
	partials		= require('express-partials'),
	app = express();

var logger = function(req,res,next){
	//console.log("Logging...");
	next();
};

app.use(logger);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(partials());
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});



var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, ip, function () {
 console.log( "Listening on " + ip + ", server_port " + port  );
});
