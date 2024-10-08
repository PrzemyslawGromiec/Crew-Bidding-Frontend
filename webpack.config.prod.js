// webpack.config.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'), // Ścieżka do szablonu HTML
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'html', to: 'html' }, // Kopiuje folder html
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // Ekstrakcja CSS do osobnych plików
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // Zastępuje style-loader
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]', // Lokalizacja assetów
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // Dzieli kod na wszystkie kawałki
    },
    runtimeChunk: 'single', // Dzieli runtime na osobny plik
  },
});
