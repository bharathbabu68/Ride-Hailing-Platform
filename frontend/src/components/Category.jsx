import { Component } from "react";
import NavBar from "./NavBar";
import { Container, Row, Col, Card, Button, Dropdown ,Spinner,Modal,Form, Carousel, Toast } from "react-bootstrap";
const { ethers } = require("ethers");

class Category extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentWillMount = () => {
        console.log("componentDidMount");
        console.log(this.props.match.params.catId); // this is 595212758daa6810cbba4104 
        console.log(this.props.location.param1);
    }

    render(){
        
        return(
            <>
                <NavBar />

            </>
        );
    }

}

export default Category;