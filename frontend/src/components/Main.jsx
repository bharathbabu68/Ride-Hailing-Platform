import {Component} from 'react';
import Home from './Home';
import Maps from './Maps';
import Category from "./Category";
import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";

import Buytoken from './Buytoken';
import PaymentPage from './PaymentPage';
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

                    <Route path="/bookride">
                            <Maps/>
                    </Route>

                    <Route path="/">
                        <Maps/>
                    </Route>
                
                </Switch>
                </BrowserRouter>
            
            </>
        );
    }
}

export default Main;