import {Component} from 'react';
import NavBar from './NavBar';
import Image from 'react-bootstrap/Image';
import { erc20_abi } from '../Resources/drhp_abi';
import { ride_abi } from '../Resources/ride_abi'; 
import "./style.css";
import addresses from './address';
import { Badge,Container, Row, Col, Card,Accordion, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast, Alert } from "react-bootstrap";
import { parse } from 'url';
const { ethers } = require("ethers");  

class Staketoken extends Component{

    constructor(props){
        super(props);
       
        this.state = {
            total_value_locked: "",
            total_rewards_given:"",
            user_total_stake:"",
            user_total_rewards: "",
            current_epoch_rewards:"",
            available_for_harvest:"",
            time: {},
            seconds: 5,
            minutes:1,
            hours:1,
            days:10,
            currentrewards:"12000",
            total_stake:"15000",
            connectwalletstatus: "Connect wallet",
            accountaddr: "",
            erc20contractval: "",
            ridecontractval: "",
            balance: "",
            show:false,
            transactionstate:false,
            removestakemodal:false
           
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.connect = this.connect.bind(this);

    }
 
    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
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
        await this.getalldetails();
        var textval = "Your account " + account + " has been connected";
    }

    async getalldetails(){
        if(!window.ethereum){
            alert("Install metamask");
            return;
        }
        else{
         
            var provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let erc20contractAddress = addresses["DRHP_contract_address"];
            let erc20contract = new ethers.Contract(erc20contractAddress, erc20_abi, provider);
           
            this.setState({
                erc20contractval: erc20contract,
              
            })

            // await provider.send("eth_requestAccounts", []);
            // var signer = provider.getSigner();
            // var account = await signer.getAddress();
            var c_drhp_balance = String(await erc20contract.getotalstakes({from: this.state.accountaddr}));
            // convert to ether
            var c_drhp_balance_ether = ethers.utils.formatEther(c_drhp_balance);
            this.setState({total_value_locked:c_drhp_balance_ether});

             await provider.send("eth_requestAccounts", []);
            var signer = provider.getSigner();
            var account = await signer.getAddress();
            var c_drhp_balance = String(await erc20contract.balanceOf(this.state.accountaddr));
            // convert to ether
            var c_drhp_balance_ether = ethers.utils.formatEther(c_drhp_balance);
            this.setState({balance:c_drhp_balance_ether});
          
            var s = String(await erc20contract.gettotalreward());
            var s_ether = ethers.utils.formatEther(s);
            console.log("total rewards",s);
            await this.setState({total_rewards_given:s_ether});

            console.log(this.state.accountaddr);

           
            var s = String(await erc20contract.getusertotalstake({from:this.state.accountaddr}));
            s = ethers.utils.formatEther(s);
            console.log("user_total_stake",s);
            await this.setState({user_total_stake:s});

           
            var s = String(await erc20contract.getusertotalreward({from:this.state.accountaddr}));
            s = ethers.utils.formatEther(s);
            await this.setState({user_total_rewards:s});


           
            var s = String(await erc20contract.getNumberOfRewardDistributions());
            // convert s into ether
            await this.setState({current_epoch_rewards:s});

            var s = String(await erc20contract.getusercurrentstake({from:this.state.accountaddr}));
            s = ethers.utils.formatEther(s);
            console.log("user_current_stake",s);
            await this.setState({available_for_harvest:s});

            
            

            
            

           
          
        }
    }

     async componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        await this.setState({ time: timeLeftVar });
        await  this.startTimer();
        await this.connect();
      }
    
     async startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
          this.timer = await setInterval(this.countDown, 1000);
        }
      }
    
      async countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
       
        if (seconds == 0 && this.state.minutes!=1) { 
           
        
            clearInterval(this.timer);
           await this.setState({
                minutes:this.state.minutes-1,
                seconds:59,
               
            })
            let timeLeftVar = this.secondsToTime(this.state.seconds);
            this.setState({ time: timeLeftVar });
            this.timer=0;
            this.startTimer();
          
        }
        else{
            if (seconds == 0 && this.state.minutes==1&& this.state.hours!=1){ 
           
        
                clearInterval(this.timer);
               await this.setState({
                    minutes:59,
                    seconds:59,
                    hours:this.state.hours-1
                   
                })
                let timeLeftVar = this.secondsToTime(this.state.seconds);
                this.setState({ time: timeLeftVar });
                this.timer=0;
                this.startTimer();
              
            }
            else{
               
                if(seconds==0 && this.state.minutes==1&& this.state.hours==1 && this.state.days!=1){
                    clearInterval(this.timer);
                    await this.setState({
                         minutes:59,
                         seconds:59,
                         hours:23,
                         days:this.state.days-1
                        
                     })
                     let timeLeftVar = this.secondsToTime(this.state.seconds);
                     this.setState({ time: timeLeftVar });
                     this.timer=0;
                     this.startTimer();
                    
                }
                else if(seconds==0 && this.state.minutes==1&& this.state.hours==1 && this.state.days==1){
                    alert("next epoch sarts");
                    clearInterval(this.timer);
                }
                else{
                    await this.setState({
                       
                        seconds:this.state.seconds-1,
                       
                    })
                }
              
            }

        }
      }
    
    
    render(){

        return(
            <>  

            <NavBar/>
            <Modal show={this.state.show} onHide={()=>{
                this.setState({show:false});
                }}>
        <Modal.Header closeButton>
          <Modal.Title>Get Ready to Stake</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Balance :{this.state.balance}</p>
        <Form.Label>Enter amount in DRHP</Form.Label>
        <Form.Control id="t1" type="text" />
        <Button onClick={async()=>{
            var a=document.getElementById("t1").value;
            console.log("Balance vs enterred amount");
            console.log(a);
            console.log(this.state.balance);

            if(parseFloat(a)>parseFloat(this.state.balance)){
                alert("Insufficient balance");
                return;
            }
            var erc20contract  = this.state.erc20contractval;
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let signer = provider.getSigner();
            console.log(signer);
            var contractwithsigner = erc20contract.connect(signer);
            // convert a into wei
            var a_wei = ethers.utils.parseEther(a);
            const tx = await contractwithsigner.depositstake(a_wei);
            this.setState({show:false});
            this.setState({transactionstate:true});
            await tx.wait();
            this.setState({transactionstate:false});
            window.location.reload();
            console.log("Printing transaction",tx);

        }} className="mt-5" variant="secondary">Deposit</Button>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.removestakemodal} onHide={()=>{
                this.setState({removestakemodal:false});
                }}>
        <Modal.Header closeButton>
          <Modal.Title>We hope you would return back to stake</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Balance :{this.state.balance}</p>
        <Form.Label>Enter amount in DRHP</Form.Label>
        <Form.Control id="t2" type="text" />
        <Button onClick={async()=>{
            var a=document.getElementById("t2").value;
            if(parseFloat(a) > parseFloat(this.state.available_for_harvest)){
                alert("Insufficient balance");
            }
            var erc20contract  = this.state.erc20contractval;
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            let signer = provider.getSigner();
            console.log(signer);
            var contractwithsigner = erc20contract.connect(signer);
            // convert a into wei
            var a_wei = ethers.utils.parseEther(a);
            const tx = await contractwithsigner.removestake(a_wei);
            this.setState({transactionstate:true});
            this.setState({removestakemodal:false});
            await tx.wait();
            this.setState({transactionstate:false});
            window.location.reload();
          
            
            

        }} className="mt-5" variant="secondary">Withdraw Stake</Button>
        </Modal.Body>
      
      </Modal>



      <Modal show={this.state.transactionstate} onHide={()=>{
                this.setState({transactionstate:false});
                }}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction in progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Spinner style={{marginLeft:"40%"}} animation="border" role="status"></Spinner>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
        
            <Container className="mt-5">
                <Row>
                    <Col md={4}>
                    <Card  >
                    <p className='staketitle' style={{borderTopLeftRadius:"5%",borderTopRightRadius:"5%",textAlign:"center",fontSize:"1.5rem",backgroundColor:"#674c9f",color:"white"}}>Total Value Locked</p>
                    <Card.Body>
                        <Card.Text>
                        <h4 style={{textAlign:"center"}} className='stakefont'>{this.state.total_value_locked} DRHP</h4>
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                    </Col>
                    <Col md={4}>
                    <Card>
                    <p className='staketitle' style={{borderTopLeftRadius:"5%",borderTopRightRadius:"5%",textAlign:"center",fontSize:"1.5rem",backgroundColor:"#35C5F3",color:"white"}}>DRHP Rewards Given</p>
                    <Card.Body>
                        <Card.Text>
                        <h4 style={{textAlign:"center"}} className='stakefont'>{this.state.total_rewards_given} DRHP</h4>
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                    </Col>
                    <Col md={4}>
                    <Card >
                    <p className='staketitle' style={{borderTopLeftRadius:"5%",borderTopRightRadius:"5%",textAlign:"center",fontSize:"1.5rem",backgroundColor:"black",color:"white"}}>Time Left</p>
                    <Card.Body>
                        <Card.Text>
                        <h4 style={{textAlign:"center"}} className='stakefont'> {this.state.days} d:{this.state.hours} h:{this.state.minutes} m:{this.state.seconds} s </h4>
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                    </Col>
                    <Col className="mt-5" md={12}>
                    <Card>
                    <p className='staketitle' style={{textAlign:"center",fontSize:"1.5rem",backgroundColor:"black",color:"white"}}>User Balance</p>
                    <Card.Body>
                        <Card.Text>
                        <h1 style={{textAlign:"center"}} className='stakefont'>{this.state.balance} DRHP</h1>
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                    </Col>
                    
                </Row>
            </Container>
            <Container style={{marginLeft:"20%"}} className='mt-5'>
                <div style={{paddingTop:"10px",border:"2px solid #FCFFE7",borderRadius:"5%",width:"60%"}}>
                    <p  style={{marginLeft:"30%",paddingLeft:"10px",paddingRight:"10px",color:"white",width:"fit-content",fontSize:"2rem",backgroundColor:"#E20880",fontFamily:"sans-serif"}} >STAKING POOL (DRHP)</p>
                    {/* <p style={{marginLeft:"60%",color:"#000000"}}>CURRENT APR <span style={{paddingLeft:"10px",paddingRight:"10px",color:"white",width:"fit-content",backgroundColor:"#E20880",fontFamily:"sans-serif"}}>  (10%) </span></p> */}
                    
                    <Row style={{backgroundColor:"#F1F1F1",margin:"10px 0px 0px",padding:"3%"}}>
                        <Col md={4} style={{boxShadow: "0px 5px #DEB6AB",borderRadius:"10% 10% 0 0",paddingTop:"3%",backgroundColor:"white",textAlign:"center"}}>
                            <p style={{fontSize:"10px",fontFamily:"sans-serif"}}>DRHP Price (INR)</p>
                            <p style={{fontSize:"16px"}}>10 INR</p>
                            
                        </Col>
                        <Col md={4}></Col>    

                        <Col md={4} style={{boxShadow: "0px 5px #DEB6AB",borderRadius:"10% 10% 0 0",paddingTop:"3%",backgroundColor:"white",textAlign:"center"}}>
                            <p style={{fontSize:"10px",fontFamily:"sans-serif"}}>User balance in INR</p>
                            <p style={{fontSize:"16px"}}>{this.state.balance*10} INR</p>
                            
                            </Col>
                    </Row>
                    <p className="mt-3" style={{textAlign:"right",fontSize:"12px"}}>CURRENT EPOCH :  {this.state.current_epoch_rewards+1}</p>
                    <Row style={{paddingLeft:"15%"}}>
                    <Col md={4} style={{padding:"2%",textAlign:"center",backgroundColor:"black",margin:"5px 15px"}}>
                        <p style={{color:"white"}}>Total Staked Till Now</p>
                         <Badge bg="light" text="dark">{this.state.user_total_stake} DRHP</Badge>
                    </Col> <Col md={4} style={{padding:"2%",textAlign:"center",backgroundColor:"black",margin:"5px 15px"}}>
                        <p style={{color:"white"}}>Rewards Earned Till Date</p>
                         <Badge bg="light" text="dark">{this.state.user_total_rewards} DRHP</Badge>
                    </Col>
                    </Row>
                
                    <Row style={{paddingLeft:"15%"}}>
                        <Col md={4} style={{padding:"2%",textAlign:"center",backgroundColor:"black",margin:"5px 15px"}}>
                        <p style={{color:"white"}}>Reward distributions</p>
                         <Badge bg="light" text="dark">{this.state.current_epoch_rewards}</Badge>
                        </Col>
                        <Col md={4} style={{padding:"2%",textAlign:"center",backgroundColor:"black",margin:"5px 15px"}}>
                        <p style={{color:"white"}}>Available For Harvest</p>
                         <Badge bg="light" text="dark">{this.state.available_for_harvest} DRHP</Badge>
                        </Col>
                    </Row>
                <div className='mt-5 mb-3' style={{paddingLeft:"25%"}}>
                    
                <Button onClick={()=>{
                    this.setState({show:true});
                }} variant="success" style={{marginRight:"30px"}}>Deposit</Button>
               
  <Button onClick={()=>{
      this.setState({removestakemodal:true});

  }} style={{marginRight:"30px"}} variant="outline-secondary">Withdraw</Button>

                <Button  onClick={async (e)=>{
     
     var erc20contract  = this.state.erc20contractval;
     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
     let signer = provider.getSigner();
     console.log(signer);
     var contractwithsigner = erc20contract.connect(signer);
   
     const tx = await contractwithsigner.claim_reward();
     this.setState({transactionstate:true});
     await tx.wait();
     this.setState({transactionstate:false});
     window.location.reload();
      console.log("Reward claimed");

}} variant="dark">Harvest</Button>
                </div>
                </div>
               
            </Container>
            
         
                
            </>
        );
    }
}

export default Staketoken;