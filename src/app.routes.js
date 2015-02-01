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
            views: {
              'container': {
                templateUrl: 'root/root.template.html',
                controller: 'RootController'
              },
              'header': {
                templateUrl: 'header/header.template.html',
                controller: 'HeaderController',
                controllerAs: 'vm'
              }
            },
            resolve: {
              gists: [
                'DataService',
                function(DataService) {
                  return DataService.getGists();
                }
              ]
            }
         })

         .state('root.index', {
            url: '/',
            views: {
              'list': {
                templateUrl: 'list/list.template.html',
                controller: 'ListController',
                controllerAs: 'vm',
                resolve: {
                  files: [
                    'gists',
                    'DataService',
                    function(gists, DataService) {
                      return DataService.getListFiles(gists);
                    }
                  ]
                }
              },
              'pie': {
                templateUrl: 'pie/pie.template.html',
                controller: 'PieController',
                controllerAs: 'vm',
                resolve: {
                  stats: [
                    'gists',
                    'DataService',
                    function(gists, DataService) {
                      return DataService.getStatFiles(gists);
                    }
                  ]
                }
              }
            }
          })

        ;

        $urlRouterProvider
          .otherwise(function($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('root.index');
          })
        ;

      }
    ])
  ;

}());