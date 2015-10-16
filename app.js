var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var bodyParser = require('body-parser')


mongoose.connect('mongodb://localhost/imooc');


app.set('views', './views/pages');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({extended: true}))
app.locals.moment = require('moment');

app.listen(port);


console.log('site', port);

//index page
app.get('/', function(req, res) {

    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movies: movies
        });

    });
});


//view page
// flash: 'http://player.youku.com/player.php/sid/XODU1MDE0MjM2/v.swf',
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'detail',
            movie: movie
        })
    });

});


//admin list page
app.get('/admin/list', function(req, res) {
   
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: 'list',
            movies: movies
        });

    });
});

//admin del page
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;

    if(!id) return;
   
    Movie.remove({_id: id}, function(err, movies) {
        if(err){
             console.log(err);
         }else{
            res.json({code : 0, msg: "success"})
         }


        

    });
});

//admin page add
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'admin',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

//update
app.get('/admin/update/:id', function(req, res){
    var id = req.params.id;

    if(id){

         Movie.findById(id, function(err, movie) {
            if (err) console.log(err);

            res.render('admin',{
                title: 'admin update',
                movie: movie
            })
        });
    }
});



//admin post movie
app.post('/admin/movie/new', function(req, res) {

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
            if (err) console.log(err);
            res.redirect('/movie/' + movie._id);

        });

    }

});