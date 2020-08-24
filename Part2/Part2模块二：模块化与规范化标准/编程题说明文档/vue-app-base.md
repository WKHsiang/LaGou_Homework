# 使用 Webpack 实现 Vue 项目打包任务

## 步骤

1. 安装 `webpack webpack-cli webpack-dev-server`

2. 配置`webpack.config.js`入口文件`entry:'./src/main.js'`

3. 安装`vue less less-loader vue-loader vue-template-compiler file-loader style-loader css-loader vue-style-loader eslint eslint-loader`

4. 插件`webpack-merge html-webpack-plugin copy-webpack-plugin clean-webpack-plugin`

5. 配置文件

    - webpack.common.js
    ```javascript
    const webpack = require('webpack')
    const VueLoaderPlugin = require('vue-loader/lib/plugin') // 配合 vue-loader 使用，用于编译转换 .vue 文件
    const HtmlWebpackPlugin = require('html-webpack-plugin') // 用于生成 index.html 文件

    module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        // 它会应用到普通的 `.js` 文件
        // 以及 `.vue` 文件中的 `<script>` 块
        {
            test: /.js$/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
            }
        },
        // 配置 eslint-loader 检查代码规范，应用到 .js 和 .vue 文件
        {
            test: /\.(js|vue)$/,
            use: {
            loader: 'eslint-loader',
            options: {
                formatter: require('eslint-friendly-formatter') // 默认的错误提示方式
            }
            },
            enforce: 'pre', // 编译前检查
            exclude: /node_modules/, // 不检查的文件
            include: [__dirname + '/src'], // 要检查的目录
        },
        // 它会应用到普通的 `.css` 文件
        // 以及 `.vue` 文件中的 `<style>` 块
        {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        },
        // 配置 less-loader ，应用到 .less 文件，转换成 css 代码
        {
            test: /\.less$/,
            // loader: ['style-loader', 'css-loader', 'less-loader'],
            use: [{
            loader: "style-loader" // creates style nodes from JS strings
            }, {
            loader: "css-loader" // translates CSS into CommonJS
            }, {
            loader: "less-loader" // compiles Less to CSS
            }]
        },
        {
            test: /\.(png|jpe?g|gif)$/,
            use: {
            loader: 'file-loader',
            options: {
                name: 'img/[name].[ext]'
            }
            }
        },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
        // 值要求的是一个代码片段
        BASE_URL: JSON.stringify('')
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
        title: 'lxcan vue project',
        template: './public/index.html'
        }),
    ]
    }
    ```

    - webpack.dev.js
    ```javascript
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
    ```

    - webpack.prod.js
    ```javascript
    const commonConfig = require('./webpack.common')
    const merge = require('webpack-merge')
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    const path = require('path')

    module.exports = merge(commonConfig, {
        mode: 'production',
        devtool: 'nosources-source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // enable CSS Modules
                                modules: false,
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            usedExports: true,// 标记未引用代码
            minimize: true,//移除未使用代码
            splitChunks: {
                chunks: 'all'
            }
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    })
    ```

6. package.json配置脚本
```json
"scripts": {
    "serve": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "lint": "eslint --ext .js,.vue src",
    "lintfix": "eslint --fix --ext .js,.vue src"
},
```
