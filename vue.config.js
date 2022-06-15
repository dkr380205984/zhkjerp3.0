let TARGET
if (process.env.NODE_ENV === 'production') {
  // 正式环境
  TARGET = 'https://knit-beta.zwyknit.com'
} else {
  // 测试环境
  TARGET = 'https://knit-beta.zwyknit.com'
}
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 9966,
    https: false,
    proxy: {
      '/ever': {
        target: 'https://knit-m2-api.zwyknit.com',
        changeOrigin: true,
        ws: true
      },
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
