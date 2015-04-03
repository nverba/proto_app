(function () { 'use strict';

  angular.module('app')
    .factory('ApiService', ['$http', '$q', apiServiceFn]);

  function apiServiceFn($http, $q) {

    // Use Angular $q for Hyperagent promises

    Hyperagent.configure('defer', $q.defer);

    // Wrap $http in an adapter Fn for Hyperagent compatability
    // making service mockable/testable

    Hyperagent.configure('ajax', function(options) {
      return $http(options).then(function(resp) {
        return options.success(JSON.stringify(resp.data)); // restringify data - Fork Hyperdata to handle this natively
      })["catch"](options.error);
    });

    var api = new Hyperagent.Resource('/api/');

    // return the api resource

    return api.fetch().then(function (root) {
      return root;
    }, function (err) {
      console.warn('Error fetching API root', err);
    });

    
  }

})();
