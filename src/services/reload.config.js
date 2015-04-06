(function() {

  /**
  * Reload service
  *
  * Service for reload data
  * automaticly
  */
  angular
    .module('reload.service')
    .constant('RELOAD', {
      INTERVAL_TIME: 60000,
      EVENTS: {
        FILES: 'reload:files',
        STATS: 'reload:stats',
        TIMER: 'reload:timer'
      }
    })
  ;

}());