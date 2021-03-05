const path = require("path"); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      .set("@", resolve("./src"))
      .set("@assets", resolve(".src/assets"))
      .set("@components", resolve("./src/components"))
      .set("@views", resolve("src/views"));
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        // 配置全局作用的less
        globalVars: {
          hack: `true; @import '~@/commonStyle/appConfig.less';`
        }
      }
    }
  },
  // webpack 配置
  devServer: {
    host: "localhost",
    port: 8081, // 端口号
    https: false,
    //open: true, //配置自动启动浏览器

    // 配置多个代理
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 本地模拟数据服务器
        changeOrigin: true,
        pathRewrite: {
          "^/api": "" // 去掉接口地址中的api字符串
        }
      },
      "/foo": {
        target: "http://localhost:8080", // 本地模拟数据服务器
        changeOrigin: true,
        pathRewrite: {
          "^/foo": "" // 去掉接口地址中的foo字符串
        }
      }
    }
  }
};
