const fs = require('fs')
const path = require('path')
const marked = require('marked')
const browerSync = require('browser-sync')

/**
 * 1. 获得path, 源markdownpath, 目标path, css path
 * 2. markdown 转 html 
 * 3. html&css插入html模板 
 * 4. 监听md文档内容变更 更新hmtl
 * 5. 还是用browser-sync实时显示html内容
*/

let mpath = path.join(__dirname,process.argv[2])
let cssPath = path.resolve('github.css')
let htmlPath = mpath.replace(path.extname(mpath),'.html')

fs.watchFile(mpath,(curr,prev)=>{
    if(curr.mtime !== prev.mtime){
          fs.readFile(mpath,'utf-8',(err,data)=>{
              // md->html
              let htmlStr= marked(data)
              fs.readFile(cssPath,'utf-8',(err,data)=>{
                  let retHtml = temp.replace(`{{content}}`,htmlStr).replace('{{style}}',data)
                  fs.writeFile(htmlPath,retHtml,(err)=>{
                      console.log('write down')
                  })
              })
          })
    }
})

browerSync.init({
    brower:'',
    server:__dirname,
    watch:true,
    index:path.basename(htmlPath)
})

const temp = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 1000px;
                margin: 0 auto;
                padding: 45px;
            }
            @media (max-width: 750px) {
                .markdown-body {
                    padding: 15px;
                }
            }
            {{style}}
        </style>
    </head>
    <body>
        <div class="markdown-body">
            {{content}}
        </div>
    </body>
    </html>
`