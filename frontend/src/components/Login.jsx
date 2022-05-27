import {Component} from 'react';
import LoginNavBar from './LoginNavBar';
import Image from 'react-bootstrap/Image';
import { erc20_abi } from '../Resources/erc20_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import { Container, Row, Col, Card,Accordion, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast, Alert } from "react-bootstrap";
import { FaWindowMinimize } from 'react-icons/fa';
const { ethers } = require("ethers");  

class Login extends Component{

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
            toastshow:false,
        }
        this.connect = this.connect.bind(this);
        this.rendercomponent = this.rendercomponent.bind(this);

    }
    async componentDidMount(){

       await this.connect();
       console.log(this.state.accountaddr);

       if(window.ethereum) {
        window.ethereum.on('accountsChanged', async () => {
            await this.connect();
            console.log("Account changed");
        });
    }
    }

    

    async get_erc20_balance(){
        if(!window.ethereum){
            alert("Install metamask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let erc20contractAddress = '0x76BF91aB793A6cD5B8274E1DCae56e44c49Dfd9f';
            let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
            let ridecontractaddress = '0x1e836Aa81ec093C0bA977F45bd0720A593aDBF70';
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

    async sign_driver_message(){
        var message = "Confirm sign-in request into RideShare platform as a driver";
        if(!window.ethereum)
        {
            alert("Install MetaMask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let abi = [
              "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
             ];
            let contractAddress = '0x80F85dA065115F576F1fbe5E14285dA51ea39260';
            let contract = new ethers.Contract(contractAddress, abi, provider);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            let sig = ethers.utils.splitSignature(signature);
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            console.log("Recovered:", recovered);
            const account = await signer.getAddress();
            var res = {"message":message, "signature":signature, "account":account};
            if(account == recovered){
              console.log("Signature verified");
              window.location = '/driver';
            }
            else{
              console.log("Signature not verified");
            }
            return res;
        }
    }

    async sign_rider_message(){
        var message = "Confirm sign-in request into RideShare platform as a rider";
        if(!window.ethereum)
        {
            alert("Install MetaMask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let abi = [
              "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
             ];
            let contractAddress = '0x80F85dA065115F576F1fbe5E14285dA51ea39260';
            let contract = new ethers.Contract(contractAddress, abi, provider);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            let sig = ethers.utils.splitSignature(signature);
            let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);
            console.log("Recovered:", recovered);
            const account = await signer.getAddress();
            var res = {"message":message, "signature":signature, "account":account};
            if(account == recovered){
              console.log("Signature verified");
            //   redirect to rider dashboard
            window.location = '/ride';
            }
            else{
              console.log("Signature not verified");
            }
            return res;
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
            return(
                <>  
                <Image src="https://media.wired.com/photos/595485ddce3e5e760d52d542/191:100/w_1280,c_limit/GettyImages-182859572.jpg" className="image" width='100%' height='auto' 
                style={{objectFit:'cover', position:'absolute', zIndex:'-1'}}
            />
            {/* <Image src="https://cdn.abcotvs.com/dip/images/3286272_033118-wabc-shutterstock-yellow-taxi-cab-img.jpg?w=800&r=16%3A9" className="animate-image1" width='100%' height='auto' 
                style={{objectFit:'cover', position:'absolute', zIndex:'-1', opacity:'1'}}
            />
            <Image src="https://media.wired.com/photos/595485ddce3e5e760d52d542/191:100/w_1280,c_limit/GettyImages-182859572.jpg" className="animate-image2" width='100%' height='auto' 
                style={{objectFit:'cover', position:'absolute', zIndex:'-1', opacity:'1'}}
            /> */}
            <Row>
                <Col md={6} style={{padding:"40px", marginTop:"20px", color:"white", height:"600px"}}>
                    <div style={{backgroundColor:"black", padding:"20px", borderRadius:"20px"}} >
                    <h1 
                    style={{fontSize:'400%', fontWeight:'bolder'}}>Easy. Efficient. Secure.</h1> 
                    <br/>
                    
                    <h4 style={{marginTop:'30px'}}> Your one-stop decentralized ride hailing solution !</h4>
                    {/* <h5> <span style={{fontSize:'40px'}}> 20942548 </span> Antiques Sold </h5> */}
                    <p>An all in one solution that includes token payments, staking, governance and more !</p>

                    <h5 style={{marginTop:'100px', fontWeight:'light'}} > Leading Platform for decentralized ride hailing </h5>
                    <h6 style={{fontWeight:'lighter'}}> © Copyright Reserved by RideShare 2022 </h6>
                    </div>
                </Col>
                <Col md={6} style={{backgroundColor:"", marginTop:"20px", padding:"40px", height:"600px"}}>
                    <div style={{backgroundColor:"black", padding:"50px", borderRadius:"20px", textAlign:"center", height:"475px"}} >
                    <h1 
                    style={{color:"yellow", fontSize:'200%', fontWeight:'bolder'}}>Login to start riding!</h1> 
                    <br/>
                    <p style={{color:"white"}}>Connected account: {this.state.accountaddr}</p>
                    <br/>
                    <Button style={{width:"350px", height:"100px", marginBottom:"30px"}} variant="dark" onClick={()=>{
                        this.sign_driver_message();
                    }}>Login as Driver</Button>
                    <Button style={{width:"350px", height:"100px"}} variant="dark" onClick={()=>{
                        this.sign_rider_message();
                    }}>Login as Passenger</Button>
                    </div>
                </Col>
            </Row>          
                </>
            );
    }


    render(){

        return(
            <>  

            <LoginNavBar/>
                
          {this.rendercomponent()}
            
                
            
            </>
        );
    }
}

export default Login;