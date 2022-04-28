import {Component} from 'react';
import Home from './Home';
import Maps from './Maps';
import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";

class Main extends Component{

    constructor(props){
        super(props);
    }

    render(){

        return(
            <>
               
                <BrowserRouter>
                <Switch>

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