var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var dbUrl = 'mongodb://localhost/imooc';
// var mongoStore = require('connect-mongo')(express);
mongoose.connect(dbUrl);

// .get .set 可以往 express 实例上存数据，可以是对 express 的配置数据，也可以是其它数据
app.set('views', './app/views/pages');
app.set('view engine', 'jade');

// app.use 引入插件的方法
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cookieParser())
app.use(cookieSession({
    secret: 'imooc'
    // store: new mongoStore({ // 用mongodb 持久化登录态
    //     url: dbUrl,
    //     collection: 'sessions'
    // })
}))

//app.locals  persist throughout the life of the application
app.locals.moment = require('moment');

var env = process.env.NODE_ENV || 'development';
console.log('env:', env)
if('development' === env){
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true; //源码未格式化
    mongoose.set('debug', true)//mongoose调试打开
}


require('./config/routes')(app);

app.listen(port);

console.log('site start:', port);

