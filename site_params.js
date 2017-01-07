// array of site object parameters
exports.default = [
  {
    // indeed.com
    controlsElementSelectors: {
      searchInput: 'input[name="q"]',
      searchButton: 'input[id="fj"]',
      paginationNext: () => {
        // no element on the last page of results
        let _el
        document.querySelectorAll('div.pagination a').forEach(aTag => {
          let _nextSpan = aTag.querySelector('span.np')
          if (_nextSpan) {
            _nextSpan.innerHTML.indexOf('Next') !== -1 ? _el = aTag : null
          }
        })
        if (!_el) {
          console.warn('indeed.com pagination next el not found.')
        }
        return _el
      },
      paginationNextUrl: (paginationNextSelector) => {
        return paginationNextSelector.href
      }
    }
    dataElements: {
      listingContainer: 'div.row.result',
      jobTitle: 'a[data-tn-element="jobTitle"]',
      location: 'span[class="location"]',
      company: 'span.company'
    }
  },

  {
    // glassdoor.com
    controlsElementSelectors: {
      searchInput: 'input[name="sc.keyword"]',
      searchButton: 'button[class="searchSubmit tight gd-btn gd-btn-submit gd-btn-2 gd-btn-med gd-btn-icon gradient"]',
      paginationNext: 'li.next > a',
      paginationNextUrl: (paginationNextSelector) => {
        return document.querySelector(paginationNextSelector).href
      }
    }
    dataElements: {
      listingContainer: 'li.jl',
      jobTitle: 'li.jl div.flexbox:nth-child(1) a',
      location: 'li.jl div.flexbox:nth-child(3) span',
      company: 'div.flexbox.padTop5'
    }
  }
]
