(function() {

  /**
  * Regex filter module
  *
  * Filter match to specific
  * regex given
  */
  angular
    .module('regex.filter', [
    ])
    .constant('REGEX', {
      PATTERN: '##PATTERN##'
    })
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