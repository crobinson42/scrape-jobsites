let cheerio = require('cheerio')

// array of site object parameters
module.exports.pagesToVisit = [
  // query: software engineer
  // 'https://www.indeed.com/jobs?q=software+engineer&l=',
  // query: full stack developer
  'https://www.indeed.com/jobs?q=full+stack+developer&l=',
  // query: javascript developer
  'https://www.indeed.com/jobs?q=javascript+developer&l=',
  // query: javascript developer
  'https://www.indeed.com/jobs?q=javascript+developer&l=',
  // query: machine learning engineer
  'https://www.indeed.com/jobs?q=machine+learning+engineer&l=',
  // query: web developer
  'https://www.indeed.com/jobs?q=web+developer&l=',
  // query: data scientist
  'https://www.indeed.com/jobs?q=data+scientist&l=',
]

module.exports.siteParams =  {
  // indeed.com
  'www.indeed.com': {
    hostname: 'www.indeed.com',
    searchInput: 'input[name="q"]',
    searchButton: 'input[id="fj"]',
    paginationNextUrl: (html) => {
      let $ = cheerio.load(html)
      let aTag = $('a .pn .np:contains("Next")').parent().parent()
      return aTag ? aTag.attr('href') : null
    },
    getDataFromHtml: (html) => {
      const $ = cheerio.load(html)
      const data = []

      const containers = 'div.row.result'
      const jobTitle = 'a[data-tn-element="jobTitle"]'
      const location = 'span[class="location"]'
      const company = 'span.company'

      $(containers).each((i, element) => {
        const job = {
          title: $(element).find(jobTitle).text(),
          location: $(element).find(location).text(),
          company: $(element).find(company).text()
        }

        data.push(job)
      })

      return data
    }
  }
}
