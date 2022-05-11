import {Component} from 'react';
import NavBar from './NavBar';
import Image from 'react-bootstrap/Image';
import { erc20_abi } from '../Resources/erc20_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import { Container, Row, Col, Card,Accordion, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast, Alert } from "react-bootstrap";
const { ethers } = require("ethers");  

class PaymentPage extends Component{

    constructor(props){
        super(props);
       
        this.state = {
            connectwalletstatus: "Connect wallet",
            fortoast:"",
            toastshow:false,
            accountaddr: "",
            drhp_balance: "",
            source: "MIT Main Gate",
            destination: "Radha Nagar",
            driver_address: "0x368610772B1dBd5AE2c7FA79A1972dbF3ed1bed5",
            car: "Tata Indica",
            car_number: "TN-12-34",
            car_type: "sedan", 
            trip_distance: "50",
            inr_fare: "300",
            drhp_fare: "30",
            erc20contractval: "",
            ridecontractval: "",
            showAlert: false,
        }
        
        this.connect();
    }

    async get_erc20_balance(){
        if(!window.ethereum){
            alert("Install metamask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let erc20contractAddress = '0xAb3c057544765120A030a5A0aA8D0468Ed9FA32a';
            let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
            let ridecontractaddress = '0x9a7fe822279542E65E264044A94B9e493c246f93';
            let ridecontract = new ethers.Contract(ridecontractaddress, ride_abi, provider);
            this.setState({
                erc20contractval: erc20contract,
                ridecontractval: ridecontract
            })
            var c_drhp_balance = String(await erc20contract.balanceOf(this.state.accountaddr));
            c_drhp_balance = ethers.utils.formatUnits(c_drhp_balance, 18)
            this.setState({
                drhp_balance: c_drhp_balance
            });

        }
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

    render(){

        return(
            <>  

            <NavBar/>
            <Row style={{paddingTop:"2%"}}>
                <Col md={10}>
                    </Col>
                <Col md={2}>
                <Button style={{marginLeft:"10px"}} variant="dark" onClick={()=>this.connect()}>{this.state.connectwalletstatus}</Button>
                </Col>
            </Row>
            <Container fluid style={{paddingLeft:"5%", paddingRight:"5%", paddingTop:"2%"}}>
                <Row>
                <Col md={6} style={{borderRight: "1px solid grey", height:"500px"}}>
                <h3>You have selected Regular Passenger Cab</h3>
                <h6>Make Payment in DRHP Tokens to book your ride</h6>
                <br/>
                <h5>Your Account Details</h5>
                <p>Your account: {this.state.accountaddr}</p>
                <p>Your DRHP token balance: {this.state.drhp_balance} DRHP Tokens</p>

                <br/>
                <h5>Your Trip Details</h5>
                <p>Source: {this.state.source}</p>
                <p>Destination: {this.state.destination}</p>
                <p>Driver: {this.state.driver_address}</p>
                <p>Car: {this.state.car_type} - {this.state.car}</p>
                <p>Car Number: {this.state.car_number}</p>

                </Col>
                <Col md={6} style={{paddingLeft:"5%", paddingRight:"3%"}}>
                <h3>Make Payment to confirm your ride!</h3>
                <h6>Your amount will be transferred to the driver securely once the ride is completed! </h6>
                <br/>
                <h5> Fare Details</h5>
                <p>Fare per km: 6 INR</p>
                <p>Total km: {this.state.trip_distance}</p>
                <p>Total fare: {this.state.inr_fare}</p>
                <br/>
                <p> Current Conversion Rate: 1 DRHP = 10 INR</p>
                <p> Total DRHP Tokens to be Paid: {this.state.drhp_fare} DRHP Tokens</p>
                <br/>
                <br/>
            

                <Button variant="dark" style={{width:"100%"}} size="lg" onClick={async ()=>{
                    this.setState({showAlert:true});
                     <Alert show={this.state.showAlert} variant="success">
                     <Alert.Heading>Hey, nice to see you</Alert.Heading>
                     <p>
                       Aww yeah, you successfully read this important alert message. This example
                       text is going to run a bit longer so that you can see how spacing within an
                       alert works with this kind of content.
                     </p>
                     <hr />
                     <p className="mb-0">
                       Whenever you need to, be sure to use margin utilities to keep things nice
                       and tidy.
                     </p>
                   </Alert>
                    if(parseFloat(this.state.drhp_balance) < parseFloat(this.state.drhp_fare)){
                        alert("Insufficient DRHP Tokens, please purchase some DRHP Tokens and try booking your ride !");
                    }
                    else{
                        var erc20contract  = this.state.erc20contractval;
                        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                        let signer = provider.getSigner();
                        var contractwithsigner = erc20contract.connect(signer);
                        // convert drhp fare into wei
                        const parsed_fare = ethers.utils.parseUnits(this.state.drhp_fare, 18);
                        console.log("drhp_fare:", parsed_fare);
                        const tx = await contractwithsigner.approve("0xAb3c057544765120A030a5A0aA8D0468Ed9FA32a", parsed_fare);
                        await tx.wait();
                    }
                }}>
                    Make Payment
                </Button>
                </Col>
                
            </Row>
            </Container>
                
            
            </>
        );
    }
}

export default PaymentPage;