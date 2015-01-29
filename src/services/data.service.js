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
  function DataService(API, $http, $q) {

    var vm = this;

    vm.getGists = getGists;

    /**
     * Get lest 100 gists - Method: GET - URL: /gists/public
     * @return {promise} [description]
     */
    function getGists() {
      var defer = $q.defer();

      $http
        .get(
          API.ENDPOINT + '/gists/public',
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
          defer.reject(data);
        })
      ;

      return defer.promise;
    }

  }

}());