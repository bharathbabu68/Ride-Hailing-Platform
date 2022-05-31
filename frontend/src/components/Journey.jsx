import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { Container, Row, Col, Card, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState,useEffect } from 'react'
import NavBar from './NavBar'
import addresses from './address';
import { ride_abi } from '../Resources/ride_abi'; 

const center = { lat: 12.9480, lng: 80.1397 }
const { ethers } = require("ethers");

function Journey() {


  const [accountaddr, setaccountaddr] = useState('');
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [ridecostinr, setRidecostinr] = useState('')
  const [ridecostdrhp, setRidecostdrhp] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [dummy, setDummy] = useState('')
  const [isMenuOpen,SetMenuOpen] = useState(false);
  const [driverAddress, setDriverAddress] = useState('');


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCCQlQuetd7_VFAbfWIy4yD8xjxEoAjmzI",
    libraries: ['places'],
  })


  useEffect(async () => {

    await connect();
   
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const accountaddress = await signer.getAddress();
    setaccountaddr(accountaddress);
   
    var key={user_address:accountaddress};

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
          // check if res is not null
          if(res["driver_details"].length==0 || res["driver_details"][0]["status"]!=2){
            alert("Your ride is invalid");
            window.location.href = "/";
          }
          
          calculateRoute(res["driver_details"][0]["source"],res["driver_details"][0]["destination"]);
            
            await setOrigin(res["driver_details"][0]["source"]);
            await setDestination(res["driver_details"][0]["destination"]);
            await setDistance(res["driver_details"][0]["distance"]);
            await setDuration(res["driver_details"][0]["duration"]);
            await setRidecostinr(res["driver_details"][0]["ridecostinr"]);
            await setRidecostdrhp(res["driver_details"][0]["ridecostdrhp"]);
            await setDriverAddress(res["driver_details"][0]["driver_address"]);
           
            

        })
  
  }, []);

  
  const [b,setb]=useState(0)




  const [connectwalletstatus,setconnectwalletstatus] = useState("Connect wallet");
  // modal related stuff
  const [showsearchingdriver, setShowsearchingdriver] = useState(false);
  const handleClose = () => setShowsearchingdriver(false);
  const handleShow = () => {
    setShowsearchingdriver(true);
    // close modal after 5 seconds
    setTimeout(() => {
      setShowsearchingdriver(false);
      handleShowFoundDriverModal();
    }
    , 5000);
  }

  const [FoundDriverModal, setFoundDriverModal] = useState(false);
  const handleCloseFoundDriverModal = () => setFoundDriverModal(false);
  const handleShowFoundDriverModal = () => {
    setFoundDriverModal(true);
  }


  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function connect(){
    console.log("connect");
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account2 = await signer.getAddress();
   
}

  function toggleMenu() {
    SetMenuOpen(!isMenuOpen);
  }

  async function calculateRoute(originRef,destiantionRef) {
    console.log(originRef,destiantionRef);

    if (originRef=== '' || destiantionRef=== '') {
      return
    }
    
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef,
      destination: destiantionRef,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
   
    setDestination(destiantionRef)
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    setRidecostinr(results.routes[0].legs[0].distance.value/1000*6)
    setRidecostdrhp(results.routes[0].legs[0].distance.value/10000*6)
    setb(1);
  }

  function changeHeight() {
    document.getElementById('ride-box').style.height = "350px"
    }

  function clearRoute() {
    setb(0)
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setRidecostinr('')
    setRidecostdrhp('')
    
  }
  function renderdistance()
  {
      if(b==0)
      {
        return <div></div>
      }
      else{
        return(
          <div>
             <h5 style={{fontFamily:'Roboto', color:"white"}}>Distance: {distance}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Duration: {duration}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Cost (in DRHP tokens): {ridecostdrhp}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Cost (in INR): {ridecostinr}</h5>
            <br/>
            
          </div>
        );
      }
  }

 


  return (
    <>
    <NavBar/>
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      {/* <Button style={{position:"relative", top:"10px", right:"0px"}} variant='dark' onClick={clearRoute}>{connectwalletstatus}</Button> */}
      <Box position='absolute' top={30} right={50}
        borderRadius='lg'
        m={4}
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
            <div id="ride-box" zIndex='1' style={{height:"fit-content", width:"25rem",padding: "20px",borderRadius:"15px"}}>
            <h1 style={{fontFamily:'Roboto', color:"white"}}>Ride in Progress !</h1>
            <br/>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Origin: {origin}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Destination: {destination}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Distance: {distance}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Duration: {duration}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Cost (in DRHP tokens): {ridecostdrhp}</h5>
            <h5 style={{fontFamily:'Roboto', color:"white"}}>Cost (in INR): {ridecostinr}</h5>
            <hr/>
            <Row>
            <Col md={4}>
          <Button className="mb-5 mt-2" style={{position:"relative", top:"10px", right:"0px"}} variant='dark' onClick={async ()=>{
                const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                let ridecontractaddress = addresses["ridebooking_contract_address"]
                let ridecontract = new ethers.Contract(ridecontractaddress, ride_abi, provider);
                let signer = provider.getSigner();
                var contractwithsigner = ridecontract.connect(signer);
                const tx = await contractwithsigner.complete_ride_by_passenger(driverAddress);
                await tx.wait();
                var key={driver_address:driverAddress};
                fetch('http://localhost:4000/completeride',{
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
                            alert("Ride Completed Successfully, thanks for riding !");
                            window.location.href = "/";
                        }
                        );

          }} >End Ride</Button>
          </Col>
          <Col md={4}>
          <Button style={{position:"relative", top:"10px", right:"0px"}} className='mb-5 mt-2' variant='dark' onClick={async ()=>{
            alert("Your SOS request has been sent to the authorities and your location has been shared !");
          }} >SOS</Button>
          </Col>
          </Row>
         
            <br/>
           

           
          </div>
    
          
      </Box>

   


    </Flex>
    </>
  )
}

export default Journey;