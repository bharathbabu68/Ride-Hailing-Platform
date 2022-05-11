import react, { Component } from "react";
import { Image } from "react-bootstrap";

import { Container, Navbar, Nav } from "react-bootstrap";


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
         <Navbar expand="lg"
            style={{backgroundColor: 'black', color:'white'}} 

        >
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
              <Navbar.Brand href="/explore" className="navbrandname">
              </Navbar.Brand>

              <Navbar.Brand href="/explore" className="navbrandname">
              <h2 style={{color:"white", fontWeight:'light'}}>RideShare</h2>
              </Navbar.Brand>
            
            <Navbar.Collapse id="basic-navbar-nav" >
              
              <Nav 
                style={{padding:"10px"}}
              className="ml-auto mr-3">

              <div className="navdiv navstyle ">
                  <Nav.Link 
                  style={{color:"white", fontWeight:"bolder", marginRight:'30px'}}
                  href="/" className=" navlinks">
                    Home
                  </Nav.Link>
                </div>
               
                <div className="navdiv  navstyle ">
                  <Nav.Link 
                  style={{color:"white", fontWeight:"bolder", marginRight:'30px'}}
                   href="/bookride" className=" navlinks">
                    Book Ride
                  </Nav.Link>
                </div>

                <div className="navdiv navstyle ">
                  <Nav.Link  
                  id="name"
                  style={{color:"white", fontWeight:"bolder", marginRight:'30px'}}
                  href="/purchase" className=" navlinks" onClick={()=>{
                  }}>
                    Buy Tokens
                  </Nav.Link>
                </div>

                <div className="navdiv navstyle ">
                  <Nav.Link  
                  id="name"
                  style={{color:"white", fontWeight:"bolder", marginRight:'30px'}}
                  href="#" className=" navlinks" onClick={()=>{
                  }}>
                    Staking
                  </Nav.Link>
                </div>

                <div className="navdiv navstyle ">
                  <Nav.Link  
                  id="name"
                  style={{color:"white", fontWeight:"bolder", marginRight:'30px'}}
                  href="#" className=" navlinks" onClick={()=>{
                  }}>
                    Governance
                  </Nav.Link>
                </div>

                <div className="navdiv navstyle ">
                  <Nav.Link  
                  id="name"
                  style={{color:"white", fontWeight:"bolder", marginLeft:'600px'}}
                  href="/login" className=" navlinks" onClick={()=>{
                  }}>
                    Login
                  </Nav.Link>
                </div>
                
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
       
      </div>
    );
  }
}

export default NavBar;