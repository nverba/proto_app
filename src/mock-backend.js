(function () { 'use strict';

  window.DumpHalData = function () {
    console.log(HAL_JSON);
  };

  // specify number of tables to generate when calling newHALJSON()
  var HAL_JSON = localStorage.getItem('HAL_JSON') ? JSON.parse(localStorage.getItem('HAL_JSON')) :  newHALJSON(34);

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    // GET TABLES

    $httpBackend.when('GET', '/api/')
      .respond(function () {
        return [200, JSON.stringify(HAL_JSON.root)];
      });

    // GET PRODUCTS

    $httpBackend.when('GET', '/api/products/')
      .respond(JSON.stringify(HAL_JSON.products));

    // GET ORDERS

    $httpBackend.when('GET', '/api/table_orders/')
      .respond(function () {

        var orders = _.cloneDeep(HAL_JSON.table_orders);

        orders._embedded.table_orders = _.filter(orders._embedded.table_orders, function(order) {
          return !_.find(HAL_JSON.paid_orders._embedded.paid_orders, function(paid_order) {
            return paid_order.table_order_id === order.id;
          });
        });
        
        return [200, JSON.stringify(orders)];
      });

    // POST ORDER

    $httpBackend.when('POST', '/api/table_orders/').respond(function(method, url, json_data) {
      
      var data = JSON.parse(json_data);
      var stamp = new Date().getTime();  // lets use this for time & pseudo ID for dev

      var ref =  {

        "_links": {
          "self": { "href": "api/table_orders/" + stamp }
        },
        created_at: stamp,
        id: stamp,
        actual_price: 0,
        table_id: data.table
      };

      var products = data.order.map(function (product_id) {
        return _.find(HAL_JSON.products._embedded.products, function(prod) {
          return prod.id === product_id;
        });
      });

      angular.forEach(products, function (prod) {
        ref.actual_price += prod.current_price;
      });

      var order = angular.extend(ref, {
        "_embedded": {
          "products": products
        }
      });

      // Insert full order + embedded resources in orders
      HAL_JSON.table_orders._embedded.table_orders.push(order);

      localStorage.setItem('HAL_JSON', JSON.stringify(HAL_JSON));

      return [200];
    });

    // POST PAID ORDER

    $httpBackend.when('POST', '/api/paid_orders/').respond(function(method, url, json_data) {

     var data = JSON.parse(json_data);

      // add order to paid_orders

      HAL_JSON.paid_orders._embedded.paid_orders.push(angular.extend(data, { time_paid: new Date().getTime(), is_paid: true }));
      localStorage.setItem('HAL_JSON', JSON.stringify(HAL_JSON));

     return [200];

    });

    // resolve template requests normally.
    $httpBackend.whenGET(/components/).passThrough();

  }

  // generates a new HAL JSON object with the specified number of tables
  function newHALJSON(number_of_tables) {

    var HALJSON = {};

    // TABLES

    HALJSON.root = {

      "_links": {
        "self": { "href": "/api/" },
        "products": { "href": "products/" },
        "table_orders": { "href": "table_orders/" },
        "paid_orders": { "href": "paid_orders/" }
      },
      "_embedded": {
        "tables": []
      }
    };
      
    HALJSON.table_orders = {

      "_links": {
        "self": { "href": "/api/table_orders/" }
      },
      "_embedded": {
        "table_orders": []
      }
    };

    HALJSON.paid_orders = {

      "_links": {
        "self": { "href": "/api/paid_orders/" }
      },
      "_embedded": {
        "paid_orders": []
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
          "id": i
        });
      }
    }

    // push any number of tables to root
    generateTables(HALJSON.root, number_of_tables);

    // return the generated HAL JSON object
    return HALJSON;

  }
})();


