var webpack = require('webpack');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    output: {
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: helpers.root('/', 'src/app/smart-reports'),
            to: helpers.root('/', 'smart-reports-npm/lib')
        },
        {
            from: helpers.root('/', 'public/css/smart'),
            to: helpers.root('/', 'smart-reports-npm/img')
        }
        ])
    ]
};