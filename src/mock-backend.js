(function () { 'use strict';

  var HAL_JSON = {};

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    $httpBackend.when('GET', '/api')
      .respond(JSON.stringify(HAL_JSON.root));

    $httpBackend.when('GET', '/api/products')
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
      "products": { "href": "products" }
    },
    "_embedded": {
      "tables": []
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
            "self": { "href": "/api/products/categories/starters" }
          },
          "name": "Starters",
          "_embedded": [
            {
              "_links": {
                "self": { "href": "/api/products/categories/starters/pate" }
              },
              "name": "Pate",
              "current_price": 3.2
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/starters/greek_salad" }
              },
              "name": "Greek salad",
              "current_price": 2.7
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/starters/fish_sticks" }
              },
              "name": "Fish sticks",
              "current_price": 3
            }
          ]
        },
        {
          "_links": {
            "self": { "href": "/api/products/categories/mains" }
          },
          "name": "Mains",
          "_embedded": [
            {
              "_links": {
                "self": { "href": "/api/products/categories/mains/classic_burger" }
              },
              "name": "Classic burger",
              "current_price": 3.2
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/mains/steak" }
              },
              "name": "steak",
              "current_price": 2.7
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/mains/mackrel" }
              },
              "name": "Mackrel",
              "current_price": 3
            }
          ]
        },
        {
          "_links": {
            "self": { "href": "/api/products/categories/deserts" }            
          },
          "name": "Deserts",
          "_embedded": [
            {
              "_links": {
                "self": { "href": "/api/products/categories/deserts/posset" }
              },
              "name": "Posset",
              "current_price": 3.2
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/deserts/cheesecake" }
              },
              "name": "Cheesecake",
              "current_price": 2.7
            },
            {
              "_links": {
                "self": { "href": "/api/products/categories/deserts/chocolate_cake" }
              },
              "name": "Chocolate cake",
              "current_price": 3
            }
          ]
        }
      ]
    }
  };

})();


