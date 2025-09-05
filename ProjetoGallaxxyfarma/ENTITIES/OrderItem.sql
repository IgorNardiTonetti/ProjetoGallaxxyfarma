{
  "name": "OrderItem",
  "type": "object",
  "properties": {
    "order_id": {
      "type": "string",
      "description": "ID do pedido"
    },
    "product_id": {
      "type": "string",
      "description": "ID do produto"
    },
    "product_name": {
      "type": "string",
      "description": "Nome do produto no momento do pedido"
    },
    "quantity": {
      "type": "number",
      "description": "Quantidade solicitada"
    },
    "unit_price": {
      "type": "number",
      "description": "Preço unitário no momento do pedido"
    },
    "total_price": {
      "type": "number",
      "description": "Preço total do item"
    }
  },
  "required": [
    "order_id",
    "product_id",
    "product_name",
    "quantity",
    "unit_price"
  ]
}