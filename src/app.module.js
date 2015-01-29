(function() {

  /**
  * App main module
  *
  * Main module of app app
  */
  angular
    .module('app', [
      // Third party dependency
      'ui.router',

      // Core app dependency
      'app.routes',

      // Feature dependency
      'app.pie',
      'app.list'
    ])
  ;

}());