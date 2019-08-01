const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const extractLESS = new ExtractTextPlugin('assets/style.css');
const helpers = require('./helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const dist = helpers.root('/', 'um/console');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'cosmos': './src/cosmos.ts',
        'app': './src/main.ts'
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].js',
        path: dist,
        publicPath: '/um/console/'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin([dist], {
            allowExternal: true
        }),
        new CheckerPlugin(),
        new UglifyJSPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/, helpers.root('src'), {}),
        new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, helpers.root('src'), {}),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'cosmos', 'vendor', 'polyfills', 'manifest']
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new ExtractTextPlugin('style.css'),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: true
            }
        }),
        new FaviconsWebpackPlugin({
            logo: './src/assets/images/tdlogo2.png',
            prefix: 'assets/icons/',
            emitStats: false,
            persistentCache: true,
            inject: true,
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new CopyWebpackPlugin([{
            from: helpers.root('src', 'assets'),
            to: `${dist}/assets`
        }]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.ejs',
            inject: false
        }),
        new AngularCompilerPlugin({
            tsConfigPath: helpers.root('src', 'tsconfig.json'),
            entryModule: helpers.root('src', 'app/app.module#AppModule'),
            sourceMap: true
        })
    ],
    module: {
        rules: [{
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            loader: '@ngtools/webpack'
        },
        {
            test: /\.html$/,
            loader: 'html-loader'
        },
        {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: 'file-loader?name=assets/hash/[name].[hash].[ext]'
        },
        {
            test: /\.(css|less)$/,
            exclude: helpers.root('/', 'src'),
            use: extractLESS.extract(['css-loader', 'less-loader'])
        },
        {
            test: /\.(css|less)$/,
            include: helpers.root('/', 'src'),
            loader: 'css-to-string-loader!css-loader!less-loader'
        }
        ]
    },
};