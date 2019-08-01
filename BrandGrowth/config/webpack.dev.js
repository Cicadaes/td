const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'develop';
const dist = helpers.root('/', 'dist');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].js',
        path: dist,
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: dist,
        hot: true,
        inline: true,
        compress: false,
        port: 8989,
        host: 'localhost',
        proxy: {
            "/datareport": "http://172.23.5.199:9097"
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/, helpers.root('src'), {}),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
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
        })
    ],
    module: {
        rules: [{
                test: /\.ts$/,
                loaders: [{
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: helpers.root('src', 'tsconfig.json') }
                }, 'angular2-template-loader', 'angular-router-loader']
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
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(css|less)$/,
                include: helpers.root('/', 'src'),
                loader: 'css-to-string-loader!css-loader!less-loader'
            }
        ]
    },
};