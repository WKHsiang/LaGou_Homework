const  commonConfig =  require('./webpack.common')
const merge = require('webpack-merge')

const path = require('path')


module.exports = merge(commonConfig,{
    mode:'development',
    devtool:'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9001,
        // open: true, // 启动服务时，自动打开浏览器
        hot: true // 开启热更新功能
    }
})