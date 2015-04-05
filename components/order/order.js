(function () { 'use strict';

  angular.module('app')
    .controller('OrderController', ['ApiService', '$routeParams', OrderControllerFn]);

    function OrderControllerFn(ApiService, $routeParams) {

      this.product_count = {}; 

      var allocateProducts = angular.bind(this, function (products) {
        this.products = products.embedded.categories.map(function (category) {
          return angular.extend(category.props, { products: category.embedded.products.map(function (product) {
            return product.props;
          })});
        });
      });

      var allocateOrder = angular.bind(this, function (root) {
        this.order = $routeParams.order === 'new' ? root.embedded.tables[$routeParams.table -1][$routeParams.order] : [];
        angular.forEach(this.order, function (product) {
          incrementProduct(product.id);
        });
      });

      this.addItem = function addItem(item_id, data) {
        this.order.push({ id: item_id, data: data });
        incrementProduct(item_id);
      };

      this.removeItem = function removeItem(item_id) {
        _.pullAt(this.order, _.findIndex(this.order, function(product) {
          return product.id == item_id;
        }));
        decrementProduct(item_id);
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

      ApiService.then(fetchProducts).then(allocateOrder);

    }
})();
