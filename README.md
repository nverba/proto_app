# Prototype menu-app

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
    product_id INT NOT NULL,
    final_amount DECIMAL(18,4) NOT NULL,
    is_paid INT NOT NULL
)

```
`product_orders_id -> table_orders_id`


HTTP Verb | URL | Response
--- | --- | ---
__GET__ | `/api/` | TABLES ALL
__GET__ | `/api/products/` | PRODUCTS ALL
__GET__ | `/api/table_orders/` | TABLE ORDERS ALL
__GET__ | `/api/table_orders?unpaid=true` | TABLE ORDERS NOT IN PAID ORDERS
__GET__ | `/api/table_orders/:id` | TABLE ORDER
__GET__ | `/api/paid_orders/` | PAID ORDERS ALL
__POST__ | `/api/table_orders/{ products: [] }` | CREATE TABLE ORDER
__POST__ | `/api/paid_orders/{ id: int, amount: int }` | CREATE PAID ORDER



TO-DO: 

add note about removing mock an dpossibly HAL library addapter 
