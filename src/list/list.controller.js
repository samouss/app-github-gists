(function() {

  /**
  * List Controller
  */
  angular
    .module('app.list')
    .controller('ListController', [
      'REGEX',
      'RELOAD',
      '$scope',
      'files',
      ListController
    ])
  ;

  /**
   * List controller
   * @param {constant} REGEX
   * @param {constant} RELOAD
   * @param {$scope}   $scope
   * @param {object}   files
   */
  function ListController(REGEX, RELOAD, $scope, files) {

    var vm = this;

    vm.files = files;

    vm.regex = REGEX.PATTERN;
    vm.pattern = '';
    vm.field = 'filename';

    $scope.$on(RELOAD.EVENTS.FILES, onFilesReload);

    /**
     * Update files on event
     * @param  {event} event
     * @param  {array} files
     * @return {void}
     */
    function onFilesReload(event, files) {
      vm.files = files;
    }

  }

}());