const { mn } = require('./config/default')
const srcToimg = require('./helper/srcToimg')
const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://image.baidu.com/')
    console.log('go to https://image.baidu.com/ ')

    //图片为懒加载，不可一次性获取很多图片
    //可以通过  1.不断触发滚动条 2.将浏览器大小改成很大值  触发懒加载

    await page.setViewport({
        //设置浏览器大小
        width: 1920,
        height: 1080
    })
    console.log('reset viewport')

    await page.focus('#kw')
    await page.keyboard.sendCharacter('狗')
    await page.click('.s_btn')
    console.log('go to search list')

    page.on('load', async() => {
        console.log('page loading done ,start fetch...')

        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img')
                //将抓取的图片转换成数组图片地址
            return Array.prototype.map.call(images, img => img.src)
        })
        console.log(`get ${srcs.length} images,start download`)

        srcs.forEach(async(src) => {
            await srcToimg(src, mn)
        })

        //获取图片列表结束后再关闭浏览器
        await browser.close()
    })

})()