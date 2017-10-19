const http = require('http')
const https = require('https')
const fs = require('fs')
const { mn } = require('../config/default')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = async(src, dir) => {
    console.log('-----' + src + '-----')
    if (/\.(jpg|png|gif)$/.test(src)) {
        await urlToimg(src, dir)
    } else {
        await base64Toimg(src, dir)
    }
}

//url=>image
const urlToimg = promisify((url, dir, callback) => {
    const mod = /^https:/.test(url) ? https : http
    const ext = path.extname(url) //拓展名
    const file = path.join(dir, `${Date.now()}${ext}`)
    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback()
                console.log(file)
            })
    })
})

//base64=>image
const base64Toimg = async(base64Str, dir) => {
    //data:image/jpeg;base64,/xxxxxx
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
    try {
        const ext = matches[1].split('/')[1].replace('jpeg', 'jpg') //得到扩展名jpge并转换为jpg
        const file = path.join(dir, `${Date.now()}.${ext}`)
        await writeFile(file, matches[2], 'base64')
        console.log(file)
    } catch (error) {
        console.log('非法base64字符串')
    }
}