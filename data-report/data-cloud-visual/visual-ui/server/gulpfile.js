/**
 * Created by wangshouyun on 2016/10/29.
 */

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var gulpWebpack = require('gulp-webpack');
var admin_webpackConfig = require("./webpack.config.admin.js");
var app_webpackConfig = require("./webpack.config.app.js");
var home_webpackConfig = require("./webpack.config.home.js");

//admin
gulp.task("admin:webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(admin_webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    //inline hot模式
    /*myConfig.hot = true;
     myConfig.plugins = myConfig.plugins.concat(
     new webpack.HotModuleReplacementPlugin()
     );*/

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://172.30.116.28:8080/webpack-dev-server/index.html");
    });
});
gulp.task('admin-build', function () {
    return gulp.src('')
        .pipe(gulpWebpack(admin_webpackConfig))
        .pipe(gulp.dest('../../server/site/admin/www/'));
});

//app
gulp.task("app:webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(app_webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8081, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8081/webpack-dev-server/app/index.html");
    });
});
gulp.task('app-build', function () {
    return gulp.src('')
        .pipe(gulpWebpack(app_webpackConfig))
        .pipe(gulp.dest('../../app/android/qiaxuewen/app/src/main/assets/www/'))
        .pipe(gulp.dest('../../app/ios/qiaxuewen/qiaxuewen/www/'))
        .pipe(gulp.dest('../../server/site/app/www/'));
});

//home
gulp.task("home:webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(home_webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8082, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8082/webpack-dev-server/home/index.html");
    });
});
gulp.task('home-build', function () {
    return gulp.src('')
        .pipe(gulpWebpack(home_webpackConfig))
        .pipe(gulp.dest('../../server/site/home/www/'));
});

//public
gulp.task('public-build', function () {
    return gulp.src('src/public/**/*')
        .pipe(gulp.dest('../../server/site/public/www/'));
});

//all
gulp.task('all-build', ['admin-build', 'app-build', 'home-build']);