var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();

var path = {
    src: {
        jshint: ['public/js/**/*.js', 'app/**/*.js', '*.js', 'config/**', 'test/**'],
        scripts: 'public/js/**/*.js',
        less: 'public/**/*.less',
        images: 'public/images/**'
    },
    dest: {
        scripts: 'public/dist',
        less: 'public/dist',
        images: 'public/dist'
    }
};


// 将less文件转成css文件并压缩
gulp.task('styles', function () {
    return gulp.src(path.src.less)
        .pipe(plugins.less({
            plugins: [autoprefix]
        }))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(path.dest.less));
});


// js代码校验
gulp.task('jshint', function () {
    return gulp.src(path.src.jshint)
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'));
});

// js代码压缩
gulp.task('scripts', function () {
    return gulp.src(path.src.scripts)
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(path.dest.scripts));
});

// 图片压缩
gulp.task('images', function () {
    return gulp.src(path.src.images)
        .pipe(plugins.cache(plugins.imagemin({ progressive: true, interlaced: true })))
        .pipe(gulp.dest(path.dest.images));
});



// watch
gulp.task('watch', function () {
    gulp.watch(path.src.less, ['styles']);
    gulp.watch(path.src.jshint, ['jshint']);
    gulp.watch(path.src.scripts, ['scripts']);
    gulp.watch(path.src.images, ['images']);
});


// 测试任务
gulp.task('test', function () {
    return gulp.src('test/**/*.js', { read: false })
        .pipe(plugins.mocha({ reporter: 'spec' }));
});

// 实时监听入口文件
gulp.task('nodemon', function () {
    plugins.nodemon({
        script: 'app.js',
        ignore: ['README.md', 'node_modules/**', '.DS_Store']
    });
});


gulp.task('default', ['watch', 'nodemon']);
