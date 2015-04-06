(function() {

  /**
  * Config Module
  */
  angular
    .module('app.config', [])

    .constant('API', {
      ENDPOINT: 'https://api.github.com',
      // Edit this line for provide an ACCESS_TOKEN
      ACCESS_TOKEN: null
    })

    .constant('GISTS', {
      PER_PAGE: 100
    })

    .constant('d3', d3)

    .config([
      '$httpProvider',
      function($httpProvider) {
        $httpProvider.interceptors.push('GistInterceptor');
      }
    ])

  ;

}());
(function() {

  /**
  * Components Module
  */
  angular
    .module('app.components', [
      // Filters
      'regex.filter',

      // Directives
      'pie-chart.directive'
    ])
  ;

}());
(function() {

  /**
  * Pie chart directive module
  */
  angular
    .module('pie-chart.directive', [])
  ;

}());
(function() {

  /**
  * Regex filter module
  */
  angular
    .module('regex.filter', [
    ])
  ;

}());
(function() {

  /**
  * Header Module
  */
  angular
    .module('app.header', [
    ])
  ;

}());
(function() {

  /**
  * List Module
  */
  angular
    .module('app.list', [])
  ;

}());
(function() {

  /**
  * Pie Module
  */
  angular
    .module('app.pie', [])
  ;

}());
(function() {

  /**
  * Root Module
  */
  angular
    .module('app.root', [
    ])
  ;

}());
(function() {

  /**
  * Data service
  *
  * Service for make request
  * to api
  */
  angular
    .module('data.service', [
    ])
  ;

}());
(function() {

  /**
  * Interceptor module
  */
  angular
    .module('interceptor.factory', [
    ])
  ;

}());
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
  ;

}());
(function() {

  /**
  * Services Module
  */
  angular
    .module('app.services', [
      'data.service',
      'reload.service',

      'interceptor.factory'
    ])
  ;

}());
(function() {

  /**
  * Pie chart directive module
  */
  angular
    .module('pie-chart.directive')
    .directive('pieChart', [
      'd3',
      PieChart
    ])
  ;

  /**
   * [PieChart description]
   * @param {[type]} d3 [description]
   */
  function PieChart(d3) {
    return {
      scope: {
        data: '='
      },
      restrict: 'E',
      template: '<div id="chart"></div>',
      link: function($scope, iElm, iAttrs, controller) {
        var width = 900,
            height = 360,
            innerRadius = 75,
            outerRadius = Math.min(width, height) / 2,
            color = d3.scale.category20c(),
            legendThumbSize = 18,
            legendHeightSpacing = 4,
            legendWidthSpacing = 175,
            legendMaxColumn = 10
        ;

        $scope.$watch('data', onData);

        /**
         * On data handler
         * @param  {array} newData
         * @return {void}
         */
        function onData(newData) {
          var tmp = [];

          $scope.data = newData;

          $scope.data
            .sort(function(a, b) {
              return b.count - a.count;
            })
            .forEach(function(data) {
              tmp.push(data.language);
            })
          ;
          color.domain(tmp);

          updatePath();
          updateLegend();
          addTooltip();
        }

        var svg = d3
          .select('#chart')
          .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
              .attr('transform', 'translate(' + (height / 2) + ',' + (height / 2) + ')')
        ;

        var arc = d3.svg.arc()
          .innerRadius(outerRadius - innerRadius)
          .outerRadius(outerRadius)
        ;

        var pie = d3.layout.pie()
          .value(function(d) { return d.count; })
          .sort(null)
        ;

        var path = svg.selectAll('path');

        /**
         * Update path method
         */
        function updatePath() {

          path = path
            .data(pie($scope.data))
          ;

          path
            .enter()
            .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                return color(d.data.language);
              })
              .each(function(d) {
                this.currentValue = d;
              })
          ;

          path
            .exit()
            .transition()
            .duration(750)
            .attrTween("d", arcTween)
            .remove()
          ;

          path
            .transition()
            .duration(750)
            .attrTween("d", arcTween)
          ;

        }

        /**
         * Tween method for animate arc
         * @param  {object} d
         * @return {void}
         */
        function arcTween(d) {
          var interpolate = d3.interpolate(this.currentValue, d);
          this.currentValue = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        }

        /**
         * Legend
         */

        var legend = svg.selectAll('.legend');

        /**
         * Update legend method
         */
        function updateLegend() {

          legend = legend
            .data(color.domain())
          ;

          var wrapper = legend
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var currentHeight = legendThumbSize + legendHeightSpacing,
                  offset = currentHeight * legendMaxColumn / 2,
                  x = ((height / 2) + (height / 6)) + (legendWidthSpacing * Math.floor(i / legendMaxColumn)),
                  y = (i - (Math.floor(i / legendMaxColumn) * legendMaxColumn))  * currentHeight - offset
              ;

              return 'translate(' + x + ',' + y + ')';
            })
          ;

          wrapper
            .append('rect')
            .attr('width', legendThumbSize)
            .attr('height', legendThumbSize)
            .style('fill', color)
            .style('stroke', color)
          ;

          wrapper
            .append('text')
            .attr('x', legendThumbSize + legendHeightSpacing)
            .attr('y', legendThumbSize - legendHeightSpacing)
            .text(function(d) { return d; })
          ;

          legend
            .exit()
            .remove()
          ;

          legend
            .select('rect')
            .style('fill', color)
            .style('stroke', color)
          ;

          legend
            .select('text')
            .text(function(d) { return d; })
          ;

        }

        /**
         * Tooltip
         */

        var tooltip = d3
          .select('#chart')
          .append('div')
            .attr('class', 'info-pie')
        ;

        tooltip
          .append('div')
            .attr('class', 'pie-label')
        ;

        tooltip
          .append('div')
            .attr('class', 'stats')
            .append('span')
              .attr('class', 'pie-percent')
        ;

        tooltip
          .select('.stats')
            .append('span')
            .attr('class', 'pie-count')
        ;

        /**
         * Add event for tooltip
         */
        function addTooltip() {
          path.on('mouseover', function(d) {
            var el = this,
                elChart = document.getElementById('chart')
            ;

            var total = d3.sum($scope.data.map(function(d) { return d.count; }));
            tooltip.select('.pie-label').html(d.data.language);
            tooltip.select('.pie-percent').html(Math.round(((100 * d.data.count) / total)) + '%');
            tooltip.select('.pie-count').html('(' + d.data.count + ')');

            tooltip
              .style('display', 'block')
              .style('left', ((el.getBoundingClientRect().left - elChart.getBoundingClientRect().left) + (el.getBoundingClientRect().width / 2)) - (document.querySelector('.info-pie').getBoundingClientRect().width / 2) + 'px')
              .style('top', ((el.getBoundingClientRect().top - elChart.getBoundingClientRect().top) + (el.getBoundingClientRect().height / 2)) - (document.querySelector('.info-pie').getBoundingClientRect().height / 2) + 'px')
            ;

          });

          path.on('mouseout', function() {
            tooltip
              .style('display', 'none')
            ;
          });
        }

      }
    };
  }

}());
(function() {

  /**
  * Regex config
  */
  angular
    .module('regex.filter')
    .constant('REGEX', {
      PATTERN: '##PATTERN##'
    })
  ;

}());
(function() {

  /**
  * Regex filter module
  *
  * Filter match to specific
  * regex given
  */
  angular
    .module('regex.filter')
    .filter('regex', [
      'REGEX',
      Regex
    ])
  ;

  /**
   * Regex filter function
   * @param  {constant} REGEX
   * @return {array}
   */
  function Regex(REGEX) {
    return function(input, params) {
      var output = input;
          regex = new RegExp(params.regex.replace(REGEX.PATTERN, params.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), 'gi');

      if (params.pattern !== '') {
        output = [];
        input.forEach(function(file) {
          if (regex.test(file[params.field])) {
            output.push(file);
          }
        });
      }

      return output;
    };
  }

}());
(function() {

  /**
  * Root Controller
  */
  angular
    .module('app.header')
    .controller('HeaderController', [
      'RELOAD',
      '$scope',
      HeaderController
    ])
  ;

  /**
   * Header controller
   * @param {constant} RELOAD
   * @param {$scope}   $scope
   */
  function HeaderController(RELOAD, $scope) {

    var vm = this;

    vm.countdown = RELOAD.INTERVAL_TIME / 1000;

    $scope.$on(RELOAD.EVENTS.TIMER, function(event, countdown) {
      vm.countdown = countdown;
    });

  }

}());
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
(function() {

  /**
  * Pie Controller
  */
  angular
    .module('app.pie')
    .controller('PieController', [
      'RELOAD',
      '$scope',
      'stats',
      PieController
    ])
  ;

  function PieController(RELOAD, $scope, stats) {

    var vm = this;

    vm.stats = stats;

    $scope.$on(RELOAD.EVENTS.STATS, onReloadStats);

    /**
     * Reload stat on event
     * @param  {event} event
     * @param  {array} stats
     * @return {void}
     */
    function onReloadStats(event, stats) {
      vm.stats = stats;
    }

  }

}());
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
  function RootController(ReloadService) {
    ReloadService.init();
  }

}());
(function() {

  /**
  * Data service
  *
  * Service for make request
  * to api
  */
  angular
    .module('data.service')
    .service('DataService', [
      'API',
      'GISTS',
      '$http',
      '$q',
      DataService
    ])
  ;

  /**
   * [DataService description]
   * @param {[type]} API   [description]
   * @param {[type]} $http [description]
   * @param {[type]} $q    [description]
   */
  function DataService(API, GISTS, $http, $q) {

    var vm = this;

    vm.getGists = getGists;
    vm.getListFiles = getListFiles;
    vm.getStatFiles = getStatFiles;

    /**
     * Get last 100 gists
     *
     * Method: GET
     * URL: /gists/public?per_page={GISTS.PER_PAGE}
     *
     * @param  {integer} page
     * @return {promise}
     */
    function getGists(page) {
      var defer = $q.defer(),
          _page = page || 1;

      $http
        .get(
          API.ENDPOINT + '/gists/public?per_page=' + GISTS.PER_PAGE + '&page=' + _page,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
        .success(function(data, status) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          if (status === 403) {
            alert(data.message);
          }
          defer.reject(data);
        })
      ;

      return defer.promise;
    }

    /**
     * Get list files for list view
     * @param  {array} gists
     * @return {array}
     */
    function getListFiles(gists) {
      var files = [];

      gists.forEach(function(gist) {
        Object.keys(gist.files).forEach(function(i) {
          if (gist.owner) {
            this[i].login = gist.owner.login;
            this[i].avatar_url = gist.owner.avatar_url;
          }
          files.push(this[i]);
        }, gist.files);
      });

      return files;
    }

    /**
     * Get stats files for pie view
     * @param  {array} gists
     * @return {array}
     */
    function getStatFiles(gists) {
      var stats = [];

      gists.forEach(function(gist) {
        Object.keys(gist.files).forEach(function(i) {
          var self = this,
              index = null;

          stats.some(function(item, _index) {
            if ((self[i].language || '-') === item.language) {
              index = _index;
              return true;
            }
          });

          if (index !== null) {
            stats[index].count++;
          } else {
            stats.push({
              language: (self[i].language || '-'),
              count: 1
            });
          }
        }, gist.files);
      });

      return stats;
    }

  }

}());
(function() {

  /**
  * Interceptor factory
  */
  angular
    .module('interceptor.factory')
    .factory('GistInterceptor', [
      'API',
      '$q',
      GistInterceptor
    ])
  ;

  /**
   * GistInterceptor
   * @param {constant} API
   * @param {$q}       $q
   */
  function GistInterceptor(API, $q) {

    var vm = this;

    vm.request = request;
    vm.responseError = responseError;

    return vm;

    /**
     * Request interceptor
     * @param  {object} config Object config for request
     * @return {object}
     */
    function request(config) {

      if (API.ACCESS_TOKEN !== null) {
        config.headers.Authorization = 'token ' + API.ACCESS_TOKEN;
      }

      return config;
    }

    /**
     * Response error interceptor
     * @param  {object} rejection
     * @return {promise}
     */
    function responseError(rejection) {

      if (rejection.status === 401) {
        alert(rejection.data.message + ' update your token !');
      }

      return $q.reject(rejection);
    }

  }

}());
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
    .service('ReloadService', [
      'RELOAD',
      '$interval',
      '$timeout',
      '$rootScope',
      'DataService',
      ReloadService
    ])
  ;

  /**
   * Reload service
   * @param {constant}    RELOAD
   * @param {$interval}   $interval
   * @param {$timeout}    $timeout
   * @param {$rootScope}  $rootScope
   * @param {DataService} DataService
   */
  function ReloadService(RELOAD, $interval, $timeout, $rootScope, DataService) {

    var vm = this,
        countdown = RELOAD.INTERVAL_TIME / 1000;

    vm.init = init;

    /**
     * Init method for trigger interval
     * @return {void}
     */
    function init() {
      $interval(timerCallback, 1000);
      $timeout(function() {
        $interval(reloadCallback, RELOAD.INTERVAL_TIME);
      }, 1000);
    }

    /**
     * Timer callback method
     * @return {void}
     */
    function timerCallback() {
      $rootScope.$broadcast(RELOAD.EVENTS.TIMER, countdown--);
    }

    /**
     * Reload callback method
     * @return {void}
     */
    function reloadCallback() {
      countdown = RELOAD.INTERVAL_TIME / 1000;
      DataService
        .getGists()
        .then(function(data) {

          $rootScope.$broadcast(RELOAD.EVENTS.FILES, DataService.getListFiles(data));

          $rootScope.$broadcast(RELOAD.EVENTS.STATS, DataService.getStatFiles(data));

        })
      ;
    }

  }

}());
(function() {

  /**
  * App main module
  *
  * Main module of app app
  */
  angular
    .module('app', [
      // Third party dependency
      'ui.router',

      // Core app dependency
      'app.config',
      'app.routes',
      'app.services',
      'app.components',

      // Feature dependency
      'app.header',
      'app.root',
      'app.pie',
      'app.list'
    ])
  ;

}());
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