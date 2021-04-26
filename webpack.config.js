const path = require('path');

module.exports = {
  // 入口
  entry: './src/index.js',
  // 出口
  output: {
    publicPath: "xuni",
    filename: 'bundle.js',
  },
  devServer: {
    // 端口号
    port: 8080,
    // 静态资源文件夹
    contentBase: "www"
  }
};