const path = require('path');

module.exports = {
  entry: {
    app: './js/app.js', // Punkt wejścia
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Reguła dla plików .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Rozszerzenia, które Webpack będzie rozpoznawał
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  stats: {
    warnings: true,
    errors: true,
    modules: true,
    reasons: true,
  },
};
