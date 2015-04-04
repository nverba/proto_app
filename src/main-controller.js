(function () { 'use strict';

  angular.module('app')
    .controller('MainController', ['$router', 'ApiService', MainControllerFn]);

  function MainControllerFn($router, ApiService) {

    $router.config([
      { path: '/', component: 'tables' },
      { path: 'table/:id', component: 'table' },
      { path: '/order/:table/:order', component: 'order' }
    ]);
  }

})();
