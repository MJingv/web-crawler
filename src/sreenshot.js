const { screenshot } = require('./config/default')
const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://baidu.com');
    await page.screenshot({
        path: `${screenshot}/${Date.now()}.png`
    });
    await browser.close();
})();