(function() {

  /**
  * Root Controller
  */
  angular
    .module('app.root')
    .controller('RootController', [
      'ReloadService',
      RootController
    ])
  ;

  /**
   * [RootController description]
   * @param {[type]} ReloadService [description]
   */
  function RootController(ReloadService) {}

}());