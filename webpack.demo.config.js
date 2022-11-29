const HtmlWebpackPlugin     = require("html-webpack-plugin");
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");
const PugPlugin             = require("pug-plugin");
const webpack               = require("webpack");

const path    = require("path");
const srcPath = path.resolve(__dirname, "./src");
const output  = path.resolve(__dirname, "./demo");

const entryPoints = {
  demo: "./demo/index.ts",
};

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
console.log(mode + " mode");

module.exports = {
  context: srcPath,
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./[name].[contenthash].css",
      ignoreOrder: true,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    require("autoprefixer"),
    new HtmlWebpackPlugin({
      template: "./demo/index.pug",
      filename: "./index.html",
      chunks: ["demo"],
    }),
  ],
  entry: entryPoints,
  output: {
    filename: "./[name].[contenthash].js",
    path: output,
    clean: true,
  },
  devtool: (mode === "development") ? "eval-source-map" : false,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@favicons": path.resolve(__dirname, "./src/demo/assets/favicons/"),
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        exclude: /(node_modules|bower_components)/,
        options: {
            basedir: path.resolve(__dirname, "./src")
        }
      },
      {
        test: /\.(svg|png|ico|xml|json|webmanifest)$/i,
        include: /favicons/,
        type: "asset/resource",
        generator: {
          filename: "assets/favicons/[name][hash][ext][query]",
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          (mode === "development") ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "autoprefixer",
                  "postcss-preset-env",
                ]
              }
            }
          },
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: path.resolve(__dirname, "./src/styles/variables.scss")
            }
          },
        ]
      },
    ]
  },
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, "demo"),
    },
  },
};