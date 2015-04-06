(function () { 'use strict';

  angular.module('app')
    .factory('ApiService', ['$http', '$q', '$router', apiServiceFn]);

  function apiServiceFn($http, $q, $router) {

    // Use Angular $q for Hyperagent promises

    Hyperagent.configure('defer', $q.defer);

    // use lodash

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
        $http.post('/api/table_orders/', { table_id: table_id, order: order })
          .success(function() {
            $router.navigate('/');
          });
      } else {
        console.log('http put');
      }
    };

    var payOrder = function (order_id, final_ammount) {

      $http.post('/api/paid_orders/', { table_order_id: order_id, final_ammount: final_ammount })
        .success(function() {
          $router.navigate('/');
        });
    };

    function fetchOrder(id) {

      // to-do: fetch order by id with populated embedded products

      // return load().then(function (root) {
      //   return root.links.orders.fetch({force: true}).then(function (orders) {
      //     return _.find(orders.embedded.orders, function(order) {
      //       return id == order.props.id;
      //     });
      //   });
      // });
    }

    return {
      load: load,
      submitOrder: submitOrder,
      payOrder: payOrder,
      fetchOrder: fetchOrder
    };

    
  }

})();
