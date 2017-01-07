// search terms
/*
software developer	software
web developer	engineer
java	java developer
programmer	entry level software engineer
computer science	developer
junior web developer	front end developer
software engineer	web design
web designer	software developer
front end web developer	developer
web	javascript
 */

Class Website {
  constructor(props) {
    this.www = props.www
    // elements to be used for controlling navigation/searching
    this.controlsElementSelectors = {
      searchInput: 'input[name="q"]',
      searchButton: 'input[id="fj"]',

    }
    // the data to scrape
    this.dataElements = {
      listingContainer: 'div.row.result',
      jobTitle: 'a[data-tn-element="jobTitle"]',
      location: 'span[class="location"]',
      company: 'span.company'
    }
    this.siteTitle
  }

}
