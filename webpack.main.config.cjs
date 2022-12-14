const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const srcPath = path.resolve(__dirname, './src');
const output = path.resolve(__dirname, './dist');

const entryPoints = {
  'just-slider': ['./app/index.ts', './styles/base.scss'],
};

const isDev = process.env.NODE_ENV === 'development';
const cssLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
const mode = isDev ? 'development' : 'production';

console.log(mode);

module.exports = {
  mode,
  context: srcPath,
  plugins: [
    new MiniCssExtractPlugin({
      filename: './[name].css',
      ignoreOrder: true,
    }),
    require('autoprefixer'),
  ],
  entry: entryPoints,
  output: {
    filename: './[name].js',
    path: output,
    clean: true,
  },
  devtool: isDev ? 'eval-source-map' : false,
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
      '@styles': path.resolve(__dirname, './src/styles/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
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
          cssLoader,
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
};
