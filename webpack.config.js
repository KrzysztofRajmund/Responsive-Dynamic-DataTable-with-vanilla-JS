const path = require("path");

module.exports = {
  mode: 'development',
  entry:"./src/app.js",
  output: {
      path: path.resolve(__dirname, "output"),
      filename: "app.bundle.js" 
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }

};