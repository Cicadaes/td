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
        'cosmos': './src/cosmos.ts',
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
        port: 80,
        host: 'localhost',
        proxy: {
            //"/AppBuilderUM": "http://localhost:9393"
            // "/AppBuilderUM": "http://172.30.114.14",
            // "/sso": "http://172.30.114.14"
            "/console-api": "http://172.23.4.120:8080",
            "/dataauth": "http://172.23.4.120:8080",
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
            names: ['app', 'cosmos', 'vendor', 'polyfills']
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
            inject: false,
            baseUrl:'/'
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
