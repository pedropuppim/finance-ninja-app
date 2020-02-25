import React, {Component} from 'react';
import { logout } from "./../../services/auth";



export default class Logoff extends Component {
    

    componentDidMount(){
        this.logoff();
    }

    logoff = async () =>{
            logout();
            this.props.history.push("/login");
    }

    render() {
        return (

            <div></div>

        );
    }
}
