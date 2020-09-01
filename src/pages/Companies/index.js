import React, { Component } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

import AddCompany, { EditCompany } from "./add";

const moment = require("moment");


export default class Companies extends Component {

    state = {
        companies: [],
        loading: true
    }

    componentDidMount() {
        this.loadCompanies();
    }

    loadCompanies = async () => {
        const response = await api.get("/companies");
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

                            <div>
                                <p><AddCompany loader={this.loadCompanies} /></p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data de Criação</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.companies.map(company => (
                                            <tr key={company.id}>
                                                <td><EditCompany loader={this.loadCompanies} companyId={company.id} /></td>
                                                <td>{company.id}</td>
                                                <td>{moment(company.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{company.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )
                    }
                </div>
            </div>

        );
    }
}
