const express = require("express");
const { MongoClient } = require('mongodb');
const { AssertionError } = require("assert");
const app = express();
const bodyparser=require("body-parser");
app.use(bodyparser.json());
app.use(express.static("public"));
var cors = require('cors')
const Razorpay = require("razorpay");
app.use(cors());

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
 





app.listen(4000,()=>{
  console.log("listening here");
})

