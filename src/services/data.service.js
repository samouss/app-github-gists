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

    vm.getGistsFiles = getGistsFiles;

    /**
     * Get lest 100 gists - Method: GET - URL: /gists/public
     * @return {promise} [description]
     */
    function getGistsFiles() {
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
          var files = [];

          console.log(data.length);
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