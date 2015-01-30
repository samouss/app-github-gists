(function() {

  /**
  * Data service
  *
  * Service for make request
  * to api
  */
  angular
    .module('app.services')
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

    vm.getGistsFiles = getGistsFiles;

    /**
     * Get lest 100 gists
     *
     * Method: GET
     * URL: /gists/public?per_page={GISTS.PER_PAGE}
     *
     * @param  {integer} page
     * @return {promise}
     */
    function getGistsFiles(page) {
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
          var files = [];

          data.forEach(function(gists) {
            for (var i in gists.files) {
              files.push(gists.files[i]);
            }
          });

          defer.resolve(files);
        })
        .error(function(data, status) {
          defer.reject(data);
        })
      ;

      return defer.promise;
    }

  }

}());