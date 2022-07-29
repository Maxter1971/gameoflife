const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web",
  entry: { main: "./src/index.ts" },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    environment: {
      arrowFunction: false,
    },
    assetModuleFilename: "images/[name][ext]",
  },
  devtool:
    process.env.NODE_ENV === "development" ? "eval-source-map" : "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      $: require.resolve("jquery"),
      jQuery: require.resolve("jquery"),
    }),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: "babel-loader" },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devServer: {
    compress: true,
    port: 9000,
    watchFiles: ["*.html"],
  },
};
