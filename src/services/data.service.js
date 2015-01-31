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