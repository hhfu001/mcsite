var Movie = require('../models/movie');
var _ = require('underscore');

var mongoose = require('mongoose');
// var Comment = mongoose.model('Comment');
var Comment = require('../models/comment');
var Category = mongoose.model('Category')


//view page /movie/:id
// flash: 'http://player.youku.com/player.php/sid/XODU1MDE0MjM2/v.swf',
exports.detail = function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {


        Comment.find({
                movie: id
            }).populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                // console.log(comments)
                res.render('detail', {
                    title: movie.title,
                    movie: movie,
                    comments: comments
                })

            })

    });
}


//admin list page | /admin/list
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: '电影列表页',
            movies: movies
        });

    });
}

//admin del api
exports.del = function(req, res) {
    var id = req.query.id;

    if (!id) return;

    Movie.remove({
        _id: id
    }, function(err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                code: 0,
                msg: "success"
            })
        }
    });
}

//admin page add
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: '后台录入页',
            categories: categories,
            movie: {}
        })

    })
}

//update
exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {

        Movie.findById(id, function(err, movie) {
            if (err) console.log(err);

            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        });
    }
}

//admin post movie
exports.save = function(req, res) {

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) console.log(err);

            _movie = _.extend(movie, movieObj);

            _movie.save(function(err, movie) {
                if (err) console.log(err);
                res.redirect('/movie/' + movie._id);

            });

        });

    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });

        _movie.save(function(err, movie) {
            console.log(movie)
            if (err) console.log(err);
            res.redirect('/movie/' + movie._id);

        });

    }

}