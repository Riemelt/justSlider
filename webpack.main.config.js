const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path    = require('path');
const srcPath = path.resolve(__dirname, "./src");
const output  = path.resolve(__dirname, "./dist");

const entryPoints = {
  ["just-slider"]: "./app/index.ts",
};

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
console.log(mode + " mode");

module.exports = {
  context: srcPath,
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./[name].css",
      ignoreOrder: true,
    }),
    require('autoprefixer'),
  ],
  entry: entryPoints,
  output: {
    filename: "./[name].js",
    path: output,
    clean: true,
  },
  devtool: (mode === "development") ? "eval-source-map" : false,
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
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
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, "./src/styles/variables.scss")
            }
          },
        ]
      },
    ]
  },
};