(function() {

  /**
  * List Controller
  */
  angular
    .module('app.list')
    .controller('ListController', [
      'REGEX',
      'files',
      ListController
    ])
  ;

  /**
   * List controller
   * @param {constant} REGEX
   * @param {object}   files
   */
  function ListController(REGEX, files) {

    var vm = this;

    vm.files = files;

    vm.regex = REGEX.PATTERN;
    vm.pattern = '';
    vm.field = 'filename';

  }

}());