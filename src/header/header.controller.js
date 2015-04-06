(function() {

  /**
  * Root Controller
  */
  angular
    .module('app.header')
    .controller('HeaderController', [
      'RELOAD',
      '$scope',
      HeaderController
    ])
  ;

  /**
   * Header controller
   * @param {constant} RELOAD
   * @param {$scope}   $scope
   */
  function HeaderController(RELOAD, $scope) {

    var vm = this;

    vm.countdown = RELOAD.INTERVAL_TIME / 1000;

    $scope.$on(RELOAD.EVENTS.TIMER, function(event, countdown) {
      vm.countdown = countdown;
    });

  }

}());