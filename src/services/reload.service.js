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
      }
    })
    .service('ReloadService', [
      'RELOAD',
      '$interval',
      '$rootScope',
      'DataService',
      ReloadService
    ])
  ;

  function ReloadService(RELOAD, $interval, $rootScope, DataService) {
    console.log('init interval');
    $interval(function() {
      console.log('reload');
      DataService
        .getGists()
        .then(function(data) {

          $rootScope.$broadcast(RELOAD.EVENTS.FILES, DataService.getListFiles(data));

          $rootScope.$broadcast(RELOAD.EVENTS.STATS, DataService.getStatFiles(data));

        })
      ;

    }, RELOAD.INTERVAL_TIME);

  }

}());