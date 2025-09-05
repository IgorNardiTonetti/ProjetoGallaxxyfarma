{
  "name": "Product",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do produto"
    },
    "description": {
      "type": "string",
      "description": "Descrição detalhada do produto"
    },
    "price": {
      "type": "number",
      "description": "Preço unitário do produto"
    },
    "category": {
      "type": "string",
      "enum": [
        "bebidas",
        "alimentos",
        "limpeza",
        "higiene",
        "outros"
      ],
      "description": "Categoria do produto"
    },
    "image_url": {
      "type": "string",
      "description": "URL da imagem do produto"
    },
    "stock": {
      "type": "number",
      "description": "Quantidade em estoque"
    },
    "unit": {
      "type": "string",
      "description": "Unidade de medida (kg, l, pç, cx)"
    },
    "active": {
      "type": "boolean",
      "default": true,
      "description": "Produto ativo para venda"
    }
  },
  "required": [
    "name",
    "price",
    "category"
  ]
}