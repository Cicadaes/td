var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor4': './src/vendor4.ts',
        'vendor3': './src/vendor3.ts',
        'vendor2': './src/vendor2.ts',
        'vendor1': './src/vendor1.ts',
        'app': './src/main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js', '.css', '.scss']
    },

    module: {
        loaders: [{
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader', 'angular-router-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(gif|jpe?g|png|woff|woff2|svg|eot|ttf|mp3|ico)\??.*$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            /*{
             test: /\.(gif|jpe?g|png|woff|woff2|svg|eot|ttf|mp3|ico)\??.*$/,
             loader: 'url?limit=8192'
             },*/
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            },
            {
                test: /\.scss$/,
                loader: 'to-string-loader!css-loader!sass-loader',
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor1', 'vendor2', 'vendor3', 'vendor4', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),

        new webpack.ProvidePlugin({

        })
    ]
};