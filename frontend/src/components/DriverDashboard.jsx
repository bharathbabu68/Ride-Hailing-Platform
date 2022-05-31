import {Component} from 'react';
import NavBar from './NavBar';
import Image from 'react-bootstrap/Image';
import { erc20_abi } from '../Resources/erc20_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import addresses from "./address";
import io from 'socket.io-client'
import { Container, Row, Col, Card,Accordion, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast, Alert } from "react-bootstrap";
const { ethers } = require("ethers");  
var endpoint="http://localhost:8000";

const socket = io.connect(endpoint);
class DriverDashboard extends Component{

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
            passenger_address: "",
            showAlert: false,
            spinner:1,
            parsed_fare:"",
            approve_payment_modal:false,
            pay_to_driver_modal:false,
            approval_processing:false,
            driver_valid:"",
            driver_status:"",
            pastrides:[]
        }
        this.connect = this.connect.bind(this);

    }
    

    async componentDidMount(){

       await this.connect();



       var ridecontractval = this.state.ridecontractval;

       var  driver_valid_or_not = String(await ridecontractval.is_driver_valid({from: this.state.accountaddr}));

       this.setState({driver_valid: driver_valid_or_not});

       if(window.ethereum) {
        window.ethereum.on('accountsChanged', async () => {
            await this.connect();
            console.log("Account changed");
            var  driver_valid_or_not = String(await ridecontractval.is_driver_valid({from: this.state.accountaddr}));

            this.setState({driver_valid: driver_valid_or_not});
        });
    }

       if(this.state.driver_valid=="true"){
        
            var key={user_address:this.state.accountaddr};
            console.log("address",this.state.accountaddr);
            fetch('http://localhost:4000/getdriverdetails',{
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
                console.log(res);
                console.log(res["driver_details"][0]);
                res=res["driver_details"][0];
                console.log(res);
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
                    passenger_address: res.passenger_address,
                    spinner:0,
                    driver_status:res.status,
                });            
                console.log("Status of driver is", res.status);
                

          })

          fetch('http://localhost:4000/getdriverpastrides',{
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
         
           await this.setState({pastrides:res["driver rides"]});
           console.log("Past rides",this.state.pastrides);

      })
        }
        else{
            console.log("Driver not registered");
            console.log("Driver status ", driver_valid_or_not);
            this.setState({spinner:0});
        }
    }

    async get_erc20_balance(){
        if(!window.ethereum){
            alert("Install metamask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let erc20contractAddress = addresses["DRHP_contract_address"];;
            let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
            let ridecontractaddress = addresses["ridebooking_contract_address"];
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

    renderwalletdetails(){
        return(
            <>
            <Row>
                <Col>
                       <Card bg='light' key='light' text='dark'>
                           <Card.Header>
                               <h5>Your Wallet</h5>
                           </Card.Header>
                           <Card.Body>
                               <Card.Text>
                                   <h6>Connected Wallet Address: {this.state.accountaddr}</h6>
                                   <h6>Your DRHP Balance: {this.state.drhp_balance}</h6>
                               </Card.Text>
                           </Card.Body>
                       </Card>
                   </Col>
                   
            </Row>
            </>
        );
    }

    renderactiveride(){
        if(this.state.driver_status==2){
        return(
            <>
                <h4 style={{marginTop:"20px"}}>Active Ride (Ongoing)</h4>
                <hr/>
                <Row>
                        <Col>
                            <Card bg='light' key='light' text='dark'>
                                <Card.Header>
                                    <h6>Passenger {this.state.passenger_address}</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <h6>Source: {this.state.source}</h6>
                                        <h6>Destination: {this.state.destination}</h6>
                                        <h6>Car: {this.state.car}</h6>
                                        <h6>Car Number: {this.state.car_number}</h6>
                                        <h6>Trip Distance: {this.state.trip_distance}</h6>
                                        <h6>Inr Fare: {this.state.inr_fare}</h6>
                                        <h6>Drhp Fare: {this.state.drhp_fare}</h6>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                    </Row>
            </>
        )
        }
        else{
            return(
                <>
                    <h4 style={{marginTop:"20px"}}>Active Ride (Ongoing)</h4>
                    <hr/>
                    <p style={{textAlign:"center"}}>No active rides currently</p>
                </>
            )
        }
    }

    rendercollectpayment(){
        if(this.state.driver_status==3){
            return(
                <>
                <h4 style={{marginTop:"20px"}}>Collect Payment</h4>
                <p> Thanks for completing the ride, collect payment from passenger !</p>
                <hr/>
                <Row>
                        <Col>
                            <Card bg='light' key='light' text='dark'>
                                <Card.Header>
                                    <h6>Passenger {this.state.passenger_address}</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <h6>Source: {this.state.source}</h6>
                                        <h6>Destination: {this.state.destination}</h6>
                                        <h6>Car: {this.state.car}</h6>
                                        <h6>Car Number: {this.state.car_number}</h6>
                                        <h6>Trip Distance: {this.state.trip_distance}</h6>
                                        <h6>Inr Fare: {this.state.inr_fare}</h6>
                                        <h6>Drhp Fare: {this.state.drhp_fare}</h6>
                                    </Card.Text>
                                    <br/>
                                    <Button variant="dark" onClick={async ()=>{
                                        var ridecontract  = this.state.ridecontractval;
                                        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                                        let signer = provider.getSigner();
                                        var contractwithsigner = ridecontract.connect(signer);
                                        const tx = await contractwithsigner.withdraw_earnings_from_ride();
                                        await tx.wait();
                                        var key={driver_address:this.state.driver_address};
                                        fetch('http://localhost:4000/collectpayment',{
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
                                            alert("Payment collected successfully !");
                                            window.location.reload();
                                        }
                                        );
                                    }}>Collect Payment! </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                    </Row>
                </>
            )
        }
        else{
            return(
                <>
                    <h4 style={{marginTop:"20px"}}>Collect Payments from Passengers </h4>
                    <hr/>
                    <p style={{textAlign:"center"}}>Nothing here currently !</p>
                </>
            )
        }
    }

    renderwaitingforpayment(){
        if(this.state.driver_status==1.5){
            return(
                <>
                <h4 style={{marginTop:"20px"}}>Waiting for Payment</h4>
                <p> Just waiting for payment from the passenger side !</p>
                <hr/>
                <Row>
                        <Col>
                            <Card bg='light' key='light' text='dark'>
                                <Card.Header>
                                    <h6>Passenger {this.state.passenger_address}</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <h6>Source: {this.state.source}</h6>
                                        <h6>Destination: {this.state.destination}</h6>
                                        <h6>Car: {this.state.car}</h6>
                                        <h6>Car Number: {this.state.car_number}</h6>
                                        <h6>Trip Distance: {this.state.trip_distance}</h6>
                                        <h6>Inr Fare: {this.state.inr_fare}</h6>
                                        <h6>Drhp Fare: {this.state.drhp_fare}</h6>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                    </Row>
                </>
            )
        }
        else{
            return(
                <>
                    <h4 style={{marginTop:"20px"}}>Waiting for payments from passenger </h4>
                    <hr/>
                    <p style={{textAlign:"center"}}>Nothing here currently !</p>
                </>
            )
        }
    }

    renderriderequest(){
        if(this.state.driver_status==1){
            return(
                <>
                <h4 style={{marginTop:"20px"}}>Ride Requests (Yet to be approved by you) </h4>
                        <hr/>
                        <Row>
                            <Col>
                                    <Card style={{width:"20rem"}} bg='light' key='light' text='dark'>
                                        <Card.Header>
                                            <h6>Passenger {this.state.passenger_address}</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                <h6>Source: {this.state.source}</h6>
                                                <h6>Destination: {this.state.destination}</h6>
                                                <h6>Car: {this.state.car}</h6>
                                                <h6>Car Number: {this.state.car_number}</h6>
                                                <h6>Trip Distance: {this.state.trip_distance}</h6>
                                                <h6>Inr Fare: {this.state.inr_fare}</h6>
                                                <h6>Drhp Fare: {this.state.drhp_fare}</h6>
                                            </Card.Text>
                                            <br/>
                                            <Button variant="dark" onClick={async ()=>{
                                                // Change status of driver to '1.5' in the database
                                                var ridecontract  = this.state.ridecontractval;
                                                const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                                                let signer = provider.getSigner();
                                                var contractwithsigner = ridecontract.connect(signer);
                                                var parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18);
                                                const tx = await contractwithsigner.allocate_driver_to_passenger(this.state.passenger_address, String(parsed_fare));

                                                await tx.wait();
                                                var key={driver_address:this.state.driver_address};
                                                fetch('http://localhost:4000/acceptride',{
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type' : 'application/json'
                                                    },
                                                    body:JSON.stringify(key)
                                                }).then((res)=>{
                                                    if(res.ok)
                                                    return res.json();
                                                }).then(async(res)=>{
                                              
                                                    alert("Ride request accepted");
                                                    var data={"passenger_address": this.state.passenger_address};
                                                    await socket.emit("allotdriver",data);
                                                    window.location.reload();
                                                }
                                                );
                                                
                                               
                                                
                                            }}>Accept Ride Request! </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                        </Row>
                </>
            )
        }
        else{
            return(
                <>
                    <h4 style={{marginTop:"20px"}}>Ride Requests (Yet to be approved by you) </h4>
                    <hr/>
                    <p style={{textAlign:"center"}}>No ride requests currently</p>
                </>
            )
        }
    }

    renderpastrides(){
        return(
            <>
            <h4 style={{marginTop:"20px"}}>Past Rides</h4>
                    <hr/>
                    <Row>
                        
                       {this.state.pastrides.map((ride)=>{
                            return(
                                <Col md={3}>
                                    <Card style={{width:"20rem"}} bg='light' key='light' text='dark'>
                                        <Card.Header>
                                            <h6>Passenger {ride.passenger_address}</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                <h6>Source: {ride.source}</h6>
                                                <h6>Destination: {ride.destination}</h6>
                                                <h6>Car Number: {ride.car}</h6>
                                                <h6>Inr Fare: {ride.cost*10}</h6>
                                                <h6>Drhp Fare: {ride.cost}</h6>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                       
                            
                     </Row>
            </>
        )
    }


    rendermodals(){

        return(
        <>
        <Modal centered show={this.state.approve_payment_modal}>
                        <Modal.Header >
                        <Modal.Title>Make payment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Make payment of 100 DRHP tokens as a one-time-fee for driver registration ! </p>
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
                        // const parsed_fare = ethers.utils.parseUnits(String(this.state.drhp_fare), 18);
                        // console.log("drhp_fare:", parsed_fare);
                        const tx = await contractwithsigner.approve(addresses["ridebooking_contract_address"], "100000000000000000000");
                        this.setState({approve_payment_modal:false});
                        this.setState({approval_processing:true});
                        await tx.wait();
                        var ridecontract  = this.state.ridecontractval;
                        const provider2 = new ethers.providers.Web3Provider(window.ethereum, "any");
                        let signer2 = provider2.getSigner();
                        console.log(signer2);
                        var contractwithsigner2 = ridecontract.connect(signer2);
                        const tx2 = await contractwithsigner2.register_as_driver();
                        await tx2.wait();
                        this.setState({approval_processing:false});
                        window.location.reload();

                        }}>Make payment</Button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={this.state.approval_processing}>
                        <Modal.Header >
                        <Modal.Title>Payment Processing <Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Your payment of 100 DRHP tokens for one-time driver registartion is being processed. Click confirm on the metamask popups!</p>
                        </Modal.Body>
                        <Modal.Footer>
                    </Modal.Footer>
                </Modal>
        </>
        );

    }
    
    render(){
        if(this.state.spinner==1){
            return(
                <Spinner style={{marginTop:"20%",marginLeft:"50%"}} animation="border"  />
            )
        }
        else{
            if(this.state.driver_valid=="true"){
                return(
                    <>  

                <NavBar/>

                <Container style={{padding: "20px"}} fluid>

                <h3>Driver Dashboard</h3>
                <hr/>
                    
                {this.renderwalletdetails()}

                {this.rendercollectpayment()}

                {this.renderactiveride()}     

                {this.renderriderequest()}

                {this.renderwaitingforpayment()}         
                        
                {this.renderpastrides()}
                    
                </Container>
                    
                    </>
                );
            }
            else{
                return(
                    <>
                    {this.rendermodals()}
                    <NavBar/>
                    <Container style={{padding: "20px"}} fluid>
                    <Row>
                        <Col md={10}>
                        <h1 style={{fontFamily:"Roboto"}}>Register as a driver !</h1>
                        </Col>
                        <Col md={2}>
                        <Button variant="dark">{this.state.connectwalletstatus}</Button>
                        </Col>
                    </Row>
                    <hr/>
                    {this.renderwalletdetails()}
                    <br/>
                    <hr/>
                    <h4>Fill up this quick form and deposit the one-time-fee to get registered as a driver !</h4>
                    <h6>Current on-time-fee: 100 tokens</h6>
                    <br/>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCar">
                        <Form.Label>Enter car model</Form.Label>
                        <Form.Control type="text" placeholder="Enter Car Model" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCarNum">
                        <Form.Label>Enter car number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Car Number" />
                    </Form.Group>

                    <br/>
                    <Button variant="dark" onClick={()=>{
                        this.setState({approve_payment_modal:true});
                    }}>
                        Register
                    </Button>
                    </Form>
                    </Container>
                    </>
                )
            }
        }
    }
}

export default DriverDashboard;