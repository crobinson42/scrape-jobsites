var colors = require('colors');
const URL = require('url')
const FS = require('fs')
let cheerio = require('cheerio')

const helpers = {
  // blocking script to cause a wait
  wait(seconds = 5) {
    console.log(`   waiting ${seconds} seconds`.bgYellow);
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}
  },

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
    let data = {}

    if (!siteParams.getDataFromHtml) {
      console.log(`Error: helpers.getDataFromHtml() no siteParams.getDataFromHtml method.`)
      console.log(`   ${siteParams.hostname}`);
    }

    data.data = siteParams.getDataFromHtml(html)

    if (!data) {
      console.log(`No html scrape data found at:
        ${url}`)
    } else {
      // add the hostname to the data
      data.hostname = siteParams.hostname
    }

    return data
  },

  /**
   * Takes in the scraped data from html and saves to a file.
   * @param {object} scrapedDataFromPage The data object
   * @param {string} file The file to save to
   */
  formatAndSaveScrapedData(scrapedDataFromPage, file) {
    helpers.saveScrapedDataSync(file, scrapedDataFromPage)
  },

  /**
   * This method JSON.stringify
   * @param {object} dataObj an object of data from helpers.getDataFromHtml()
   * @return {string}
   */
  stringify(dataObj) {
    try {
      return JSON.stringify(dataObj)
    } catch(e) {
      console.log(`Error: helpers.stringify() ${e}`);
      console.log(`   dataObj param: `, dataObj)
      return ''
    }
  },

  /**
   * Saves formatted data syncronously to file. The data must be formatted
   * in JSON format before being saved.
   * @param {string} file The file to save to
   * @param {string} data data to save
   */
  saveScrapedDataSync(file, data) {
    // check if file exists
    try {
      FS.accessSync(file)
    } catch (e) {
      console.log(`Creating file: ${file}`.blue.bgWhite);
      // create file
      FS.writeFileSync(file, JSON.stringify([]))
    }

    try {
      let _fileData = FS.readFileSync(file)
      _fileData = JSON.parse(_fileData)
      _fileData.push(data)
      _fileData = JSON.stringify(_fileData)
      FS.writeFileSync(file, _fileData)
    } catch (e) {
      console.log(`Error: helpers.saveScrapedDataSync() ${e}`);
      console.log(`   file param: `, file)
      console.log(`   data param: `, formattedData)
    }
  }
}

module.exports = helpers
