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

    var vm = this;

    vm.files = files;

    vm.regex = '##PATTERN##';
    vm.pattern = '';

  }

}());