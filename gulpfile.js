var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    less        = require('gulp-less'),
    rimraf      = require('rimraf'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var path = {
  src: {                              //пути откуда брать исходники
    html:  'src/*.html',
    js:    'src/js/main.js',
    style: 'src/less/main.less',
    img:   'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  build: {                            //готовые после сборки файлы
    html:  'build/',
    js:    'build/js/',
    css:   'build/css/',
    img:   'build/img/',
    fonts: 'build/fonts/'
  },
  watch: {                            //наблюдаем за изменением этих файлов
    html:   'src/**/*.html',
    js:     'src/js/**/*.js',
    style:  'src/less/**/*.less',
    img:    'src/img/**/*.*',
    fonts:  'src/fonts/**/*.*'
  },
  clean:    './build'
};

var config = {                         //конфигурация dev сервера
  server: {
        baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "ea-studio"
}

gulp.task('webserver', function(){
    browserSync(config);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)                 //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html))   //Выплюнем их в папку build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)               //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true}));  //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.less
        .pipe(less()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});


gulp.task('build', [
    'html:build',
    'js:build',
    'img:build',
    'fonts:build',
    'style:build'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
     watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);