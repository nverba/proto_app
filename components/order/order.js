(function () { 'use strict';

  angular.module('app')
    .controller('OrderController', ['ApiService', '$routeParams', OrderControllerFn]);

    function OrderControllerFn(ApiService, $routeParams) {

      this.product_count = {}; 

      var allocateProducts = angular.bind(this, function (resource) {

        var products = resource.embedded.products.map(function (product) {
          return product.props;
        });

        this.products = _.groupBy(products, function(product) {
          return product.category;
        });
      });

      var allocateOrder = angular.bind(this, function (root) {

        if ($routeParams.order === 'undefined') {
          this.order = [];
        } else {
          //this.order = ApiService.fetchOrder($routeParams.order);
        }

        // angular.forEach(this.order, function (product) {
        //   incrementProduct(product.id);
        // });
      });

      this.addItem = function addItem(product) {
        this.order.push(product.id);
        incrementProduct(product.id);
      };

      this.removeItem = function removeItem(item_id) {
        _.pullAt(this.order, _.findIndex(this.order, function(product) {
          return product.id == item_id;
        }));
        decrementProduct(item_id);
      };

      this.submitOrder = function updateOrder() {
        ApiService.submitOrder(this.order, $routeParams.table, $routeParams.order);
      };

      function fetchProducts(root) {
        root.links.products.fetch().then(allocateProducts);
        return root;
      }

      var incrementProduct = angular.bind(this, function (product_id) {
        this.product_count[product_id] = this.product_count[product_id] ? this.product_count[product_id] + 1 : 1;
      });

      var decrementProduct = angular.bind(this, function (product_id) {
        this.product_count[product_id] = this.product_count[product_id] ? this.product_count[product_id] - 1 : 0;
      });

      ApiService.load().then(fetchProducts).then(allocateOrder);

    }
})();
