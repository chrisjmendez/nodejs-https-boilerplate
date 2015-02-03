var fs = require('fs');
var http = require('http');
var https = require('https');
//
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

/* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
* A few friendly changes
* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//set the port for openshift
app.set('port',      process.env.OPENSHIFT_NODEJS_PORT || 3000);
//set the IP for popenshift
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || 'localhost')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
* HTTP Development
* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
if ('development' == app.get('env')){
    http.createServer(app).listen(app.get('port'), app.get('ipaddress'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
} 
 
/* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
* HTTPS router
* ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
// production only

if ('production' == app.get('env')){
    app.enable('trust proxy');
    console.log("PRODUCTION MODE")
    //http://stackoverflow.com/questions/25654796/creating-an-express-js-4-0-application-with-https-on-openshift-including-http-r
    app.use (function (req, res, next) {
      var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
      console.log("schema: ", schema)
      if (schema === 'https') {
        console.log("HTTPS request")
        next();
      } else {
        console.log("HTTP request")
        res.redirect('https://' + req.headers.host + req.url);
      }
    });

    var options = {
        key:                process.env.SSL_PRIVATE_KEY || fs.readFileSync('./ssl/key.pem', 'utf8').toString(),
        cert:               process.env.SSL_PUBLIC_KEY  || fs.readFileSync('./ssl/server.crt', 'utf8').toString(),
        requestCert:        true,
        rejectUnauthorized: false
    }
    console.log(process.env.SSL_PRIVATE_KEY, process.env.SSL_PUBLIC_KEY);
    
    https.createServer(options, app).listen(app.get('port'), app.get('ipaddress'), function(req, res){
      console.log("HTTPS listening on port " + app.get('port'));
    });
}

module.exports = app;
