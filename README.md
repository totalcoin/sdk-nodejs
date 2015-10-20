TotalCoin
=========

Node.JS SDK para la API de TotalCoin

# Descripción
Node.JS SDK para interactuar con la API de TotalCoin https://www.totalcoin.com.ar/

# Instalación
#### Desde NPM
```
npm install totalcoin
```
#### Desde GitHub
```
npm install github:totalcoin/sdk-node
```
#### Desde un directorio
```
npm install {path relativo o absoluto al directorio}
```
# Ejemplos de uso

### Require
```
var totalcoin = require('TotalCoin')('{email}', '{apikey}');
```
### Metodos

##### 1. Autorize:
Obtiene el token y se lo pasa al resto de los metodos.
_Solo es necesario autorizar una vez o cuando un metodo retorna el error de token invalido._
```
totalcoin.Authorize(function(err) {
    if (err) throw(err);
});
```
##### 2. GetMerchants:
Retorna la lista de comercios asociados a la cuenta.
```
totalcoin.GetMerchants(function(err, merchants) {
    if (err) throw(err);
});
```
En la variable ```merchants``` se retorna:
```
[
    {
      "Id": "b0fd449b-97ad-4d76-a87b-34bb8e6a999a",
      "Name": "Comercio Predefinido"
    }
]
```
##### 3. Checkout:
Genera una transaccion en __TotalCoin__.
Los parametros se pasan al metodo via un objeto donde los parametros son:

1. Amount: La cantida de unidades de la moneda (minimo 10)
2. Quantity: La cantidad de productos a comprar (minimo 1)
3. Country: El pais del comercio (por defecto ```totalcoin.COUNTRY.argentina```)(ver [Constantes](#markdown-header-constantes))
4. Currency: La moneda de la transaccion (por defecto ```totalcoin.CURRENCY.pesos_argentinos```)(ver [Constantes](#markdown-header-constantes))
5. PaymentMethods: El metodo de pago de la transaccion (por defecto ```totalcoin.PAYMENTMETHODS.cash```)(ver [Constantes](#markdown-header-constantes))
5. Description: La descripcion de la transaccion
4. Reference: La referencia de la transaccion
5. Site: El nombre del sitio de la transaccion
6. MerchantId: El ID del comercio (ver [GetMerchants](#markdown-header-2-getmerchants))

```
totalcoin.Checkout({
        Amount: 10,
        Quantity: 1,
        Description: 'Test Node.js Client',
        Reference: '20202020',
        Site: 'Test Client',
        MerchantId: merchantID
    },
    function(err, checkoutURL) {
        if (err) throw(err);
    });
```
En la variable ```checkoutURL``` se retorna la URL para finalizar el pago de la transaccion.

##### 4. GetIpnInfo:
Retorna el estado de una transaccion en __TotalCoin__.
Los parametros se pasan al metodo via un objeto donde el parametros es:

1. referenceID: es el ID de la transaccion que retorno __TotalCoin__ al sitio via la URL de retorno.

```
totalcoin.GetIpnInfo({
        referenceID: referenceID
    }, function(err, ipninfo) {
        if (err) throw(err);
    });
```

En la variable ```ipninfo``` se retorna:
```
{
    "Reference": "0000000999",
    "MerchantReference": "20202020",
    "TransactionType": "Sale",
    "Reason": "Test Node.js Client",
    "Currency": "ARS",
    "PaidAmount": 10,
    "NetAmount": 7.1,
    "FinancingCost": 0,
    "TotalAmount": 10,
    "TransactionHistories": [
      {
        "Date": "2015-09-09T07:41:56.417",
        "TransactionState": "InProccess"
      }
    ],
    "Merchant": {
      "Id": "b0fd449b-97ad-4d76-a87b-34bb8e6a999a",
      "Name": "Comercio Predefinido"
    },
    "FromUser": {
      "Phone": null,
      "FullName": "Buyer Full Name",
      "Email": "email@buyer.net"
    },
    "ToUser": {
      "Phone": null,
      "FullName": "Merchant Full Name",
      "Email": "email@merchant.net"
    },
    "Provider": {
      "Name": "Provider Name",
      "PaymentMethod": "Cash"
    }
  }
```

### Constantes
El objeto retornado por ```require('TotalCoin')``` incluye constantes para ser usadas por ```totalcoin.Checkout()```. Estas son:

```
totalcoin.COUNTRY = {
    argentina: 'ARG' // Argentina
}
```
```
totalcoin.CURRENCY = {
    pesos_argentinos: 'ARS' // Pesos Argentinos
}
```
```
totalcoin.PAYMENTMETHODS = {
    cash: 'CASH', // Efectivo
    creditcard: 'CREDITCARD', // Tarjeta de credito
    totalcoin: 'TOTALCOIN' // Cuenta TotalCoin
}
```