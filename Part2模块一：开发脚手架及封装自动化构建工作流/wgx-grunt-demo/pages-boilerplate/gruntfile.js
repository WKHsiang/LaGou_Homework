// 实现这个项目的构建任务

const sass = require('sass')
const loadGruntTask = require('load-grunt-tasks')// 加载grunt插件
module.exports = grunt => {

    grunt.initConfig({
        // 处理js
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
                }
            }
        },
        // 压缩js 
        uglify: {
            my_target: {
                files: {
                    'dist/assets/scripts/main.min.js': ['dist/assets/scripts/main.js']
                }
            }
        },
        // 处理scss文件
        sass: {
            options: {
                sourceMap: true,
                implementation: sass//使用sass处理编译
            },
            main: {//配置目标
                files: {
                    'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
                }
            }
        },

        // 处理html
        web_swig: {
            options: {
                swigOptions: {
                    cache: false
                }
            },
            main: {
                expand: true,
                cwd: 'src/',
                src: "**/*.html",
                dest: "dist/"
            },
        },
        // 拷贝静态文件
        copy: {
            main: {
                expand: true,
                src: 'public/*',
                dest: 'dist/',
            }
        },
        // 清除
        clean: {
            dist: 'dist/**'
        },
        // 监视文件变化
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                task: ['babel']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                task: ['sass']
            }
        }
    })

    loadGruntTask(grunt)//自动加载所有插件
    grunt.registerTask('develop', ['sass', 'babel', 'watch'])
    grunt.registerTask('build', ['clean', 'copy', 'sass', 'babel', 'web_swig', 'uglify'])
}