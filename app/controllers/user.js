var UserModel = require('../models/user');


//user signup | /user/signup
exports.signup = function(req, res) {
    var _user = req.body.user;


    UserModel.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) console.log(err)
// console.log('user:', user)
        if (user) {
            res.redirect('/signin')
        } else {

            var userModel = new UserModel(_user);
            // console.log(1,_user)
            userModel.save(function(err, user) {
                if (err) console.log(err);

                res.redirect('/');
            });

        }

    })
}

//user list page | /admin/userlist
exports.list = function(req, res) {

    UserModel.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表页',
            users: users
        });

    });
}

//user logout |/logout
exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user

    res.redirect('/')
}

//user signin | /user/signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    UserModel.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            return res.redirect('/signup')
        } else {
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }

                if (isMatch) {

                    req.session.user = user;

                    return res.redirect('/')
                } else {
                    res.redirect('/signin');
                    // console.log('password wrong')
                }


            })
        }

    })

}

//用户登录页
exports.showSignin = function(req, res) {
    // console.log('showSignin')
    res.render('signin', {
        title: '用户登录页'
    });
}

//用户登录页
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '用户注册页'
    });
}

//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin')
    }

    next()
}

exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user || user.role < 10) {
        return res.redirect('/signin')
    }

    next()
}