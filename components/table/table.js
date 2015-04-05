(function () { 'use strict';

  angular.module('app')
    .controller('TableController', ['ApiService', '$routeParams', TableControllerFn]);

    function TableControllerFn(ApiService, $routeParams) {

      var allocateTable = angular.bind(this, function (root) {
        this.table = root.embedded.tables[$routeParams.id -1];
        this.id = this.table.props.id;
        this.orders = this.table.embedded.orders;
      });

      ApiService.ready.then(allocateTable);
      
    }

})();
