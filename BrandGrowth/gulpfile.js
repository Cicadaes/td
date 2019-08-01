/*
    开发环境执行:gulp dev
    生产环境执行:gulp build
*/

const gulp = require("gulp");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const gulpWebpack = require('webpack-stream');
const gulpLess = require('gulp-less');
const gulpWatch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const rename = require("gulp-rename");
const gulpSourcemaps = require('gulp-sourcemaps');

const devPort = "8989";

// 开发环境

// webpack-dev-server
gulp.task("webpack-dev", function() {
    var devServerConfig = Object.create(require("./config/webpack.dev"));
    devServerConfig.entry.app.unshift(`webpack-dev-server/client?http://localhost:${devPort}`, "webpack/hot/dev-server");
    var compiler = webpack(devServerConfig);
    var webserver = new WebpackDevServer(compiler, {
        stats: {
            colors: true
        },
        historyApiFallback: false,
        hot: false,
        inline: true,
        compress: true
    });
    webserver.listen(devPort, "localhost", function(err) {
        if (err) {
            console.log(err);
        }
    });
});

//less 处理器
gulp.task('less-theme', function() {
    var less = function() {
        return gulp.src('./src/assets/config/theme/view/**/*.less')
            .pipe(gulpSourcemaps.init())
            .pipe(gulpLess())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpSourcemaps.write())
            .pipe(gulp.dest('./src/assets/config/theme/view'));
    }
    less();
    return gulpWatch('./src/assets/config/theme/view/**/*.less', function() {
        return less();
    });
});

//less 处理器
gulp.task('less-component', function() {
    var less = function() {
        return gulp.src('./src/components/less/common/*.theme.less')
            .pipe(gulpSourcemaps.init())
            .pipe(gulpLess())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulpSourcemaps.write())
            .pipe(gulp.dest('./src/components/less/common'));
    }
    less();
    return gulpWatch('./src/components/less/common/*.theme.less', function() {
        return less();
    });
});

gulp.task('dev', ["less-theme", "webpack-dev"]);



// 生产环境

gulp.task('webpack-build', function() {
    var pro_webpackConfig = require("./config/webpack.prod");
    return gulp.src('')
        .pipe(gulpWebpack(pro_webpackConfig, webpack))
        .pipe(gulp.dest('build'));
});

gulp.task('less-theme-build', function() {
    return gulp.src('./src/assets/config/theme/view/**/*.less')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpLess())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('./src/assets/config/theme/view'));
});

gulp.task('less-component-build', function() {
    return gulp.src('./src/components/less/common/*.theme.less')
        .pipe(gulpSourcemaps.init())
        .pipe(gulpLess())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('./src/components/less/common'));
});

gulp.task('del-build', function(cb) {
    return del(['build'], cb);
});

gulp.task('build', ['del-build', 'less-theme-build', 'webpack-build']);