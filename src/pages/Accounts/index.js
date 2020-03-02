import React, { Component } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

const moment = require("moment");


export default class Accounts extends Component {

    state = {
        accounts: [],
        loading: true
    }

    componentDidMount() {
        this.loadAccounts();
    }

    loadAccounts = async () => {
        const response = await api.get("/accounts");
        this.setState({ accounts: response.data, loading: false })

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
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.accounts.map(account => (
                                        <tr key={account.id}>
                                            <td>{account.id}</td>
                                            <td>{moment(account.created_at).format("DD/MM/YYYY")}</td>
                                            <td>{account.name}</td>
                                            <td>R$ {account.balance.toFixed(2)}</td>
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
