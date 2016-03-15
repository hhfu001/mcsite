//index page
var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res) {

	Category.find({}).populate({
		path: 'movies',
		options: { limit : 6}
	}).exec(function(err, categorys) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            categorys: categorys
        });

    })

    // Movie.fetch();
}