const path = require('path')

const debug = process.env.NODE_ENV !== 'production'


module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './public/styles/scss/*.scss')
      ]
    }
  },
  publicPath: debug ? '/' : './',
  //不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  // css source map
  css: {
    sourceMap: debug ? true : false
  }
}
