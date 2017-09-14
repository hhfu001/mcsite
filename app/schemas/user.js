var mongoose = require('mongoose');
var bcrypt = require('bcrypt') // 加盐，
var SALT_WORK_FACTOR = 10 // 计算强度

var UserSchema = new mongoose.Schema({
    name: {
        unique: true, // 唯一
        type: String
    },
    password: String,
    // 0: nomal user
    // 1: verified user
    // 2: professonal user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }

});


UserSchema.pre('save', function(next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    //密码加盐 在原始的数据上加上一些字符
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash;

            next();

        })
    })

})

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        // console.log('comparePassword', this)
        bcrypt.compare(_password, this.password, function(err, isMatch) {

            if (err) return cb(err)
            return cb(null, isMatch)

        })

    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function(id, cb) {

        return this.findOne({
            _id: id
        }).exec(cb);
    }
}

module.exports = UserSchema;