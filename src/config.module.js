(function() {

  /**
  * Config Module
  */
  angular
    .module('app.config', [])

    .constant('API', {
      ENDPOINT: 'https://api.github.com'
    })

    .constant('GISTS', {
      PER_PAGE: 100
    })

    .constant('d3', d3)

  ;

}());