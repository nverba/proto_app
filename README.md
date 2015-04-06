# Prototype menu-app

The backend is mocked with angular `$httpBackend` which can be removed by taking out the `MockBackend` dependency from app.js.

The prototype uses the AngularJS component style and the new, AngularJS 2.0.0 compatable [angular-new-router](http://angular.github.io/router/getting-started). Whilst this is still early in development, it makes sense to start to adopt the newer component style, avoiding complete rewrites when angular 1.4.0/2.0.0 become standard. The main HAL client id [Hyperagent](https://weluse.github.io/hyperagent/).

The `mock-backend` syncs data to localStorage for convenience whilst developing. If in doubt, clear the data with `localStorage.clear()`. There is also an option to `DumpHalData()`, that logs the complete, namespaced HAL JSON object to the console for inspection.

Revised database schema:
```sql
CREATE TABLE tables (

    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
)

CREATE TABLE products (

    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    current_price DECIMAL(18,4) NOT NULL
)

CREATE TABLE table_orders (

    id SERIAL NOT NULL PRIMARY KEY,
    table_id INT NOT NULL,
    product_id INT NOT NULL,
    actual_price DECIMAL(18,4) NOT NULL,
    time_ordered TIMESTAMP NOT NULL
)

CREATE TABLE paid_orders (

    id NOT NULL PRIMARY KEY,
    table_orders_id INT NOT NULL,
    final_amount DECIMAL(18,4) NOT NULL,
    time_paid TIMESTAMP NOT NULL,
    is_paid INT NOT NULL
)

```
changed `product_orders_id -> table_orders_id`


### Ideal REST interface

HTTP | URL | Params| Response
--- | --- | --- | ---
__GET__ | `/api/` || Returns root which is also the TABLES resource.
__GET__ | `/api/products/` || Returns products resource
__GET__ | `/api/table_orders/` | `filter=[paid\|unpaid]`, `id_only=bool` | Returns table_orders resource, filterable by paid/unpaid or optionally id's only.
__GET__ | `/api/table_orders/:table_id` | `filter=[paid\|unpaid]` | Return orders of specified table id, filterable by paid unpaid 
__POST__ | `/api/table_orders/` | `table_id=INT`:required, `order=Array`:required | Creates a new table order with the required table_id & array of product IDs
__POST__ | `/api/paid_orders/` | `table_order_id`:required, `final_ammount`:required  | Creates a new entry in the paid orders resource



Notes: currently the HAL-JSON client does not support Angulars $http natively, I have supplied an adapter in `ApiService` to make this work with the mocked backend, however this does require the result to be re-stringified back into JSON which is a bit wasteful. Perhaps a PR or fork could be made so Hyperagent could support Angular natively in the future.  

TO-DO: 
 - Complete rest compatibility of $httBackend, with filtering by params. (Current implementation defaults to unpaid `table_orders` without params for prototype.)
 - Move mock data out of mock-backend into separate JSON files.
 - Add e2e tests for rendered views
 - Add option to split orders
 - Add mandatory and optional product modifiers, probably via a small modal?
 - Create ApiService helpers for loading linked resources, then refactor component controllers.
 - Possibly create a separate `transactions` service for pay_order, create_order functions, instead of having all business logic chucked in the `ApiService`
 - Add modal confirming payment has been made when rerouting to the home screen. Will require some sort of flash module that acceps a message as paramater. 
