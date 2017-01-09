var colors = require('colors');
const jsdom = require("jsdom")
const createPhantomPool = require('phantom-pool').default
const helpers = require('./helpers')
const sites = require('./sites')

// Returns a generic-pool instance
const pool = createPhantomPool({
  max: 10, // default
  min: 2, // default
  // specifies how long a resource can stay idle in pool before being removed
  idleTimeoutMillis: 30000, // default.
  // For all opts, see opts at https://github.com/coopernurse/node-pool#createpool
  phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true', '--load-images=no'], {
    logLevel: 'info',
  }], // arguments passed to phantomjs-node directly, default is `[]`. For all opts, see https://github.com/amir20/phantomjs-node#phantom-object-api
})

let pageVisitCount = 0
let pageRotateCount = 0
let pageRotations = 0
const statusErrors = []
let file = 'scraped_data.json'
const fileRotateAfterNumberOfPageVisits = 10
const stopAfterNErrors = 5
const pagesToVisit = sites.pagesToVisit
const addPageToVisit = page => { pagesToVisit.push(page); console.log(`- Next page added`.dim);}
const getPageToVisit = () => pagesToVisit.shift()

async function visitPageAndGetData(url) {
  // Automatically acquires a phantom instance and releases it back to the
  // pool when the function resolves or throws
  return pool.use(async (instance) => {
    const page = await instance.createPage()
    page.setting('userAgent', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
    const status = await page.open(url, { operation: 'GET' })

    if (status !== 'success') {
      statusErrors.push('Cannot open ' + url + '. Status: ' + status)
    }

    pageVisitCount++
    pageRotateCount++

    if (fileRotateAfterNumberOfPageVisits < pageRotateCount) {

      // reset rotate count
      pageRotateCount = 0
      pageRotations++
      // rename file to count (remove existing number first)
      if (file.indexOf('__') > -1) {
        file = file.substr(file.indexOf('__') + 2)
      }
      file = `${pageRotations}__${file}`
    }

    const content = await page.property('content')
    // var document = jsdom.jsdom(content)

    const siteParams = helpers.getUrlSiteParams(url, sites.siteParams)
    if (!siteParams) { console.log(`Error: no site params: ${url}`); }

    const scrapedDataFromPage = helpers.getDataFromHtml(content, siteParams, url)

    helpers.formatAndSaveScrapedData(scrapedDataFromPage, file)

    let nextUrl = helpers.getNextPageUrl(content, siteParams)
    if (nextUrl) {
      if (! new RegExp(siteParams.hostname).test(nextUrl)) {
        nextUrl = 'https://' + siteParams.hostname + nextUrl
      }

      addPageToVisit(nextUrl)
    } else {
      console.log(`No next url on page:
        ${url}`.bgRed)
    }
    // scrape data
    // await page.evaluate(function() {
    //   console.log(helpers);
    //   // `document` is available in this function scope
    // })

  })
}

async function scrape() {
  const _url = pagesToVisit.shift()
  console.log(`Starting visit: ${_url}`.green);
  await visitPageAndGetData(_url)
  console.log(`Visit ${pageVisitCount} done.`);

  if (statusErrors.length >= stopAfterNErrors) {
    console.log('\n')
    console.log('\n')
    console.log(`We are stopping due to ${statusErrors.length} status errors:`);
    statusErrors.forEach(err => console.log(`  - ${err}`))
    closePool()
  }
  else if (pagesToVisit.length) {
    // we need to wait between page visits so we don't look like a DoS attack
    helpers.wait() // wait 5 seconds
    scrape()
  } else {
    console.log('We are done.'.inverse.green.bgOrange);
    closePool()
  }
}

// kick off the party...
scrape()

// Destroying the pool:
function closePool() {
  pool.drain().then(() => pool.clear())
}
