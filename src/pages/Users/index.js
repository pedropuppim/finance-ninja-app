import React, { Component } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner, Badge } from 'react-bootstrap';

import AddUser, { EditUser } from "./add";

const moment = require("moment");


export default class Users extends Component {

    state = {
        users: [],
        loading: true
    }

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = async () => {
        const response = await api.get("/users");
        this.setState({ users: response.data, loading: false })
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
                                <p><AddUser loader={this.loadUsers} /></p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data da Criação</th>
                                            <th>Nome</th>
                                            <th>E-mail</th>
                                            <th>Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.users.map(user => (
                                            <tr key={user.id}>
                                                <td><EditUser loader={this.loadUsers} userId={user.id} /></td>
                                                <td>{user.id}</td>
                                                <td>{moment(user.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                               
                                                    <Badge variant={ user.admin === "1"  ? "primary" :  "secondary"}>{ user.admin === "1"  ? 'admin' :  'regular'}</Badge>

                                                </td>
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
