(function() {

  /**
  * Config Module
  */
  angular
    .module('app.config', [])

    .constant('API', {
      ENDPOINT: 'https://api.github.com'
    })

  ;

}());