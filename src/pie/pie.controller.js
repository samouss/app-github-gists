(function() {

  /**
  * Pie Controller
  */
  angular
    .module('app.pie')
    .controller('PieController', [
      'RELOAD',
      '$scope',
      'stats',
      PieController
    ])
  ;

  function PieController(RELOAD, $scope, stats) {

    var vm = this;

    vm.stats = stats;

    $scope.$on(RELOAD.EVENTS.STATS, onReloadStats);

    /**
     * Reload stat on event
     * @param  {event} event
     * @param  {array} stats
     * @return {void}
     */
    function onReloadStats(event, stats) {
      vm.stats = stats;
    }

  }

}());