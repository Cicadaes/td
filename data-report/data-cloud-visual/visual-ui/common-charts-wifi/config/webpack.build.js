var webpack = require('webpack');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    output: {
        filename: '[name].js'
    },
    plugins: [

        new CopyWebpackPlugin([{
            from: helpers.root('/', 'public/'),
            to: helpers.root('/', 'build/public')
        },
            {
                from: helpers.root('/', 'components'),
                to: helpers.root('/', 'build/lib')
            }
        ])
    ]
};
