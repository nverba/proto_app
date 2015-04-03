(function () { 'use strict';

  var HAL_JSON = {};

  angular.module('MockBackend', ['ngMockE2E'])
    .run(['$httpBackend', mockBackendFn]);

  function mockBackendFn($httpBackend) {

    $httpBackend.when('GET', '/api/')
      .respond(JSON.stringify(HAL_JSON.root));

    $httpBackend.whenGET(/components/).passThrough();

  }

  function generateTables(hal, tables) {

    for (var i=1; i <= tables; i++) {
      hal._embedded.tables.push({
        "_links": {
          "self": {
              "href": "api/tables/" + i
          }
        },
        "id": i,
        "_embedded": {
          "orders": []
        }
      });
    }
  }

  HAL_JSON.root = {
    "_links": {
      "self": {
        "href": "/api/"
      }
    },
    "_embedded": {
      "tables": [],
      "menu": {
        "_links": {
          "self": {
              "href": "api/menu"
          }
        },
        "id": "mwop",
        "url": "http://www.mwop.net"
      },
    }
  };

  // push any number of tables to root
  generateTables(HAL_JSON.root, 34);

})();


