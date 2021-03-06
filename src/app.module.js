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
      'app.config',
      'app.routes',
      'app.services',
      'app.components',

      // Feature dependency
      'app.header',
      'app.root',
      'app.pie',
      'app.list'
    ])
  ;

}());