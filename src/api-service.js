(function () { 'use strict';

  angular.module('app')
    .factory('ApiService', ['$http', '$q', '$router', apiServiceFn]);

  function apiServiceFn($http, $q, $router) {

    // Use Angular $q for Hyperagent promises

    Hyperagent.configure('defer', $q.defer);

    Hyperagent.configure('_', _);

    // Wrap $http in an adapter Fn for Hyperagent compatability
    // making service mockable/testable

    Hyperagent.configure('ajax', function(options) {
      return $http(options).then(function(resp) {
        return options.success(JSON.stringify(resp.data)); // restringify data - Fork Hyperdata to handle this natively
      })["catch"](options.error);
    });

    var api = new Hyperagent.Resource('/api/');

    // return the api resource

    var load = function loadApi() {
      return api.fetch({force: true}).then(function (root) {
        return root;
      }, function (err) {
        console.warn('Error fetching API root', err);
      });
    };

    var submitOrder = function (order, table_id, order_id) {
      if (order_id === "undefined") {
        $http.post('/api/orders', { table: table_id, order: order })
          .success(function() {
            $router.navigate('/');
          });
      } else {
        console.log('http put');
      }
    };

    return {
      load: load,
      submitOrder: submitOrder
    };

    
  }

})();
