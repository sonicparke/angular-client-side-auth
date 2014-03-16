var express =       require('express')
var http =        require('http')
// var mongoose    = require('mongoose');
var passport =    require('passport')
var path =        require('path')
var User =        require('./server/models/User.js');
var database = require('./server/config/database');

var app = module.exports = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieParser());
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
app.use(express.json());

//////// What does this do? ////////
// app.configure('development', 'production', function() {
//     app.use(express.csrf());
//     app.use(function(req, res, next) {
//         res.cookie('XSRF-TOKEN', req.csrfToken());
//         next();
//     });
// });

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});