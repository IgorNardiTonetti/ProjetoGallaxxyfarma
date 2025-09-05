{
  "name": "Order",
  "type": "object",
  "properties": {
    "customer_name": {
      "type": "string",
      "description": "Nome do cliente"
    },
    "customer_email": {
      "type": "string",
      "description": "Email do cliente"
    },
    "customer_phone": {
      "type": "string",
      "description": "Telefone do cliente"
    },
    "delivery_address": {
      "type": "string",
      "description": "Endereço de entrega"
    },
    "status": {
      "type": "string",
      "enum": [
        "pendente",
        "confirmado",
        "em_preparacao",
        "saiu_para_entrega",
        "entregue",
        "cancelado"
      ],
      "default": "pendente",
      "description": "Status do pedido"
    },
    "total_amount": {
      "type": "number",
      "description": "Valor total do pedido"
    },
    "notes": {
      "type": "string",
      "description": "Observações do pedido"
    },
    "delivery_date": {
      "type": "string",
      "format": "date",
      "description": "Data prevista de entrega"
    }
  },
  "required": [
    "customer_name",
    "customer_email",
    "total_amount"
  ]
}