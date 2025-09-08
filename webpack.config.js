const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
      watch: true,
    },
    port: 8080,
    hot: true,
    liveReload: true,
    open: true,
    watchFiles: ['src/**/*', 'index.html'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
