(function () { 'use strict';

  angular.module('app')
    .controller('OrderController', ['ApiService', '$routeParams', OrderControllerFn]);

    function OrderControllerFn(ApiService, $routeParams) {

      var allocateProducts = angular.bind(this, function (products) {
        this.products = products.embedded.categories.map(function (category) {
          return angular.extend(category.props, { products: category.embedded.products.map(function (product) {
            return product.props;
          })});
        });
      });

      var allocateOrder = angular.bind(this, function (root) {
        this.order = $routeParams.order ? root.embedded.tables[$routeParams.table -1][$routeParams.order] : [];
      });

      function fetchProducts(root) {
        root.links.products.fetch().then(allocateProducts);
        return root;
      }

      ApiService.then(fetchProducts).then(allocateOrder);

      $('.accordion-toggle button').click(function(e){
        e.preventDefault();
        e.stopPropagation();
      });

    }
})();
