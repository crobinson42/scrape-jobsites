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
const statusErrors = []
const stopAfterNErrors = 5
const pagesToVisit = sites.pagesToVisit
const addPageToVisit = page => { pagesToVisit.push(page); console.log('page added...');}
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

    const content = await page.property('content')
    // var document = jsdom.jsdom(content)

    const siteParams = helpers.getUrlSiteParams(url, sites.siteParams)
    if (!siteParams) { console.log(`Error: no site params: ${url}`); }

    const scrapedDataFromPage = helpers.getDataFromHtml(content, siteParams, url)

    helpers.formatAndSaveScrapedData(scrapedDataFromPage)

    let nextUrl = helpers.getNextPageUrl(content, siteParams)
    if (nextUrl) {
      if (! new RegExp(siteParams.hostname).test(nextUrl)) {
        nextUrl = 'https://' + siteParams.hostname + nextUrl
      }

      addPageToVisit(nextUrl)
    } else {
      console.log(`No next url on page:
        ${url}`)
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
  console.log(`Starting visit: ${_url}`);
  await visitPageAndGetData(_url)
  console.log(`Visit done.`);

  if (statusErrors.length >= stopAfterNErrors) {
    console.log('\n')
    console.log('\n')
    console.log(`We are stopping due to ${statusErrors.length} status errors:`);
    statusErrors.forEach(err => console.log(`  - ${err}`))
    closePool()
  }
  else if (pagesToVisit.length) {
    scrape()
  } else {
    console.log('We are done.');
    closePool()
  }
}

// kick off the party...
scrape()

// Destroying the pool:
function closePool() {
  pool.drain().then(() => pool.clear())
}
