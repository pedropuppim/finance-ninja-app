import React, { Component } from 'react';
import api from "../../services/api";
import Header from "../../components/Header";
import './styles.css';
import { Table, Badge, Spinner, Button } from 'react-bootstrap';

import AddInvoice, { EditInvoice } from "./add";

const moment = require("moment");

export default class Invoices extends Component {

    state = {
        invoices: [],
        accounts: [],
        pagination: [],
        loading: true,
        loading_table: false
    }

    componentDidMount() {
        this.loadInvoices();
        this.loadAccounts();
    }

    loadInvoices = async (resetPage = null) => {

        var currentPage = (resetPage) ? 1 : this.state.pagination.currentPage || 1;

        const response = await api.get("/invoices?page=" + currentPage)
        this.setState({ invoices: response.data.data, pagination: response.data.pagination, loading: false, loading_table: false })
    }

    loadAccounts = async () => {

        const response = await api.get("/accounts");
        this.setState({ accounts: response.data });

    }


    pagination = async (ptype) => {
        var pagination = this.state.pagination;

        if (ptype === "previous") {
            if (pagination.currentPage > 1) {
                this.setState({ loading_table: true });
                pagination.currentPage = parseInt(pagination.currentPage) - 1;
            } else {
                return;
            }
        }

        if (ptype === "next") {
            if (pagination.currentPage < pagination.lastPage) {
                this.setState({ loading_table: true });
                pagination.currentPage = parseInt(pagination.currentPage) + 1;
            } else {
                return;
            }
        }

        this.setState({ pagination: pagination })
        this.loadInvoices();

    }


    render() {

        const self = this.state;

        const page = parseInt(self.pagination.currentPage) || 1;
        const lastPage = parseInt(self.pagination.lastPage);

        let spinner_table = "";

        if (this.state.loading_table) {
            spinner_table = <Spinner animation="border" variant="light" className='spinner_table' />
        }

        return (

            <div>
                <Header />


                <div className="container_bill">



                    {spinner_table}

                    {this.state.loading ? (
                        <Spinner animation="grow" className='spinner' />
                    ) : (

                            <div>
                                <p>
                                    <AddInvoice loader={this.loadInvoices} accounts={self.accounts} />
                                </p>

                                <Table striped bordered hover responsive variant="dark">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Account</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.invoices.map(invoice => (
                                            <tr key={invoice.id}>
                                                <td><EditInvoice loader={this.loadInvoices} accounts={self.accounts} invoice_id={invoice.id} /></td>
                                                <td>{invoice.id}</td>
                                                <td>{moment(invoice.created_at).format("DD/MM/YYYY")}</td>
                                                <td>R$ {invoice.amount.toFixed(2)}</td>
                                                <td>{invoice.name_account}</td>
                                                <td>{invoice.description}</td>
                                                <td><Badge variant={invoice.css_status}>{invoice.name_status}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="dark" disabled={page === 1} onClick={() => this.pagination('previous')}>Previous</Button>
                                <Button variant="dark" disabled={page === lastPage} onClick={() => this.pagination('next')} style={{ float: "right" }}>Next</Button>
                            </div>


                        )

                    }

                </div>

            </div>

        );
    }
}
