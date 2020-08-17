# 使用 Gulp 完成项目的自动化构建

1. 安装gulp
`npm i gulp -D`

2. 编辑已有的gulpfile.js文件，（无此文件时则自行创建），同时根据需要安装相应模块

    - 2-1. 自动加载插件
    ```javascript
    `npm i gulp-load-plugins -D`

    const gulpLoadPlugins = require('gulp-load-plugins')
    const plugins = gulpLoadPlugins()

    // 不用每次都去引入插件，可以使用plugins自动引入插件
    ```

    - 2-2. 编译样式
    ```javascript
    //gulp的入口文件
    //导入文件路径API
    const { dest, src } = require('gulp')
    const sass = require('gulp-sass')

    const style = () => {
    return src('src/assets/styles/*.scss')
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist/css'))
    }

    module.exports = {
    style
    }
    ```

    - 2-3. 编译JS文件
    ```javascript

    `npm i @babel/core @babel/preset-env -D`

    const js = () => {
    return src('src/assets/scripts/*.js')
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('dist/js'))
    }
    module.exports = {
        js
    }
    ```
    

    - 2-4. 编译HTML
    ```javascript

    `npm i gulp-swig -D`

    const html = () => {
    return src(['src/*.html', 'src/layouts/*.html', 'src/partials/*.html'])
        .pipe(plugins.swig({ data: { pkg: data } }))
        .pipe(dest('dist'))
    }
    module.exports = {
        html
    }
    ```

    - 2-5. 编译图片、字体
    ```javascript

    `npm i gulp-imagemin -D`

    // 编译图片
    const img = () => {
        return src('src/assets/images/**')
            .pipe(plugins.imagemin())
            .pipe(dest('dist/img'))
    }
    // 编译字体
    const font = () => {
        return src('src/assets/fonts/**')
            .pipe(plugins.imagemin())
            .pipe(dest('dist/font'))
    }
    module.exports = {
        img,
        font
    }
    ```

    - 2-6. 编译其他文件
    ```javascript
    const extra = () => {
    return src('public/**')
        .pipe(dest('dist/public'))
    }
    module.exports = {
        extra
    }
    ```

    - 2-7. 清除
    ```javascript
    `npm i del -D`
    // 清除构建后的目录
    const clean = () => {
        return del('dist')
    }
    ```

    - 2-7. 服务
    ```javascript

    const browserSync = require('browser-sync')
    const bs = browserSync.create()

    const serve = () => {
        bs.init({
            notify: false,
            files: 'dist',
            server: {
                baseDir: ['dist', 'src', 'public'],
                routes: {
                    //处理静态文件，进行路由映射
                    '/node_modules': "node_modules"
                }
            }
        })
    }

    module.exports = {
        style, js, img, font, extra, serve
    }
    ```

    - 2-8. 监听
    ```javascript
    // font与image以及额外的文件，热更没有太大的必要，因为图片压缩是无损压缩，太多的监视会一定程度上消耗性能，所以一般不对其就行监视
    const server = () => {
        watch('src/assets/styles/*.scss', style)
        watch('src/assets/scripts/*.js', js)
        watch(['src/assets/fonts/**', 'src/assets/images/**', 'public/**'], bs.reload)

        bs.init({
            notify: false,
            files: 'dist',
            server: {
                baseDir: ['dist', 'src', 'public'],
                routes: {
                    '/node_modules': 'node_modules'
                }
            }
        })
    }
    ```

    - 2-9. 文件引用处理
    ```javascript
    const ref = () => {
        return src('dist/*.html')
            .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
            .pipe(plugins.if(/\.js$/, plugins.uglify()))
            .pipe(plugins.if(/\.html$/, plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
            .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
            .pipe(dest('dist'))
    }
    ```

    - 2-10. 设置develop及build方法
    ```javascript
    const compile = parallel(style, js, html, img, font)
    // npm run dev
    const develop = series(compile, ref, server)
    // npm run build
    const build = series(clean, parallel(compile, extra))
    ```
    - 2-11. 导出
    ```javascript
    module.exports = {
        clean,
        develop,
        build
    }
    ```
 
3. 由于gulpfile.js文件导出develop和build，分别用于运行程序以及打包程序，向package.json文件中的scripts中添加`'dev': 'gulp develop'`，用于运行程序；`'build': 'gulp build'`，用于打包程序