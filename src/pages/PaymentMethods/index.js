import React, { Component } from 'react';
import api from "../../services/api";
import Header from "../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

import AddPaymentMethod, { EditPaymentMethod } from "./add";

const moment = require("moment");


export default class PaymentMethods extends Component {

    state = {
        payment_methods: [],
        loading: true
    }

    componentDidMount() {
        this.loadpayment_methods();
    }

    loadpayment_methods = async () => {
        const response = await api.get("/payment_methods");
        this.setState({ payment_methods: response.data, loading: false })
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
                                <p><AddPaymentMethod loader={this.loadpayment_methods} /></p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data da Criação</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.payment_methods.map(payment_method => (
                                            <tr key={payment_method.id}>
                                                <td><EditPaymentMethod loader={this.loadpayment_methods} PaymentMethodId={payment_method.id} /></td>
                                                <td>{payment_method.id}</td>
                                                <td>{moment(payment_method.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{payment_method.name}</td>
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
