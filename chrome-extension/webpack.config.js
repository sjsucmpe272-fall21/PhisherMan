
const path = require('path');
const SCRIPTS_PATH = './src/ts/';

module.exports = {
    mode: 'development',
    entry: {
        'background': path.resolve(SCRIPTS_PATH, 'background.ts'),
        'index': path.resolve(SCRIPTS_PATH, 'index.ts'),
        'options': path.resolve(SCRIPTS_PATH, 'options.ts'),
    },
    devtool: 'inline-cheap-module-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve('./dist')
    },
    module: {
        rules: [
            {
                test: /\.(t|j)s$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
