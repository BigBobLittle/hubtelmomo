# RecieveHubtelMobileMoney

This is a handy unofficial nodejs package for Hubtel's Recieve Money API. This package will help you to `Recieve Mobile Money payments` from Users of all networks (mtn,voda,tigo,airtel)gh into your app/system.

Note:
Kindly note that, this package does not work for any other hubtel payment service except Recieving Money from Users of your app. In short, this package will take care of `sending a mobile money prompt` to the users phone.

## Installation

## Setup

Please follow the official [Hubtel docs](https://developers.hubtel.com/docs) to get your API Keys, API secret and merchant Account Number

_Required Fields_  
**fullname** -- fullname on user's mobile money wallet  
**phonenumber** -- mobile money account phonenumber // must be a string of 10 digits  
**amount** -- Amount of money to be deducted from users wallet  
**merchantNumber** -- Your hubtel merchant number  
**PrimaryCallbackUrl** Your primary callback url

_Needed, but not required_  
**ClientReference**  
 a unique code on your end to identify each transaction. i've used [shortid](https://www.npmjs.com/package/shortid) to auto generate a unique code. you can leave it or replace this field with your own unique key to identify transaction

**description**  
A brief description of the transaction

```
const RecieveMobileMoney = require('../index').RecieveMobileMoney;

  const hubtelConfig = {
    apiKey: "Your-Api-Key",
    apiSecret: "Replace-With-Api-Secret",
    PrimaryCallbackUrl: "set your callback url, ",
    FeesOnCustomer: false , //i've set to false
    merchantNumber: "HM..........",
    description: "Description of request", //not required
   ClientReference: "Your-client-request" //i've used a package by name shortid to auto generate reference, u can override it here
}
```

Please copy the above code and replace it with your own keys

## usage

`RecieveMobileMoney(fullname,phonenumber,amount, hubtelConfig);`

## Example using express js

```
const app = require('express')();
const RecieveMobileMoney = require('../index').RecieveMobileMoney;
const ErrorCodes = require('../index').mobileMoneyErorrCodesAndResponse;  //<---- i will talk about this later


  const hubtelConfig = {
    apiKey: "Your-Api-Key",
    apiSecret: "Replace-With-Api-Secret",
    PrimaryCallbackUrl: "set your callback url, ",
    FeesOnCustomer: false , //i've set to false
    merchantNumber: "HM..........",
    description: "Description of request", //not required
   ClientReference: "Your-client-request" //i've used a package by name shortid to auto generate reference, u can override it here
}

fullname= "Big Bob Little";
phonenumber = "0543892565",
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

`const ErrorCodes = require('../index').mobileMoneyErorrCodesAndResponse;`  //<---- i promised to talk about 

Each hubtel response after every transaction has a  `ResponseCode` attached to it, so you can do something like this
```
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
