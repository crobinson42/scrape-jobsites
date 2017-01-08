let cheerio = require('cheerio')

// array of site object parameters
module.exports.pagesToVisit = [
  // query: software engineer
  'https://www.indeed.com/jobs?q=software+engineer&l=',
  // query: software engineer
  // 'https://www.glassdoor.com/Job/jobs.htm?suggestCount=10&suggestChosen=false&clickSource=searchBtn&typedKeyword=software+engineer&sc.keyword=software+engineer&locT=&locId=',
]

module.exports.siteParams =  {
  // indeed.com
  'www.indeed.com': {
    hostname: 'www.indeed.com',
    searchInput: 'input[name="q"]',
    searchButton: 'input[id="fj"]',
    paginationNextUrl: (html) => {
      let $ = cheerio.load(html)
      let aTag = $('a:contains("Next")')
      return aTag ? aTag.attr('href') : null
    },
    dataElements: {
      listingContainer: 'div.row.result',
      jobTitle: 'a[data-tn-element="jobTitle"]',
      location: 'span[class="location"]',
      company: 'span.company'
    }
  },

  // glassdoor.com
  'www.glassdoor.com': {
    hostname: 'www.glassdoor.com',
    searchInput: 'input[name="sc.keyword"]',
    searchButton: 'button[class="searchSubmit tight gd-btn gd-btn-submit gd-btn-2 gd-btn-med gd-btn-icon gradient"]',
    paginationNextUrl: (html) => {
      let $ = cheerio.load(html)
      let aTag = $('li.next > a')
      return aTag ? aTag.attr('href') : null
    },
    dataElements: {
      listingContainer: 'li.jl',
      jobTitle: 'li.jl div.flexbox:nth-child(1) a',
      location: 'li.jl div.flexbox:nth-child(3) span',
      company: 'div.flexbox.padTop5'
    }
  }
}
