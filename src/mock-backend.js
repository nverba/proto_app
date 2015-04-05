(function () { 'use strict';

  var HAL_JSON = {
    orders: {
      "_links": {
        "self": { "href": "/api/orders" }
      }
    } 
  };

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    $httpBackend.when('GET', '/api')
      .respond(JSON.stringify(HAL_JSON.root));

    $httpBackend.when('GET', '/api/products')
      .respond(JSON.stringify(HAL_JSON.products));

    $httpBackend.whenPOST('/orders').respond(function(method, url, json_data) {
      
      var data = JSON.parse(json_data);
      var stamp = new Date().getTime();  // lets use this for time & pseudo ID for dev



      var ref =  {

        "_links": {
          "self": { "href": "api/orders/" + stamp }
        },
        created_at: stamp,
        id: stamp
      };

      var order = angular.extend(ref, {
        "_embedded": {
          "products": data.order.map(function (product) {
            
          })
        }
      });

      // Embed order ref in tables (root)
      HAL_JSON.root._embedded.tables[ data.table -1 ]._embedded.orders.push(ref);

      // Insert full order + embedded resources in orders
      HAL_JSON.orders[stamp] = order;

      return [200];
    });

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
    "_embedded": [

      {
        "_links": {
          "self": { "href": "/api/products/111" }
        },
        "name": "Pate",
        "id": "111",
        "category": "Starters",
        "current_price": 3.2
      },
      {
        "_links": {
          "self": { "href": "/api/products/112" }
        },
        "name": "Greek salad",
        "id": "112",
        "category": "Starters",
        "current_price": 2.7
      },
      {
        "_links": {
          "self": { "href": "/api/products/113" }
        },
        "name": "Fish sticks",
        "id": "113",
        "category": "Starters",
        "current_price": 3
      },
      {
        "_links": {
          "self": { "href": "/api/products/121" }
        },
        "name": "Classic burger",
        "id": "121",
        "category": "Mains",
        "current_price": 3.2
      },
      {
        "_links": {
          "self": { "href": "/api/products/122" }
        },
        "name": "steak",
        "id": "122",
        "category": "Mains",
        "current_price": 2.7
      },
      {
        "_links": {
          "self": { "href": "/api/products/123" }
        },
        "name": "Mackrel",
        "id": "123",
        "category": "Mains",
        "current_price": 3
      },
      {
        "_links": {
          "self": { "href": "/api/products/131" }
        },
        "name": "Posset",
        "id": "131",
        "category": "Deserts",
        "current_price": 3.2
      },
      {
        "_links": {
          "self": { "href": "/api/products/132" }
        },
        "name": "Cheesecake",
        "id": "132",
        "category": "Deserts",
        "current_price": 2.7
      },
      {
        "_links": {
          "self": { "href": "/api/products/133" }
        },
        "name": "Chocolate cake",
        "id": "133",
        "category": "Deserts",
        "current_price": 3
      }
    ]
  };

})();


