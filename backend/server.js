const express = require("express");
const  erc20abi  =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const { MongoClient } = require('mongodb');
const { AssertionError } = require("assert");
const app = express();
const bodyparser=require("body-parser");
app.use(bodyparser.json());
app.use(express.static("public"));
var cors = require('cors')
const Razorpay = require("razorpay");
app.use(cors());

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')


var instance = new Razorpay({ key_id: 'rzp_test_GVFAENjNa3GZRl', key_secret: 'I5TAm2SlyllYMzzQkaPIBPrG' })



app.post("/payment", async function(req, res) {
  const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 
  const client = new MongoClient(uri);
  try {
    await client.connect();
  
    const cursor = await client.db("Ride_Hailing_Platform").collection("drivers_table").find();
    const arr= await cursor.toArray();
    var driver_id;
    for(var i=0;i<arr.length;i++){
      if(arr[i].status==0){
        driver_id=arr[i]._id;
        break;
      }
    }
     await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:driver_id},{$set:{status:1}});
    await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:driver_id},{$set:{source:req.body.source}});
    await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:driver_id},{$set:{destination:req.body.destination}});
    await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:driver_id},{$set:{cost:req.body.ridecostdrhp}});
    await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:driver_id},{$set:{passenger_address:req.body.user_address}});


   
    var obj={"driver_details":"123"};

   

    res.send(obj);


} catch (e) {
    console.error(e);
} finally {
    // Close the connection to the MongoDB cluster
    await client.close();

}

});


app.post("/getridedetails", async function(req, res) {
  const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  console.log(req.body);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    var user_adress=req.body.user_address;
    // fetch driver from db whose user_address is user_address
    const cursor = await client.db("Ride_Hailing_Platform").collection("drivers_table").find({passenger_address:user_adress});
    const arr= await cursor.toArray();

   
   
   
    var obj={"driver_details":arr};

   

    res.send(obj);


} catch (e) {
    console.error(e);
} finally {
    // Close the connection to the MongoDB cluster
    await client.close();

}

});

app.post("/getdriverdetails", async function(req, res) {
  const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  console.log(req.body);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    var user_adress=req.body.user_address;
    // fetch driver from db whose user_address is user_address
    const cursor = await client.db("Ride_Hailing_Platform").collection("drivers_table").find({driver_address:user_adress});
    const arr= await cursor.toArray();

    var obj={"driver_details":arr};

    res.send(obj);


} catch (e) {
    console.error(e);
} finally {
    // Close the connection to the MongoDB cluster
    await client.close();

}

});






app.post("/",(req,res)=>{
  console.log(req.body);
})

app.post("/create-order",(req,res)=>{
console.log(req.body.amount)

  var options = {
    amount:req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "rcptid1_1"
  };
  instance.orders.create(options, function(err, order) {

    console.log(order);
    res.send({orderId:order.id});
  });

})

app.post("/api/payment/verify",(req,res)=>{

  let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  console.log(body);
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', 'I5TAm2SlyllYMzzQkaPIBPrG')
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.razorpay_signature)
    response={"signatureIsValid":"true"}
    console.log(response);
       res.send(response);
   });


  async function clear_passenger_details(){
    // function to clear the source, destination, passenger_address, cost, status of all drivers
    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const cursor = await client.db("Ride_Hailing_Platform").collection("drivers_table").find();
      const arr= await cursor.toArray();
      for(var i=0;i<arr.length;i++){
        await client.db("Ride_Hailing_Platform").collection("drivers_table").updateOne({_id:arr[i]._id},{$set:{source:"",destination:"",cost:"",status:0, passenger_address:""}});
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  }
 


// clear_passenger_details();
function main()
{
 const infura= "https://ropsten.infura.io/v3/d628a445ee6c405489c0da8f89a9d58a";
 const web3 = new Web3(new Web3.providers.HttpProvider(infura));
 web3.eth.defaultAccount = '0x2F1C6e41597572abA409eF6806f4d3Fad3Ed53f7';
var abi = erc20abi;
var pk  = "11883af62bdce25492ff071a6feb87bf91c15928d8ea706b46b431c4d2b46273"  // private key of your account
//var toadd = process.env.WALLET_DESTINATION;
var contract;
var address = '0x76BF91aB793A6cD5B8274E1DCae56e44c49Dfd9f'; //Contract Address
var z=10*10**18;
web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
  console.log("nonce value is", nonce);
  contract = new web3.eth.Contract(JSON.parse(abi), address, {
  from: web3.eth.defaultAccount ,
  gas: 3000000,
  })
 
}
);
console.log("abi :",abi);
contract = new web3.eth.Contract(JSON.parse(abi), address, {
  from: web3.eth.defaultAccount ,
  gas: 3000000,
  });

const functionAbi = contract.methods.transfer("0xC784079A953617c470d6A28dA4Bf9533BeC013b3",z).encodeABI();
var details = {
  "nonce": nonce,
  "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
  "gas": 300000,
  "to": address,
  "value": 0,
  "data": functionAbi,
  };
  const transaction = new EthereumTx(details);
  transaction.sign(Buffer.from(pk, 'hex'));
  var rawdata = '0x' + transaction.serialize().toString('hex');
  web3.eth.sendSignedTransaction(raw)
.on('transactionHash', function(hash){
    console.log(['transferToStaging Trx Hash:' + hash]);
})
.on('receipt', function(receipt){
    console.log(['transferToStaging Receipt:', receipt]);
})
.on('error', console.error);

}


//main();


app.listen(4000,()=>{
  console.log("listening here");
})

