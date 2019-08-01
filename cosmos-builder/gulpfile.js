// 编译 ts 打包
const gulp = require("gulp");
const del = require('del');
const sourceMaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

// 发布 npm 包
const sdkFolder = `npm_build_sdk/src`;

const sdk_tsProject = ts.createProject('./npm.tsconfig.json', {
    declaration: true,
    declarationDir: sdkFolder
});

gulp.task('del-npm-build', function (cb) {
    return del([sdkFolder], cb);
});

gulp.task('npm-build-sdk-tsc', function () {
    return gulp.src('./src/cosmos-sdk/sdk/**/*.ts', { base: './src/cosmos-sdk/sdk' })
        .pipe(sourceMaps.init())
        .pipe(sdk_tsProject())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(sdkFolder));
});

gulp.task('npm-build', ['del-npm-build', 'npm-build-sdk-tsc']);