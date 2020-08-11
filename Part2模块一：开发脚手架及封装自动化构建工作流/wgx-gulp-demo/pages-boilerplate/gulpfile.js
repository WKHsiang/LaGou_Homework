// 实现这个项目的构建任务
const { src, dest, watch, series, parallel } = require('gulp')
const del = require('del')
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const imagemin = require('gulp-imagemin')
// const swig = require('gulp-swig')
// const useref = require('gulp-useref')
// const uglify = require('gulp-uglify')
// const cleanCss = require('gulp-clean-css')

// 自动加载插件
const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()

// 服务器
const browserSync = require('browser-sync')
const bs = browserSync.create()

const data = require('./package.json')

// 编译scss
const style = () => {
    return src('src/assets/styles/*.scss')
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist/css'))
}

// 编译JS
const js = () => {
    return src('src/assets/scripts/*.js')
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('dist/js'))
}
// 处理图片
const img = () => {
    return src('src/assets/images/**')
        .pipe(plugins.imagemin())
        .pipe(dest('dist/img'))
}
// 处理字体
const font = () => {
    return src('src/assets/fonts/**')
        .pipe(plugins.imagemin())
        .pipe(dest('dist/font'))
}

// 其他文件
const extra = () => {
    return src('public/**')
        .pipe(dest('dist/public'))
}
// 处理HTML文件
const html = () => {
    return src(['src/*.html', 'src/layouts/*.html', 'src/partials/*.html'])
        .pipe(plugins.swig({ data: { pkg: data }, cache: false }))
        .pipe(dest('dist'))
}

// 清除构建后的目录
const clean = () => {
    return del('dist')
}

// 监视变化
// font与image以及额外的文件，热更没有太大的必要，因为图片压缩是无损压缩，太多的监视会一定程度上消耗性能，所以一般不对其就行监视
const server = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', js)
    watch('src/*.html', html)
    watch(['src/assets/fonts/**', 'src/assets/images/**', 'public/**'], bs.reload)

    bs.init({
        notify: false,
        port: 2090,   // 自定义端口号
        open: false,  // 不自动打开浏览器
        files: 'dist',
        server: {
            baseDir: ['dist', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

// 文件引用处理
const ref = () => {
    return src('dist/*.html')
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(dest('dist'))
}
const compile = parallel(style, js, html)
// npm run dev
const develop = series(compile, ref, server)
// npm run build
const build = series(clean, parallel(compile, img, font, extra))

module.exports = {
    // clean,
    // style,
    compile,
    develop,
    build
}