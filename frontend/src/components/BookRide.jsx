import { Component } from "react";
import { Container, Form, Button, Row, Col,Image } from "react-bootstrap";

import TextField from '@mui/material/TextField';
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

import { FaLocationArrow, FaTimes } from 'react-icons/fa';


  
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  
  const center = { lat: 48.8584, lng: 2.2945 }
  
  function Maps() {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyCCQlQuetd7_VFAbfWIy4yD8xjxEoAjmzI",
      libraries: ['places'],
    })
  
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [source, setsource] = useState(props.source);
    const [destination, setdestination] = useState(props.destination);
    
  
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
  
    if (!isLoaded) {
      return <SkeletonText />
    }
  
    async function calculateRoute() {
      if (originRef.current.value === '' || destiantionRef.current.value === '') {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: source,
        destination: destination,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    }
  
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destiantionRef.current.value = ''
    }
  
    return (
      <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        h='100vh'
        w='100vw'
      >
        <Box position='absolute' left={0} top={0} h='100%' w='50%'>
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
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        <Box
          p={4}
          borderRadius='lg'
          m={4}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <HStack spacing={2} justifyContent='space-between'>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input 
                type='text' placeholder='Origin' ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type='text'
                  placeholder='Destination'
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>
  
            <ButtonGroup>
              <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
            <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            />
          </HStack>
        </Box>
      </Flex>
    )
  }
 

class BookRide extends Component{
    constructor(props){
        super(props);
        this.state={
         source:"",
         destination:""
            
        }
       
    }
    
    
    render(){
        return(
            <>
            <Container fluid style={{backgroundColor:"#EEEEEE"}}>
            <Row>
            <Col md={6}>
            <div className="" style={{height:"fit-content"}}>
            <h1>Get Started,</h1>
            <h1>Book A Ride</h1>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Enter Source</Form.Label>
                <Autocomplete>
                <Input 
                type='text' placeholder='Origin' onChange={(e)=>{
                    this.setState({source:e.target.value})
                }} />
              </Autocomplete>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enter Destination</Form.Label>
                <Autocomplete>
                <Input 
                type='text' placeholder='Origin' onChange={(e)=>{
                    this.setState({destination:e.target.value})
                }} />
              </Autocomplete>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
            </Form.Group>
            {/* <TextField  style={{width:"50%"}} id="standard-basic" label="Enter Source" variant="standard" />
            <TextField  style={{width:"50%"}} id="standard-basic" label="Enter Destination" variant="standard" />
             */}
            </Form>
            <Button className="mt-5" variant="primary"  style={{marginLeft:"40%"}}>
                Book Ride
            </Button>
            </div>

            </Col>
            <Col md={6}>
                <Maps/>
            </Col>
            </Row>
            </Container>
           
            
            </>
        )
    }
}


export default BookRide;