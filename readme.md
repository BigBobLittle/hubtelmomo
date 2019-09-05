# RecieveHubtelMobileMoney ![version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)

This is a handy unofficial nodejs package for Hubtel's Recieve Money API. This package will help you to `Recieve Mobile Money payments` from Users of all networks (mtn,voda,tigo,airtel)gh into your app/system.

Note:
Kindly note that, this package does not work for any other hubtel payment service except Recieving Money from Users of your app. In short, this package will take care of `sending a mobile money prompt` to the users phone.

## Installation
```js
`npm i --save @bigboblittle/hubtelmomo`

```

## Setup

Please follow the official [Hubtel docs](https://developers.hubtel.com/docs) to get your API Keys, API secret and merchant Account Number

_Required Fields_  
```
**fullname** -- fullname on user's mobile money wallet  
**phonenumber** -- mobile money account phonenumber // must be a string of 10 digits  
**amount** -- Amount of money to be deducted from users wallet  
**merchantNumber** -- Your hubtel merchant number  
**PrimaryCallbackUrl** Your primary callback url
```
_Needed, but not required_  
**ClientReference**  
 a unique code on your end to identify each transaction. i've used [shortid](https://www.npmjs.com/package/shortid) to auto generate a unique code. you can leave it or replace this field with your own unique key to identify transaction
**description**    
A brief description of the transaction     





```js
const RecieveMobileMoney = require('@bigboblittle/hubtelmomo').RecieveMobileMoney;

  const hubtelConfig = {
    apiKey: "replace with your API Id:",         
    apiSecret: "replace with your API Key:",
    PrimaryCallbackUrl: "set your callback url, ",
    FeesOnCustomer: false , //i've set to false
    merchantNumber: "Your Account ID",
    description: "Description of request", //not required
   ClientReference: "Your-Reference" //i've used a package by name shortid to auto generate reference, u can override it here
}
```

Please copy the above code and replace it with your own keys, it's a good practice to `load them from your .env files`

## usage

```js
`RecieveMobileMoney(fullname,phonenumber,amount, hubtelConfig);`
```

## Example using express js

```js
const app = require('express')();
const RecieveMobileMoney = require('@bigboblittle/hubtelmomo').RecieveMobileMoney;   
const ErrorCodes = require('@bigboblittle/hubtelmomo').mobileMoneyErorrCodesAndResponse;  *//<---- i will talk about this later


  const hubtelConfig = {
    apiKey: "replace with your API Id:",         
    apiSecret: "replace with your API Key:",
    PrimaryCallbackUrl: "set your callback url, ",
    FeesOnCustomer: false , //i've set to false
    merchantNumber: "Your Account ID",
    description: "Description of request", //not required
   ClientReference: "Your-reference-" //i've used a package by name shortid to auto generate reference, u can override it here
}

fullname= "Big Bob Little";
phonenumber = "0541234567",  *//always make sure the phonenumber is a 10 digit string
amount = "1";


app.post('/test1', async(req,res,next) => {

    try {
        let test  = await RecieveMobileMoney(fullname,phonenumber,amount, hubtelConfig);
        console.log(test); // you'll get the response from hubtel here
       
    } catch (error) {
        console.log(error);

    }
})

```

## Handling Errors and ResponseCode
Hubtel provides a `ResponseCode` to identify the status of each transaction whether successful or not with a message.
The response codes are plenty, depending on which of their payment services you're using.
i've taken care of  all response codes starting with **`2xxx` and few of `3xxx`**
You may be interested in passing back those responses to your users. In such case, 
you can add 
```js
`const ErrorCodes = require('@bigboblittle/hubtelmomo').mobileMoneyErorrCodesAndResponse;`   
```
Each hubtel response after every transaction has a  `ResponseCode` attached to it, so you can do something like this
```js
app.post('/test1', async(req,res,next) => {

    try {
        let test  = await RecieveMobileMoney(fullname,phonenumber,amount, hubtelConfig);
        console.log(test); // you'll get the response from hubtel here
         
         let errorCodes = ErrorCodes(test.ResponseCode); *//<------- like this *
        res.json(errorCodes)                              *//<----- this will give you the a msg explaining the error code* 
       
    } catch (error) {
        console.log(error);

    }
})

```

## Custom Errors
In order to differentiate the errors of this package from other development errors, i  preceeded all  errors return from this package with   
`BOBLITTLE-RecieveMobileMoney:::`  
followed by the error itself  
`BOBLITTLE-RecieveMobileMoney:::\n Please provide all params {fullname,phonenumber,amount and config}`
