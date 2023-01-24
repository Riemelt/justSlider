const PugPlugin = require('pug-plugin');
const webpack = require('webpack');

const path = require('path');
const srcPath = path.resolve(__dirname, './src');
const output = path.resolve(__dirname, './demo');

const entryPoints = {
  index: './demo/index.pug',
};

const isDev = process.env.NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

console.log(mode);

module.exports = {
  mode,
  context: srcPath,
  plugins: [
    new PugPlugin({
      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    require('autoprefixer'),
  ],
  entry: entryPoints,
  output: {
    filename: 'assets/js/[name].[contenthash:8].js',
    path: output,
    clean: true,
  },
  devtool: isDev ? 'source-map' : false,
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@favicons': path.resolve(__dirname, './src/demo/assets/favicons/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        exclude: /(node_modules|bower_components)/,
        options: {
          basedir: path.resolve(__dirname, './src'),
        },
      },
      {
        test: /\.(svg|png|ico|xml|json|webmanifest)$/i,
        include: /favicons/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/favicons/[name].[hash][ext][query]',
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'postcss-preset-env'],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  performance: {
    hints: isDev ? 'warning' : 'error',
    maxEntrypointSize: isDev ? 1000000 : 500000,
    maxAssetSize: isDev ? 1000000 : 500000,
  },
  devServer: {
    hot: true,
    static: {
      directory: output,
    },
    open: true,
    compress: true,
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};
