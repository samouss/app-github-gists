(function() {

  /**
  * List Controller
  */
  angular
    .module('app.list')
    .controller('ListController', [
      'files',
      ListController
    ])
  ;

  /**
   * [ListController description]
   */
  function ListController(files) {
    console.log(files);
  }

}());