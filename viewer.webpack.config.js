const { resolve } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires
const { config } = require('dotenv'); // eslint-disable-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires

config();

module.exports = {
  mode: process.env.NODE_ENV,
  // entry point for Webpack
  entry: './src/viewer/index.tsx',
  output: {
    // output folder path
    path: resolve(__dirname, 'dist'),
    // output filename
    filename: 'viewer.js'
  },
  // source maps
  devtool: 'source-map',
  // ultimate deploy target
  target: 'web',
  // don't bundle these with webpack but search externally
  // externals: {
  //   'react': 'React'
  // },
  // serve up content from this folder
  serve: {
    port: 1337,
    content: './dist'
  },
  // resolve these extensions automagically
  resolve: {
    extensions: ['.ejs', '.js', '.jsx', '.ts', '.tsx', '.css']
  },
  // CLI output (stats)
  stats: 'normal',
  module: {
    // rules for testing what should be loaded
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  // plugins for helping deployment
  plugins: [
    new HtmlWebpackPlugin({
      // adds a hash for cache busting
      hash: true,
      // title of the HTML page
      title: 'Replay -- Visualize your G-code',
      // output filename
      filename: 'index.html',
      // template to base the page on
      template: 'src/viewer/views/main.ejs',
      // the favicon
      favicon: 'src/viewer/static/ico/favicon-16x16.png',
      // script injection
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};