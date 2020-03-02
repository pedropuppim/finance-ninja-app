import React, { Component } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

const moment = require("moment");


export default class Companies extends Component {

    state = {
        customers: [],
        loading: true
    }

    componentDidMount() {
        this.loadAccounts();
    }

    loadAccounts = async () => {
        const response = await api.get("/Companies");
        this.setState({ companies: response.data, loading: false })
    }


    render() {
        return (

            <div>
                <Header />
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
                                    {this.state.companies.map(company => (
                                        <tr key={company.id}>
                                            <td>{company.id}</td>
                                            <td>{moment(company.created_at).format("DD/MM/YYYY")}</td>
                                            <td>{company.name}</td>
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
