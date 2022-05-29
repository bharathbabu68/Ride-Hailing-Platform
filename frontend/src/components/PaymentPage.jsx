import {Component} from 'react';
import NavBar from './NavBar';
import Image from 'react-bootstrap/Image';
import { erc20_abi } from '../Resources/erc20_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import addresses from './address';
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
            source: "",
            destination: "",
            driver_address: "",
            car: "",
            car_number: "",
            car_type: "sedan", 
            trip_distance: "",
            inr_fare: "",
            drhp_fare: "",
            erc20contractval: "",
            ridecontractval: "",
            showAlert: false,
            spinner:1,
            parsed_fare:"",
            approve_payment_modal:false,
            pay_to_driver_modal:false,
            approval_processing:false,
        }
        this.connect = this.connect.bind(this);
        this.rendercomponent = this.rendercomponent.bind(this);

    }
    async componentDidMount(){

       await this.connect();
        
        var key={user_address:this.state.accountaddr};
        console.log("address",this.state.accountaddr);
        fetch('http://localhost:4000/getridedetails',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(key)
        }).then((res)=>{
            if(res.ok)
            return res.json();
        }).then(async(res)=>{
          // redirect to payment page
            console.log(res["driver_details"][0]);
            res=res["driver_details"][0];
            await this.setState({
                
                source: res.source,
                destination: res.destination,

               
                car: res.car,
                car_number: res.car_no,
               
                inr_fare: res.cost*10,
                drhp_fare: res.cost,
                parsed_fare: res.cost * 10**18,
               trip_distance:(res.cost*10)/6,
               driver_address: res.driver_address,
                spinner:0


            });
            console.log("Printing parsed fare");
            console.log(this.state.parsed_fare);

            
        })
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
            let ridecontractaddress = addresses["ridebooking_contract_address"]
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
    rendercomponent(){
        if(this.state.spinner==1){
            return(
                <Spinner style={{marginTop:"20%",marginLeft:"50%"}} animation="border"  />
            )
        }
        else{
            return(
                <>
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
                <p>Total km: {this.state.trip_distance.toFixed(2)}</p>
                <p>Total fare: {this.state.inr_fare.toFixed(2)}</p>
                <br/>
                <p> Current Conversion Rate: 1 DRHP = 10 INR</p>
                <p> Total DRHP Tokens to be Paid: {this.state.drhp_fare} DRHP Tokens</p>
                <br/>
            

                <Button variant="dark" style={{width:"100%"}} size="lg" onClick={async ()=>{
                    if(parseFloat(this.state.drhp_balance) < parseFloat(this.state.drhp_fare)){
                        alert("Insufficient DRHP Tokens, please purchase some DRHP Tokens and try booking your ride !");
                    }
                    else{
                        // var erc20contract  = this.state.erc20contractval;
                        // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                        // let signer = provider.getSigner();
                        // var contractwithsigner = erc20contract.connect(signer);
                        // // convert drhp fare into wei
                        // // const parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18);
                        // // console.log("drhp_fare:", parsed_fare);
                        // const tx = await contractwithsigner.approve(addresses["ridebooking_contract_address"], String(this.state.parsed_fare));
                        // await tx.wait();
                        // alert("Your Ride Booked Successfully!");
                        this.setState({approve_payment_modal:true});
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
    render(){

        return(
            <>  

            <NavBar/>
            <Modal centered show={this.state.approve_payment_modal}>
                        <Modal.Header >
                        <Modal.Title>Approve payment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Approve payment of {this.state.drhp_fare} DRHP tokens to process your payment. </p>
                        <p> Your available token balance: {this.state.drhp_balance} tokens</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="dark" onClick={async() => {
                        var erc20contract  = this.state.erc20contractval;
                        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                        let signer = provider.getSigner();
                        console.log(signer);
                        var contractwithsigner = erc20contract.connect(signer);
                        // convert drhp fare into wei
                        var parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18);
                        console.log("drhp_fare:", parsed_fare);
                        const tx = await contractwithsigner.approve(addresses["ridebooking_contract_address"], String(parsed_fare));
                        this.setState({approve_payment_modal:false});
                        this.setState({approval_processing:true});
                        await tx.wait();
                        this.setState({approval_processing:false});
                        this.setState({pay_to_driver_modal:true});

                        }}>Approve Transfer</Button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={this.state.approval_processing}>
                        <Modal.Header >
                        <Modal.Title>Approval Processing <Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Your approval payment of {this.state.drhp_fare} DRHP tokens is being processed. Waiting for the transaction to be mined !</p>
                        </Modal.Body>
                        <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={this.state.pay_to_driver_modal}>
                        <Modal.Header >
                        <Modal.Title>Pay to Driver</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Make payment of {this.state.drhp_fare} DRHP tokens to start your ride! </p>
                        <p> Your available token balance: {this.state.drhp_balance} tokens</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="dark" onClick={async() => {
                        var ridecontract  = this.state.ridecontractval;
                        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                        let signer = provider.getSigner();
                        console.log(signer);
                        var contractwithsigner = ridecontract.connect(signer);
                        // convert drhp fare into wei
                        // const parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18);
                        // console.log("drhp_fare:", parsed_fare);
                        var parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18)
                        const tx = await contractwithsigner.pay_to_driver(this.state.driver_address, String(parsed_fare));
                        // const tx = await contractwithsigner.allocate_driver_to_passenger("0x90DD14cD9ce555b3059c388c7791e973BE16fbf5", String(8818800000000000000));
                        await tx.wait();
                        var key={driver_address:this.state.driver_address};
                        console.log("address",this.state.accountaddr);
                        fetch('http://localhost:4000/startride',{
                            method: 'POST',
                            headers: {
                                'Content-Type' : 'application/json'
                            },
                            body:JSON.stringify(key)
                        }).then((res)=>{
                            if(res.ok)
                            return res.json();
                        }).then(async(res)=>{
                        // redirect to payment page
                            this.setState({pay_to_driver_modal:false});
                            window.location.href = "/journey";
                        }
                        );
    

                        }}>Make Payment</Button>
                    </Modal.Footer>
                </Modal>

                
          {this.rendercomponent()}
            
                
            
            </>
        );
    }
}

export default PaymentPage;