var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'test';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('/target/marketing'),
        publicPath: '/marketing/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    htmlLoader: {
        minimize: false // workaround for ng2
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         keep_fnames: true
        //     }
        // }),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new CopyWebpackPlugin([{
            from: helpers.root('/', 'public'),
            to: helpers.root('/', 'target/marketing/public')
        }])
    ]
});