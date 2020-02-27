import React, { Component } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';


import api from "./../../services/api";
import { login, logout } from "./../../services/auth";



import './styles.css';
import logo from './../../components/Header/logo-finance-ninja.png';

export default class Login extends Component {

    state = {
        email: "",
        password: "",
        error: "",
        loading: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.auth();
    }

    auth = async () => {

        var self = this;

        logout();

        try {
            this.setState({ loading: true });
            const response = await api.post('/auth', {
                email: this.state.email,
                password: this.state.password
            });

            login(response.data);
            self.props.history.push("/invoices");

        } catch (error) {
            swal({
                title: "We were unable to authenticate.",
                text: "The data entered was not found in the database.",
                dangerMode: true
            });

            this.setState({ loading: false });
        }

    }

    render() {
        return (

            <div>

                <header className="main-header">
                    <div className="container" style={{ justifyContent: 'center' }}>
                        <h1 className="mh-logo">
                            <img src={logo} className="logo-img" alt="Finance Ninja" />
                        </h1>

                    </div>
                </header>

                {this.state.loading ? (
                    <Spinner animation="grow" className='spinner' />
                ) : (

                        <div>
                            <div className="container_login">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" required onChange={e => this.setState({ email: e.target.value })} />

                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" required onChange={e => this.setState({ password: e.target.value })} />
                                    </Form.Group>

                                    <Button variant="secondary" type="submit">
                                        Login
                                     </Button>
                                </Form>
                            </div>
                        </div>
                    )

                }

            </div>

        );
    }
}
