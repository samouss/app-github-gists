(function() {

  /**
  * Config Module
  */
  angular
    .module('app.config', [])

    .constant('API', {
      ENDPOINT: 'https://api.github.com',
      ACCESS_TOKEN: null
    })

    .constant('GISTS', {
      PER_PAGE: 100
    })

    .constant('d3', d3)

    .config([
      '$httpProvider',
      function($httpProvider) {
        $httpProvider.interceptors.push('GistInterceptor');
      }
    ])

  ;

}());