const URL = require('url')
let cheerio = require('cheerio')

const helpers = {
  /**
   * This method fetches the nextUrl from the document, if it exists.
   * @param {object} document A document obj from the phantomjs page.evaluate context
   * @param {object} siteParams A siteParams object containing the site specific selectors etc.
   * @return {string|null}
   */
  getNextPageUrl(html, siteParams) {
    if (!html || !siteParams || !siteParams.paginationNextUrl) {
      return null
    }

    return siteParams.paginationNextUrl(html)
  },

  // returns the dom node
  getPaginationNextElement(html, siteParams) {
    if (typeof siteParams.paginationNext === 'function') {
      return siteParams.paginationNext(html)
    } else {
      let $ = cheerio.load(html)
      $(siteParams.paginationNext)
    }
  },

  // This method will parse a urlString and return the siteParams that match the hostname
  getUrlSiteParams(urlString, siteParamsObject) {
    const hostname = URL.parse(urlString).hostname
    return siteParamsObject[hostname]
  },

  /**
   * This helper method will use cheerio and the siteParams selectors
   * to scrape data from the given html
   */
  getDataFromHtml(html, siteParams, url) {
    let data = {
      hostname: siteParams.hostname
    }



    if (!data) {
      console.log(`No html scrape data found at:
        ${url}`)
    }

    return data
  },

  /**
   * Takes in the scraped data from html and formats then saves to a file.
   * @param {object} scrapedDataFromPage The data object
   */
  formatAndSaveScrapedData(scrapedDataFromPage) {

    const formatted = helpers.formatScrapedData(scrapedDataFromPage)
    helpers.saveScrapedData(formatted)
  },

  /**
   * This method formats a data object of scraped data from a webpage.
   * The formatting is simply a JSON.stringify
   * @param {object} dataObj an object of data from helpers.getDataFromHtml()
   * @return {string}
   */
  formatScrapedData(dataObj) {
    try {
      return JSON.stringify(dataObj)
    } catch(e) {
      console.log(`Error: helpers.formatScrapedData() ${e}`);
      console.log(`   dataObj param: `, dataObj)
      return ''
    }
  },

  /**
   * Saves formatted data syncronously to file. The data must be formatted
   * in JSON format before being saved.
   * @param {string} formattedData data in a JSON string
   */
  saveScrapedData(formattedData) {

  }
}

module.exports = helpers
