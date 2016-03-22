var Movie = require('../models/movie');
var _ = require('underscore');

var mongoose = require('mongoose');
// var Comment = mongoose.model('Comment');
var Comment = require('../models/comment');
var Category = mongoose.model('Category')
var fs = require('fs')
var path = require('path')


//view page /movie/:id
// flash: 'http://player.youku.com/player.php/sid/XODU1MDE0MjM2/v.swf',
exports.detail = function(req, res) {
    var id = req.params.id;


    //PV
    Movie.update({_id: id}, {$inc: { pv: 1}}, function(err){

        if(err) console.log('err', err)

    })

    Movie.findById(id, function(err, movie) {

        // Query.populate(path, [select], [model], [match], [options])
        // path
        // String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。
        // Object类型的时，就是把 populate 的参数封装到一个对象里。当然也可以是个数组

        // select
        // 指定填充 document 中的哪些字段

        Comment.find({
                movie: id
            }).populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                // console.log('comments:',comments)
                res.render('detail', {
                    title: movie && movie.title,
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
                msg: 'success'
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
            Category.find({}, function(err, categories) {

                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        });
    }
}

//admin post movie
exports.save = function(req, res) {
// console.log('log:::',req.body.movie)
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    //上传文件
    if(req.poster){
        movieObj.poster = req.poster;
    }


    if (id && id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) console.log(err);

            _movie = _.extend(movie, movieObj);

            _movie.save(function(err, movie) {
                if (err) console.log(err);
                res.redirect('/movie/' + movie._id);

            });

        });

    } else {

        _movie = new Movie(movieObj);

        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save(function(err, movie) {
            // console.log(movie)
            if (err) console.log(err);

            // 更新categroy
            if (categoryId) {
                Category.findById(categoryId, function(err, category) {

                    category.movies.push(movie._id);

                    category.save(function(err, category) {

                        res.redirect('/movie/' + movie._id);

                    })

                })

            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err, category) {

                    movie.category = category._id;

                    movie.save(function(err, movie) {

                        res.redirect('/movie/' + movie._id);

                    });

                });
            }

        });

    }

}



//admin poster
exports.savePoster = function(req, res, next) {

    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

// console.log(req.files)
    // 有文件上传
    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

            fs.writeFile(newPath, data, function(err) {
                req.poster = poster
                next()
            })
        })
    } else {
        next()
    }
    // next()

}