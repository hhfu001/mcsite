var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app) {

    //pre handle session
    app.use(function(req, res, next) {

        var user = req.session.user;
        app.locals.user = user;
        next()
    })

    //Index
    app.get('/', Index.index);

    //Movie
    app.get('/movie/:id', Movie.detail); //电影详情页
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list); //电影列表页
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del); //电影删除ajax api
    app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.new); //电影录入页
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update); //后台更新页
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save); //数据保存api

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save); //评论数据保存api

    //User
    app.post('/user/signup', User.signup); //用户注册api
    app.post('/user/signin', User.signin) //用户登录api
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list); //用户列表页
    app.get('/logout', User.logout); //用户登出api
    app.get('/signin', User.showSignin) //用户登录页
    app.get('/signup', User.showSignup) //用户注册页

    // Category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

}