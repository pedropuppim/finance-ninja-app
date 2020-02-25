import React, {Component} from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap'; 

const moment = require("moment");


export default class Providers extends Component {
    
    state = {
        providers: [],
        loading: true
    }

    componentDidMount(){
        this.loadAccounts();
    }

    loadAccounts = async () =>{
        const response = await api.get("/customers");
        this.setState({ providers: response.data.data, loading: false})
    }


    render() {
        return (

        <div>
            <Header/>
                <div className="container_bill">

                {this.state.loading ? (
                    <Spinner animation="grow" className='spinner' />
                    ) : (
                    <Table striped bordered hover responsive variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date Created</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.providers.map(provider => (
                        <tr key={provider.id}>
                                <td>{provider.id}</td>
                                <td>{moment(provider.created_at).format("DD/MM/YYYY")}</td>
                                <td>{provider.name}</td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                    )
                   }
                </div>
        </div>

        );
    }
}
