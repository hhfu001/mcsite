var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();

var mongoose = require('mongoose');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');

mongoose.connect('mongodb://localhost/imooc');


app.set('views', './app/views/pages');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(cookieSession({
    secret: 'imooc'
}))

app.locals.moment = require('moment');

// console.log(app.get('env'))
if('development' === app.get('env')){
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true)
}


require('./config/routes')(app);

app.listen(port);

console.log('site start:', port);

