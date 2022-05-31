import {Component} from 'react';
import { erc20_abi } from '../Resources/erc20_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import "./style.css";
import Image from 'react-bootstrap/Image';
import { Container, Row, Col, Card,Accordion, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast } from "react-bootstrap";
import transactions from './transactions';
import data from './data';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import addresses from './address';  
import NavBar from "./NavBar";
const { ethers } = require("ethers"); 
ChartJS.register(...registerables);

class Buytoken extends Component{

    constructor(props){
        super(props);
       
        this.state = {
          options:"",
          transactions:transactions,
            data:data,
            id:"aa",
            b:"dasd",
            drhp_balance:"",
            connectwalletstatus: "Connect wallet",
            accountaddr: "",
            erc20contractval: "",
            ridecontractval: "",
          
       

        }    
        this.connect = this.connect.bind(this);
    }
     rendertransactions(obj){
        return(
            <Row style={{backgroundColor:"white",paddingTop:"2px",
            borderTopLeftRadius: "25px", borderTopRightRadius: "25px", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px",marginBottom:"10px"}}>
                <Col md={1}>
                    <Image style={{marginTop:"10px",height:"55px",width:"50px"}} src="data:image/png;base64,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" roundedCircle />
                </Col>
                <Col md={9}>
                    <h5 className='gld'><strong>{obj.GLD} DRHP</strong></h5>
                    <p>Purchased on : {obj.date}</p>
                </Col>
                <Col md={2}>
                   <p className='gld' style={{fontSize:"1.5rem",marginTop:"10px"}}> <h4>Rs {obj.amount}</h4></p>
                </Col>
                
            </Row>
        );

    }



    async connect(){
        console.log("connect");
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        console.log("Account:", account);
        await this.setState({
            connectwalletstatus: "Wallet Connected",
            accountaddr: account
            
        });
        await this.get_erc20_balance();
        var textval = "Your account " + account + " has been connected";
    }

    async get_erc20_balance(){
        if(!window.ethereum){
            alert("Install metamask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let erc20contractAddress = addresses["DRHP_contract_address"];
            let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
            let ridecontractaddress = addresses["ridebooking_contract_address"];
            let ridecontract = new ethers.Contract(ridecontractaddress, ride_abi, provider);
            this.setState({
                erc20contractval: erc20contract,
                ridecontractval: ridecontract
            })
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            var c_drhp_balance = String(await erc20contract.balanceOf(account));
            c_drhp_balance = ethers.utils.formatUnits(c_drhp_balance, 18)
            this.setState({
                drhp_balance: c_drhp_balance
            });

        }
    }

    async componentDidMount(){
       await this.connect();
    }

    render(){
        return(
            <>
            <NavBar />
           
           <Container fluid style={{paddingLeft:"5%", paddingRight:"5%", paddingTop:"3%"}}>
            <Row>
                <Col md={9}>
                <h2>Buy DRHP Tokens Here!</h2> 
                </Col>
                <Col md={3}>
                <h4 className='gld'>Balance: <strong>{this.state.drhp_balance} DRHP</strong></h4>
                </Col>
            </Row>
            <hr/>
            <p> Conveniently buy our DRHP tokens here using our Razorpay payment gateway, once payment is completed your coins will be added straight to your wallet address !</p>
            <br/>
            <Row style={{marginBottom:"5%"}}>
                <Col md={8}>
                    <h4>Wallet Recharge Stats</h4>
                <Line data={this.state.data} height={120}  />
              
                </Col>
                <Col md={4}>
                    <h4>Quick Purchase</h4>
                    <br/>
                   
                    <Button style={{display:"inline-block",margin:"10px"}} onClick={()=>{
                        document.getElementById("amountvalue").value=100;
                    }} variant="outline-success">100 Rs</Button>
                    <Button style={{display:"inline-block",margin:"10px"}}  onClick={()=>{
                        document.getElementById("amountvalue").value=200;
                    }} variant="outline-success">200 Rs</Button>
                    <Button style={{display:"inline-block",margin:"10px"}}  onClick={()=>{
                        document.getElementById("amountvalue").value=400;
                    }} variant="outline-success">400 Rs</Button>
                     <Button style={{display:"inline-block",margin:"10px"}}  onClick={()=>{
                        document.getElementById("amountvalue").value=1000;
                    }} variant="outline-success">1000 Rs</Button>
                    <br/>
                    <br/>
                    <Form.Control  id="amountvalue"  style={{height:"40px",marginRight:"20px",width:"80%",display:"inline"}} type="text" placeholder="Enter Amount" />
                    <Button 
                    onClick={(e)=>{
                        var orderId ;
                        var a=document.getElementById("amountvalue").value;
                        var key={"amount":a*100};
                      
                            
                
                            fetch('http://localhost:4000/create-order',{
                            method: 'POST',
                            headers: {
                                'Content-Type' : 'application/json'
                            },
                            body:JSON.stringify(key)
                            }).then((res)=>{
                                return res.json();
                            }).then((response)=>{
                
                                
                                orderId=response.orderId;
                             
                               // $("button").show();
                
                                
                                var options = {
                                "key": "rzp_test_GVFAENjNa3GZRl", 
                                "amount": "100", 
                                "currency": "INR",
                                "name": "XYZ Pvt Ltd",
                                "description": "Transaction",
                                "image": "",
                                "order_id": orderId,
                                "handler": async function (response){
                                    alert("Transaction Success");
                                    var provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                                    await provider.send("eth_requestAccounts", []);
                                    let signer = provider.getSigner();
                                    const account = await signer.getAddress();
                                    let erc20contractAddress = addresses["DRHP_contract_address"];
                                    let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
                                    var erc20contractwithsigner = erc20contract.connect(signer);
                                    const tx = await erc20contractwithsigner.mint(a/10);
                                    await tx.wait();
                                    alert("Minted successfully!")

                                    
                                    var key2={
                                        "razorpay_payment_id":response.razorpay_payment_id,
                                        "razorpay_order_id":response.razorpay_order_id,
                                        "razorpay_signature":response.razorpay_signature
                                    };
                                    
                                },
                                "prefill": {
                                    "name": "S",
                                    "email": "tsuriyaa@gmail.com",
                                    "contact": "9884549964"
                                },
                                "notes": {
                                    "address": "Razorpay Corporate Office"
                                },
                                "theme": {
                                    "color": "#FFA500"
                                }
                            };
                
                
                
                            this.setState({options:options});
                            let rzp1 = new window.Razorpay(this.state.options);
                            rzp1.open();
                            e.preventDefault();
                        rzp1.on('payment.failed', function (response){
                                alert(response.error.code);
                                alert(response.error.description);
                                alert(response.error.source);
                                alert(response.error.step);
                                alert(response.error.reason);
                                alert(response.error.metadata.order_id);
                                alert(response.error.metadata.payment_id);
                                
                        });
                            });
                
                
                
                       
                   }}
                     variant="outline-success">
                    <i style={{marginBottom:"2px"}} class="fas  fa-duotone fa-paper-plane"></i>
                        </Button>{' '}

                   
                    
                    
                </Col>
                
            </Row>
          
                <Row>
                    <Col md={8}>
                    <h4> Recent Transactions</h4>
                <br/>
                    {this.state.transactions.map((obj)=>{
                           return this.rendertransactions(obj);
                    })}

                    </Col>
                    <Col style={{marginLeft:"0px",position:"relative",textAlign:"center",color:"black"}} md={4}>

                        <h4 style={{textAlign:"left"}}>Wallet Balance</h4>
                        <br/>
                  
                        <Image style={{height:"80%",width:"90%"}} src="https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-vector-cartoon-hand-drawn-taxi-poster-background-illustration-image_172625.jpg" />
                       
                   
                    <div style={{position:"absolute",top:"10%",left:"20%", textAlign:"center"}}>
                        <br/>
                        <h3 style={{marginLeft:"30px"}}>Total Balance</h3>
                        <h2 style={{color:"red"}}>{this.state.drhp_balance} DRHP</h2>
                        <p>Quick Recharge here via Razorpay</p>
                        
                        {/* <div style={{position:"absolute",top:"50%",left:"40%"}} class="centered"> */}
                        
                        <Button
                      onClick={(e)=>{
                            var orderId ;
                            var key={"amount":100000};
                          
                                
                    
                                fetch('http://localhost:4000/create-order',{
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json'
                                },
                                body:JSON.stringify(key)
                                }).then((res)=>{
                                    return res.json();
                                }).then((response)=>{
                    
                                    
                                    orderId=response.orderId;
                                 
                                   // $("button").show();
                    
                                    
                                    var options = {
                                    "key": "rzp_test_GVFAENjNa3GZRl", 
                                    "amount": document.getElementById("amountvalue").value, 
                                    "currency": "INR",
                                    "name": "XYZ Pvt Ltd",
                                    "description": "Transaction",
                                    "image": "",
                                    "order_id": orderId,
                                    "handler": function (response){
                                        alert("Transaction Success");
                                        alert("payment_id "+response.razorpay_payment_id);
                                        alert("order id "+response.razorpay_order_id);
                                        alert("payment signature "+response.razorpay_signature)
                                        var key2={
                                            "razorpay_payment_id":response.razorpay_payment_id,
                                            "razorpay_order_id":response.razorpay_order_id,
                                            "razorpay_signature":response.razorpay_signature
                                        };
                                        fetch('http://localhost:000/api/payment/verify',{
                                        method: 'POST',
                                        headers: {
                                            'Content-Type' : 'application/json'
                                        },
                                        body:JSON.stringify(key2)
                                        }).then((res)=>{
                                            return res.json();
                                        }).then((response)=>{
                                          
                                        })
                                    },
                                    "prefill": {
                                        "name": "S",
                                        "email": "tsuriyaa@gmail.com",
                                        "contact": "9884549964"
                                    },
                                    "notes": {
                                        "address": "Razorpay Corporate Office"
                                    },
                                    "theme": {
                                        "color": "#FFA500"
                                    }
                                };
                    
                    
                    
                                this.setState({options:options});
                                let rzp1 = new window.Razorpay(this.state.options);
                                rzp1.open();
                                e.preventDefault();
                            rzp1.on('payment.failed', function (response){
                                    alert(response.error.code);
                                    alert(response.error.description);
                                    alert(response.error.source);
                                    alert(response.error.step);
                                    alert(response.error.reason);
                                    alert(response.error.metadata.order_id);
                                    alert(response.error.metadata.payment_id);
                                    
                            });
                                });
                    
                    
                    
                           
                       }}
                          variant="outline-success">Recharge</Button>{' '}
                        </div>
                 
                    
                    </Col>
                        
                </Row>
            </Container>
          






           
            </>
        );
    }
}

export default Buytoken;