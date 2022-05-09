import {Component} from 'react';
import Home from './Home';
import Maps from './Maps';
import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import BookRide from './BookRide';
import RideBooking from './RideBooking';
import Makepayment from './Makepayment';
import Buytoken from './Buytoken';
class Main extends Component{

    constructor(props){
        super(props);
    }

    render(){

        return(
            <>
               
                <BrowserRouter>
                <Switch>

                    <Route path="/a">
                        <Makepayment/>
                    </Route>
                    <Route path="/b">
                        <Buytoken/>
                    </Route>
                    

                    <Route path="/bookride">
                            <BookRide/>
                    </Route>

                    <Route path="/maps">
                        <Maps/>
                    </Route>

                    <Route path="/">
                        <Home/>
                    </Route>
                
                </Switch>
                </BrowserRouter>
            
            </>
        );
    }
}

export default Main;