# 使用 Grunt 完成项目的自动化构建

1. 安装grunt
`npm i grunt -D`

2. 将项目中的gulpfile.js文件更名为gruntfile.js，同时根据需要安装相应模块

    - 2-1. 编译、压缩js
    ```javascript
    `npm i @babel/core @babel/preset-env grunt-contrib-uglify -D`

    module.exports = grunt => {
        grunt.initConfig({
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
            }
        })
    }
    ```
    - 2-2. 编译scss
    ```javascript
    `npm i grunt-sass sass -D`

        const sass = require('sass')

        module.exports = grunt => {
            grunt.initConfig({
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
                }
            })
        }
    ```
    - 2-3. 编译html
    ```javascript
    module.exports = grunt => {
        grunt.initConfig({
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
            }
        })
        loadGruntTask(grunt)
    }
    ```
    - 2-4. 处理静态文件
    ```javascript
    `npm i grunt-contrib-copy -D`

    module.exports = grunt => {
        grunt.initConfig({
            copy: {
                main: {
                    expand: true,
                    src: 'public/*',
                    dest: 'dist/',
                }
            }
        })
        loadGruntTask(grunt)
    }
    ```
    - 2-5. 监听文件变化
    ```javascript
    `npm i grunt-contrib-watch -D`

    module.exports = grunt => {
        grunt.initConfig({
            copy: {
                main: {
                    expand: true,
                    src: 'public/*',
                    dest: 'dist/',
                }
            }
        })
        loadGruntTask(grunt)
    }
    ```
    - 2-6. 清除
    ```javascript
    `npm i grunt-contrib-watch -D`

    module.exports = grunt => {
        grunt.initConfig({
            clean: {
                dist: 'dist/**'
            }
        })
        loadGruntTask(grunt)
    }
    ```
    - 2-7. 设置develop及build方法
    ```javascript
    grunt.registerTask('develop', ['sass', 'babel', 'watch'])
    grunt.registerTask('build', ['clean', 'copy', 'sass', 'babel', 'web_swig', 'uglify'])
    ```
    3. 由于gruntfile.js文件导出develop和build，分别用于运行程序以及打包程序，向package.json文件中的scripts中添加`'dev': 'grunt develop'`，用于运行程序；`'build': 'grunt build'`，用于打包程序