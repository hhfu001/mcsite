var mongoose = require('mongoose');
var Categorychema = require('../schemas/category');

var Category = mongoose.model('Category', Categorychema);

module.exports = Category;