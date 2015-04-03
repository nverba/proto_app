(function () { 'use strict';

  angular.module('app')
    .controller('TablesController', ['ApiService', TablesControllerFn]);

    function TablesControllerFn(ApiService) {

      var allocateTables = angular.bind(this, function (root) {
        this.tables = root.embedded.tables.map(function (table) {
          return table.props;
        });
      });

      ApiService.then(allocateTables);

    }
})();
