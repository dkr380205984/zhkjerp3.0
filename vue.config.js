let TARGET
if (process.env.NODE_ENV === 'development') {
  // 正式环境
  // TARGET = 'https://knit_api.zwyknit.com'
  // https://beta.zwyknit.com
  TARGET = 'https://knit_beta.zwyknit.com'
} else {
  // 正式环境
  TARGET = 'https://knit_api.zwyknit.com'
  // 测试环境
  // TARGET = 'https://beta.zwyknit.com'
}
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 9966,
    https: false,
    proxy: {
      '/scarf': {
        target: TARGET, // 对应自己的接口
        changeOrigin: true,
        ws: true
      },
      '/yarn': {
        target: TARGET, // 对应自己的接口
        changeOrigin: true,
        ws: true
      },
      '/api': {
        target: TARGET, // 对应自己的接口
        changeOrigin: true,
        ws: true
      }
    }
  }
}
