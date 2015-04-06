(function () { 'use strict';

  angular.module('app')
    .controller('TablesController', ['ApiService', TablesControllerFn]);

    function TablesControllerFn(ApiService) {

      var allocateTables = angular.bind(this, function (root) {
        this.tables = root.embedded.tables.map(function (table) {
          return table.props;
        });
        return root;
      });

      var matchOrders = angular.bind(this, function (orders) {

        this.active = {};
        // decorate active object with active table id's
        angular.forEach(orders.embedded.table_orders, function (order) {
          this.active[order.props.table_id] = true;
        }, this);
      });

      function getOpenOrders(root) {
        root.links.table_orders.fetch({force: true}).then(matchOrders);
      }

      ApiService.load().then(allocateTables).then(getOpenOrders);

    }
})();
