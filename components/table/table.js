(function () { 'use strict';

  angular.module('app')
    .controller('TableController', ['ApiService', '$routeParams', TableControllerFn]);

    function TableControllerFn(ApiService, $routeParams) {

      this.payOrder = function (id, final_ammount) {
        ApiService.payOrder(id, final_ammount);
      };

      var allocateTable = angular.bind(this, function (root) {
        this.table = root.embedded.tables[$routeParams.id -1];
        this.id = this.table.props.id;
        return root;
      });

      var fetchOrders = angular.bind(this, function (response) {

        var orders = response.embedded.table_orders.map(function (order) {
          return order.props;
        });

        this.orders = _.filter(orders, function (order) {
          return order.table_id == this.id;
        }, this);
      });

      function getOpenOrders(root) {
        root.links.table_orders.fetch({force: true}).then(fetchOrders);
      }

      ApiService.load().then(allocateTable).then(getOpenOrders);
      
    }

})();
