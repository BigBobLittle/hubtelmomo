const shortID = require("shortid");
const rp = require("request-promise");

function RecieveMobileMoney(fullname, phonenumber, amount, config) {
  //phonenumber
  if (!phonenumber || phonenumber.length !== 10) {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Please provide a phonenumber, it must be exactly 10 digits`
    );
  }

  //check if all params are provided
  if (!fullname || !phonenumber || !amount || !config) {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Please provide all params {fullname,phonenumber,amount and config}`
    );
  }

  //check if fullname is a string
  if (typeof fullname !== "string") {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Momo Fullname must be of type string`
    );
  }

  if (typeof phonenumber !== "string") {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Phonenumber must be of type string`
    );
  }

  if (typeof amount !== "string") {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Amount  must be of type string`
    );
  }

  if (typeof config !== "object") {
    throw new Error(
      `BOBLITTLE-RecieveMobileMoney:::\n Configuration options must be an object.`
    );
  }



  //config options 
  if(config){
    if(!config.apiKey || !config.apiSecret || !config.PrimaryCallbackUrl ||!config.merchantNumber){
      throw new Error(`BOBLITTLE-RecieveMobileMoney:::\n Please provide all required params to config, copy paste the config object from my github and replace with your own keys `);
    }
  }
  

  //switch case to handle the network for momo options
  let network = phonenumber.slice(0, 3);
  switch (network) {
    //?mtn
    case "054":
    case "024":
    case "055":
      network = "mtn-gh";
      break;

    //?vodafon
    case "050":
    case "020":
      network = "vodafone-gh";
      break;

    //?airtel
    case "056":
    case "026":
      network = "airtel-gh";
      break;

    //?tigo
    case "057":
    case "027":
      network = "tigo-gh";
      break;

    default:
      network = "mtn-gh";
      break;
  }

  let auth =
    "Basic " +
    new Buffer.from(config.apiKey + ":" + config.apiSecret).toString("base64");

  var options = {
    method: "POST",
    uri: `https://api.hubtel.com/v1/merchantaccount/merchants/${
      config.merchantNumber
    }/receive/mobilemoney`,
    body: {
      CustomerName: fullname,
      CustomerMsisdn: phonenumber,
      FeesOnCustomer: false || config.FeesOnCustomer,
      Channel: network,
      Amount: amount,
      ClientReference: config.ClientReference || shortID.generate(),
      PrimaryCallbackUrl: config.PrimaryCallbackUrl,
      Description: config.description || "Load Your Account Wallet"
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: auth
    },
    json: true
  };

  return rp(options);
}








/**
 * @name mobileMoneyErorrCodesAndResponse
 * @description Return hubtel response code indicating why a Transaction (momo prompt) will fail
 * @param code
 */
function mobileMoneyErorrCodesAndResponse(code){
    //make sure we have a code to deal with
    if (!code) {
      console.log(`mobileMoneyErorrCodesAndResponse() didn't return any code`);
    }
  
    //switch the errorCodes //i'm implementing errors with 2xxx. others are system errors, not user errors
    switch (code) {
      case "2050":
        return `The MTN Mobile Money user has  insufficient funds in wallet to make this  payment.`;
  
      case "2051":
        return `The mobile number provided is not registered on MTN Mobile Money.`;
  
      case "2001":
        return `Transaction failed due to Customer entering invalid PIN or not entering PIN at all.`;
  
      case "2100":
        return `The request failed as the customer's phone is switched off.`;
  
      case "2101":
        return `The transaction failed as the PIN entered  by the Airtel Money customer is invalid.`;
  
      case "2102":
        return `The Airtel Money user has insufficient funds in wallet to make this payment.`;
  
      case "2103":
        return `The mobile number specified is not registered on Airtel Money.`;
  
      case "2152":
        return `The mobile number specified is not registered on Tigo cash.`;
  
      case "2153":
        return `The amount specified is more than the maximum allowed by Tigo Cash.`;
  
      case "2154":
        return `The amount specified is more than the maximum daily limit allowed by Tigo Cash.`;
  
      case "2200":
        return `The recipient specified is not registered on Vodafone Cash.`;
  
      case "2201":
        return `The customer specified is not registered on Vodafone Cash.`;
  
      //refund transactions
      case "4505":
        return `Transaction has already been refunded.`;
  
      case "4080":
        return `Insufficient available balance.`;
  
      //others
  
      case "3013":
        return `Amount specified is less than the fees.`;
  
      case "3024":
        return `Specified Channel Provider is invalid`;
  
      case "0001":
        return `Prompt want sent successfully`;
  
      case "0000":
        return `Momo has been approved`;
      default:
        return "ok--bob little";
  
     
    }
  };
  



module.exports = { RecieveMobileMoney, mobileMoneyErorrCodesAndResponse};
