(function() {

  /**
  * Pie Controller
  */
  angular
    .module('app.pie')
    .controller('PieController', [
      PieController
    ])
  ;

  /**
   * [PieController description]
   */
  function PieController() {

    var vm = this;

    vm.files = [
      {
        label: 'JSON',
        count: 10
      },
      {
        label: 'HTML',
        count: 4
      },
      {
        label: 'CSS',
        count: 12
      },
      {
        label: 'JavaScript',
        count: 7
      },
      {
        label: 'PHP',
        count: 3
      }
    ];

  }

}());