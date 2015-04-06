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