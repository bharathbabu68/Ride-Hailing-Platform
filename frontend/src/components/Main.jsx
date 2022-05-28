import {Component} from 'react';
import Home from './Home';
import Maps from './Maps';
import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Buytoken from './Buytoken';
import PaymentPage from './PaymentPage';
import Staketoken from './Staketoken';
import DriverDashboard from './DriverDashboard';
import Login from './Login';

import Journey from './Journey';

class Main extends Component{

    constructor(props){
        super(props);
    }

    render(){

        return(
            <>
               
                <BrowserRouter>
                <Switch>

                    <Route path="/payment">
                        <PaymentPage/>
                    </Route>

                    <Route path="/purchase">
                        <Buytoken/>
                    </Route>

                    <Route path="/driver">
                        <DriverDashboard/>
                    </Route>
                    
                    <Route path="/staking">
                            <Staketoken/>
                    </Route>
                    

                    <Route path="/journey">
                        <Journey/>
                    </Route>

                    <Route path="/home">
                        <Login/>
                    </Route>

                    <Route path="/ride">
                        <Maps/>
                    </Route>

                    <Route path="/">
                        <Login/>
                    </Route> 
                
                </Switch>
                </BrowserRouter>
            
            </>
        );
    }
}

export default Main;