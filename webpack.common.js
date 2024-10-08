// webpack.common.js
const path = require('path');

module.exports = {
  entry: {
    app: './js/app.js', // Punkt wejścia
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js', // Dodaje hash dla cache busting
    assetModuleFilename: 'assets/[hash][ext][query]', // Lokalizacja assetów
    clean: true, // Czyści katalog `dist` przed każdym buildem
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Reguła dla plików .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpilacja ES6+ do ES5
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i, // Reguła dla plików .css
        use: ['style-loader', 'css-loader'], // Loadery do ładowania CSS
      },
      {
        test: /\.(png|jpg|gif|svg)$/i, // Reguła dla obrazów
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Reguła dla fontów
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Rozszerzenia, które Webpack będzie rozpoznawał
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
};
