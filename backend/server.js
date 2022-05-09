const express = require("express");
const app = express();
const bodyparser=require("body-parser");
app.use(bodyparser.json());
app.use(express.static("public"));
var cors = require('cors')
const Razorpay = require("razorpay");
app.use(cors());

var instance = new Razorpay({ key_id: 'rzp_live_emIx9la2Treo5U', key_secret: 'l26oorTjxtKM9wNwgeJfctjU' })


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
   var expectedSignature = crypto.createHmac('sha256', 'l26oorTjxtKM9wNwgeJfctjU')
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

