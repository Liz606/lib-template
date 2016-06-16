
/* eslint-disable */
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var merge = require('webpack-merge');
var TARGET = process.env.npm_lifecycle_event;
var EXAMPLES_DIR = path.resolve(__dirname, 'examples');

var common = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/,
        }]
    },
};

if (TARGET === 'start') {
    module.exports = merge(common, {
        entry: buildEntries(),
        output: {
            path: 'examples/__build__',
            publicPath: '/',
            filename: '[name].js',
            chunkFilename: "[name].chunk.min.js"
        },
        devTool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            // host: '192.168.67.79',
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'lib-temlate',
                template: 'examples/index.html', // Load a custom template
                inject: 'body' // Inject all scripts into the body
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        ]
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {
        entry: {
            'infinite-scroll': './lib/index.js',
            'infinite-scroll.min': './lib/index.js'
        },
        output: {
          filename: '[name].js',
          chunkFilename: '[id].chunk.js',
          path: 'dist',
          publicPath: '/',
          libraryTarget: 'umd',
          library: 'InfiniteScroll'
        },
        externals: [
            'react',
            'react-dom'
        ],
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new UglifyJsPlugin({
              include: /\.min\.js$/,
              minimize: true,
              compress: {
                warnings: false
              }
            })
        ],
    });
}


function buildEntries() {
    return fs.readdirSync(EXAMPLES_DIR).reduce(function (a, b) {
        if (b === '__build__') {
            return a;
        }

        var isDraft = b.charAt(0) === '_';

        if (!isDraft && isDirectory(path.join(EXAMPLES_DIR, b))) {
            a[b] = path.join(EXAMPLES_DIR, b, 'index.js');
        }

        return a;
    }, {});
}


function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}
