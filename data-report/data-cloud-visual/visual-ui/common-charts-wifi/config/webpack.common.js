var webpack = require('webpack');
var helpers = require('./helpers');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'main': './demo/index.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "ts-loader" },
            {
                test: /\.(gif|jpe?g|png|woff|woff2|svg|eot|ttf|mp3|ico)\??.*$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/index.html'
        })

    ],

    node: {
        fs: "empty"
    }
};