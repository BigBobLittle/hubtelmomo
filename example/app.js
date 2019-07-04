const app = require('express')();
const RecieveMobileMoney = require('../index').RecieveMobileMoney;
const ErrorCodes = require('../index').mobileMoneyErorrCodesAndResponse;


  const hubtelConfig = {
    apiKey: "Your-Api-Key",
    apiSecret: "Replace-With-Api-Secret",
    PrimaryCallbackUrl: "set your callback url, ", 
    FeesOnCustomer: false , //i've set to false  
    merchantNumber: "HM..........",
    description: "Description of request", //not required
   ClientReference: "Your-client-request" //i've used a package by name shortid to auto generate reference, u can override it here
}



username= "frimpong tachie evans";
phonenumber = "0543892565",
amount = "1";



app.post('/test1', async(req,res,next) => {
  
    try {
        let test  = await RecieveMobileMoney(username,phonenumber,amount, hubtelConfig);
        //console.log(me);

        /***
         * Hubtel provides error codes to identify the state of transactions
         * i've only handled codes starting with 2xxx
         * you can pass the `ResponseCode` from each transaction and return it as response to user
         * indicating why a transaction might fail
         */
        let errorCodes = ErrorCodes(test.ResponseCode);
        res.json(errorCodes)
 
        
      
    } catch (error) {
        console.log(error);
        
    }
})


//hubtel callback example, 
 app.post('/callback', (req,res,next) => {
     res.json(req.body);
 })
 app.listen(process.env.PORT || 3000);