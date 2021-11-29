
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require('path');
const SCSS_DIR = 'src/scss/';

module.exports = {
    mode: 'production',
    entry: {
        'main': path.resolve(SCSS_DIR, 'main.scss'),
        'options': path.resolve(SCSS_DIR, 'options.scss')
    },
    output: {
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new FixStyleOnlyEntriesPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            }
        ]
    }
};
