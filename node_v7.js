const phantom = require('phantom');
const cheerio = require('cheerio');

(async function() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        // console.info('Requesting', requestData.url)
    });

    const status = await page.open('https://www.therms.io/');
    console.log(status);

    const content = await page.property('content');

    let $ = cheerio.load(content)
    console.log($('title').text());

    // therms test
    await page.evaluate(function() {
      return document.querySelector('.nav.navbar-nav.navbar-right li:nth-child(1) a').click()

    })

    await instance.exit();
}());
