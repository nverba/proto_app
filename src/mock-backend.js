(function () { 'use strict';

  var HAL_JSON = {};

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    $httpBackend.when('GET', '/api/')
      .respond(JSON.stringify(HAL_JSON.root));

    $httpBackend.when('GET', '/api/products/')
      .respond(JSON.stringify(HAL_JSON.products));

    // resolve template requests normally.

    $httpBackend.whenGET(/components/).passThrough();

  }

  function generateTables(hal, tables) {

    for (var i=1; i <= tables; i++) {

      hal._embedded.tables.push({
        "_links": {
          "self": { "href": "api/tables/" + i }
        },
        "id": i,
        "reserved": [],
        "_embedded": {
          "orders": []
        }
      });
    }
  }

  HAL_JSON.root = {

    "_links": {
      "self": { "href": "/api/" },
      "products": { "href": "/api/products/" }
    },
    "_embedded": {
      "tables": [],
      "menu": {
        "_links": {
          "self": { "href": "api/menu" }
        }
      }
    }
  };

  // push any number of tables to root
  generateTables(HAL_JSON.root, 34);

  HAL_JSON.products = {

    "_links": {
      "self": { "href": "/api/products/" }
    },
    "_embedded": {
      "categories": [
        {
          "_links": {
            "self": { "href": "/api/products/categories/starters" },
            "name": "Starters"
            
          }  
        },
        {
          "_links": {
            "self": { "href": "/api/products/categories/mains" },
            "name": "Mains"
            
          }  
        },
        {
          "_links": {
            "self": { "href": "/api/products/categories/deserts" },
            "name": "Deserts"
            
          }  
        }
      ]
    }
  };

})();


