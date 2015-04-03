(function () { 'use strict';

  angular.module('app')
    .factory('ApiService', ['$http', '$q', apiServiceFn]);

  function apiServiceFn($http, $q) {

    Hyperagent.configure('defer', $q.defer);

    // Wrap an adapter Fn that allows Hyperagent to use $http
    // making service mockable/testable

    Hyperagent.configure('ajax', function(options) {
      return $http(options).then(function(resp) {
        return options.success(JSON.stringify(resp.data)); // restringify data - Fork Hyperdata to handle this natively
      })["catch"](options.error);
    });

    // Use Angular $q for Hyperagent promises

    var api = new Hyperagent.Resource('/api/');

    // return the api resource

    return api.fetch().then(function (root) {
      return root;
    }, function (err) {
      console.warn('Error fetching API root', err);
    });

    
  }

})();
