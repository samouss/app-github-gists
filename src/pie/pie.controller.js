(function() {

  /**
  * Pie Controller
  */
  angular
    .module('app.pie')
    .controller('PieController', [
      'stats',
      PieController
    ])
  ;

  /**
   * [PieController description]
   */
  function PieController(stats) {

    var vm = this;

    vm.stats = stats;

  }

}());