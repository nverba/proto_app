(function () { 'use strict';

  window.DumpHalData = function () {
    console.log(HAL_JSON);
  };

  // specify number of tables to generate when calling newHALJSON()
  var HAL_JSON = localStorage.getItem('HAL_JSON') ? JSON.parse(localStorage.getItem('HAL_JSON')) :  newHALJSON(34);

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    $httpBackend.when('GET', '/api/')
      .respond(function () {
        return [200, JSON.stringify(HAL_JSON.root)];
      });

    $httpBackend.when('GET', '/api/products/')
      .respond(JSON.stringify(HAL_JSON.products));

    $httpBackend.when('GET', '/api/orders/')
      .respond(JSON.stringify(HAL_JSON.orders));

    $httpBackend.when('POST', '/api/orders/').respond(function(method, url, json_data) {
      
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
          "products": data.order.map(function (product_id) {

            _.find(HAL_JSON.products._embedded.products, function(prod) {
              return prod.id === product_id;
            });
          })
        }
      });

      // Embed order ref in tables (root)
      HAL_JSON.root._embedded.tables[ data.table -1 ]._embedded.orders.push(ref);

      // Insert full order + embedded resources in orders
      HAL_JSON.orders._embedded.orders.push(order);

      localStorage.setItem('HAL_JSON', JSON.stringify(HAL_JSON));

      return [200];
    });

    $httpBackend.when('POST', '/api/paid_orders/').respond(function(method, url, json_data) {

     var data = JSON.parse(json_data);

      // clear embedded reference to order from table

      HAL_JSON.root._embedded.tables[data.table_id - 1]._embedded.orders.splice(_.findIndex(HAL_JSON.orders._embedded.orders, function function_name (order) {
        return data.order_id == order.id;
      }), 1);

      // remove order from prders and transfer to paid_orders

      HAL_JSON.paid_orders._embedded.orders.push(HAL_JSON.orders._embedded.orders.splice(_.findIndex(HAL_JSON.orders._embedded.orders, function function_name (order) {
        return data.order_id == order.id;
      }), 1));

      localStorage.setItem('HAL_JSON', JSON.stringify(HAL_JSON));

     return [200];

    });

    // resolve template requests normally.
    $httpBackend.whenGET(/components/).passThrough();

  }

  // generates a new HAL JSON object with the specified number of tables
  function newHALJSON(number_of_tables) {

    var HALJSON = {};

    HALJSON.root = {

      "_links": {
        "self": { "href": "/api/" },
        "products": { "href": "products/" },
        "orders": { "href": "orders/" }
      },
      "_embedded": {
        "tables": []
      }
    };
      
    HALJSON.orders = {

      "_links": {
        "self": { "href": "/api/orders/" }
      },
      "_embedded": {
        "orders": [

        ]
      }
    };

    HALJSON.paid_orders = {

      "_links": {
        "self": { "href": "/api/paid_orders/" }
      },
      "_embedded": {
        "orders": [

        ]
      }
    };

    HALJSON.products = {

      "_links": {
        "self": { "href": "/api/products/" }
      },
      "_embedded": {
        "products": [
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
      }
    };

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

    // push any number of tables to root
    generateTables(HALJSON.root, number_of_tables);

    // return the generated HAL JSON object
    return HALJSON;

  }
})();


