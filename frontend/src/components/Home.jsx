import { Component } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Card, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast } from "react-bootstrap";
const { ethers } = require("ethers");

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            bulbColor:['#00cc00', '#fafafa' ],
            show:false,
            connectwalletstatus: "Connect wallet",
            fortoast:"",
            message:"",
        };
    }

    componentDidMount = () => {
        console.log("componentDidMount");
    }

    async connect(){
        console.log("connect");
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        console.log("Account:", account);
        this.setState({
            connectwalletstatus: "Connected"
        });
        var textval = account + " Connected";
        this.setState({
            fortoast: textval
        });
        this.setState({
            show:true
        });

    }

    async sign_message(message){
        if(!window.ethereum)
        {
            alert("Install MetaMask");
            return;
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            const account = await signer.getAddress();
            var res = {"message":message, "signature":signature, "account":account};
            return res;
        }
    }

    render(){
        
        return(
            <>
            {/* Modals */}
            <Toast className="rounded me-2" style={{position:"absolute", bottom:"30px", left:"20px", width:"220px"}} onClose={()=>{
                this.setState({
                    show:false
                })
            }} show={this.state.show}>
                <Toast.Header>
                    <strong >Login Successful <span>&#9989;</span></strong>
                </Toast.Header>
                <Toast.Body>
                    Welcome to RideShare, your status is {this.state.fortoast}
                </Toast.Body>
            </Toast>

            {/* Navbar */}
            <NavBar/>

            {/* Container */}
            <Container fluid>

            <Row style={{height:"480px", padding:"0px", marginTop:"0px"}}>
                <Col style={{padding: "50px", height:"450px", margin:"0px"}} className="bg-1" md={5}>
                    <h1 class="temp">The Future of Ride Sharing</h1>
                </Col>
                <Col style={{padding:"0px", height:"450px",backgroundColor:"black", margin:"0px"}} md={7}>
                <Carousel controls={false} fade style={{height:"450px"}}>
                    <Carousel.Item interval={2000}>
                        <img 
                        className="d-block w-100 cimage"
                        src="https://images.pexels.com/photos/462867/pexels-photo-462867.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={2000}>
                    <img 
                        className="d-block w-100 cimage"
                        src = "https://media.wired.com/photos/595485ddce3e5e760d52d542/191:100/w_1280,c_limit/GettyImages-182859572.jpg"
                        alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={2000}>
                    <img 
                        className="d-block w-100 cimage"
                        src="https://cdn.abcotvs.com/dip/images/3286272_033118-wabc-shutterstock-yellow-taxi-cab-img.jpg?w=800&r=16%3A9"
                        alt="First slide"
                        />
                    </Carousel.Item>
                </Carousel>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Button onClick={()=>{
                        this.setState({show:true})
                    }}>Click me</Button>
                </Col>
                <Col md={4}>
                    <Button onClick={()=>{
                        this.connect();
                    }}>{this.state.connectwalletstatus}</Button>
                </Col>
                <Col md={4}>
                    <input style={{margin:"10px", height:"40px", borderRadius:"5px"}} type="text" placeholder="Enter your message" onChange={(e)=>{
                        this.setState({
                            message:e.target.value
                        })
                    }}/>
                    <Button onClick={async()=>{
                        var res = await this.sign_message(this.state.message);
                        console.log(res);
                    }}>Sign Message</Button>
                </Col>
            </Row>
            
            </Container>
            </>
        );
    }

}

export default Home;