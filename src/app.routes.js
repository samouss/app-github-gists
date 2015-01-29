(function() {

  /**
  * Routes Module
  */
  angular
    .module('app.routes', [])

    .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {

        $stateProvider

          .state('root', {
            url: '/',
            views: {
              'list': {
                templateUrl: 'list/list.template.html',
                controller: 'ListController',
                controllerAs: 'vm'
              },
              'pie': {
                templateUrl: 'pie/pie.template.html',
                controller: 'PieController',
                controllerAs: 'vm'
              }
            },
            resolve: [
              function() {
                return [];
              }
            ]
          })

        ;

        $urlRouterProvider
          .otherwise(function($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('root');
          })
        ;

      }
    ])
  ;

}());