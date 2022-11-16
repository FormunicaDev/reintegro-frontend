const { mergeSassVariables } = require('@vuetify/cli-plugin-utils')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/reintegro/' : '/',
  lintOnSave: false,
  devServer: {
    open: process.platform === 'reintegro',
    https: false,
    port: 8084,
    host: '0.0.0.0',
    hotOnly: false,
  },
  transpileDependencies: ['vuetify'],

  /* configureWebpack: {
    performance: {
      hints: 'warning', // enum
      maxAssetSize: 1048576, // int (in bytes),
      maxEntrypointSize: 1048576, // int (in bytes)
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 550000,
        cacheGroups: {
          node_vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 1,
          },
        },
      },
    },
  }, */
  chainWebpack: config => {
    const modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
    modules.forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss'"))
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss';"))
    })
  },
}
