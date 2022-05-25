import react, { Component } from "react";
import { Image } from "react-bootstrap";

import { Container, Navbar, Nav } from "react-bootstrap";


class NavBarLogin extends Component {
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
            </Navbar.Collapse>
          </Container>
        </Navbar>
       
      </div>
    );
  }
}

export default NavBarLogin;