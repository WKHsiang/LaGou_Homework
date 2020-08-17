# 概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具

1. 创建 wgx-node-demo 文件夹，并转到此目录下
```node
mkdir wgx-node-demo

cd wgx-node-demo
```

2. 创建 package.json

```node
npm init
```
3. 在package.json中添加bin字段，指定cli文件的入口文件: “bin”:"cli.js"

```node
{
  "name": "wgx-node-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "author": "",
  "license": "ISC",
  "bin": "cli.js"
}
```

4. 安装所需依赖
```node
npm i inquirer // 询问
npm i ejs  //添加模板引擎
```

5. 创建cli.js文件
```node
#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头

// console.log('cli working')  //测试

/**
 * 脚手架的工作流程
 * 1、通过命令行交互询问用户问题
 * 2、根据用户回答的结果生成文件
 */
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer'); // 命令行交互插件
const ejs = require('ejs'); // 模板引擎

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name?',
        default: 'my-project'
    },
    {
        type: 'input',
        name: 'desc',
        message: 'Project description?'
    }
])
.then(answers => {
    //  console.log(anwsers)

    // 根据用户回答的结果生成文件

    // 拿到模板文件
    const tmplDir = path.join(__dirname, 'templates');
    // 目标目录
    const destDir = process.cwd();

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            // file => 文件相对于 templates 目录的相对路径
            // 通过模板引擎渲染文件
            ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
                if (err) throw err;

                // 将结果写入目标文件
                fs.writeFileSync(path.join(destDir, file), result);
            });
        });
    })
});

```

6. 创建模板 templates / index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    
</body>
</html>
```

7. 关联到全局变量
```node
npm link
```

8. 测试
```node
mkdir test  //创建测试文件夹

cd test    //切换文件夹

wgx-node-demo   //执行脚手架
```