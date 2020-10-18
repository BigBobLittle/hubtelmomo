const app = require("express")();
const {
  RecieveMobileMoney,
  ErrorCodes,
} = require("../index").RecieveMobileMoney;

const hubtelConfig = {
  apiKey: "Your-Api-Key",
  apiSecret: "Replace-With-Api-Secret",
  PrimaryCallbackUrl: "set your callback url, ",
  FeesOnCustomer: false, //i've set to false
  merchantNumber: "YOUR-CLIENT-ID", // HM...... is deprecated 
  description: "Description of request", //not required
  ClientReference: "Your-client-request", //i've used a package by name shortid to auto generate reference, u can override it here
};


const fullname = "big bob little", phonenumber = "0541234567", amount = "1";


app.post("/testHubtelMomoPrompt", async (req, res, next) => {
  try {
    const test = await RecieveMobileMoney(
      fullname,
      phonenumber,
      amount,
      hubtelConfig
    );
    //console.log(test);

    /***
     * Hubtel provides error codes to identify the state of transactions
     * i've only handled codes starting with 2xxx
     * you can pass the `ResponseCode` from each transaction and return it as response to user
     * indicating why a transaction might fail
     */
    const errorCodes = ErrorCodes(test.ResponseCode);
    res.json(errorCodes);
  } catch (error) {
    console.log(error);
  }
});

//hubtel callback example,
app.post("/callback", (req, res) => {
  res.json(req.body);
});
app.listen(process.env.PORT || 3000);
