(function() {

  /**
  * Components Module
  */
  angular
    .module('app.components', [
      // Filters
      'regex.filter',

      // Directives
      'pie-chart.directive'
    ])
  ;

}());