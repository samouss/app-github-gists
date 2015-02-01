(function() {

  /**
  * Reload service
  *
  * Service for reload data
  * automaticly
  */
  angular
    .module('reload.service', [
    ])
    .constant('RELOAD', {
      INTERVAL_TIME: 30000,
      EVENTS: {
        FILES: 'reload:files',
        STATS: 'reload:stats',
        TIMER: 'reload:timer'
      }
    })
    .service('ReloadService', [
      'RELOAD',
      '$interval',
      '$timeout',
      '$rootScope',
      'DataService',
      ReloadService
    ])
  ;

  /**
   * Reload service
   * @param {constant}    RELOAD
   * @param {$interval}   $interval
   * @param {$timeout}    $timeout
   * @param {$rootScope}  $rootScope
   * @param {DataService} DataService
   */
  function ReloadService(RELOAD, $interval, $timeout, $rootScope, DataService) {

    var vm = this,
        countdown = RELOAD.INTERVAL_TIME / 1000;

    vm.init = init;

    /**
     * Init method for trigger interval
     * @return {void}
     */
    function init() {
      $interval(timerCallback, 1000);
      $timeout(function() {
        $interval(reloadCallback, RELOAD.INTERVAL_TIME);
      }, 1000);
    }

    /**
     * Timer callback method
     * @return {void}
     */
    function timerCallback() {
      $rootScope.$broadcast(RELOAD.EVENTS.TIMER, countdown--);
    }

    /**
     * Reload callback method
     * @return {void}
     */
    function reloadCallback() {
      countdown = RELOAD.INTERVAL_TIME / 1000;
      DataService
        .getGists()
        .then(function(data) {

          $rootScope.$broadcast(RELOAD.EVENTS.FILES, DataService.getListFiles(data));

          $rootScope.$broadcast(RELOAD.EVENTS.STATS, DataService.getStatFiles(data));

        })
      ;
    }

  }

}());