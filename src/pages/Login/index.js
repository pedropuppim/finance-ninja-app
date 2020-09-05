import React, { useState, useEffect } from 'react';
import { useHistory, Link } from "react-router-dom";

import { Button, Form, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import decode from 'jwt-decode';

import api from "./../../services/api";
import { login, logout } from "./../../services/auth";



import './styles.css';
import logo from './../../components/Header/logo-finance-ninja.png';
import loginGoogle from './../../assets/images/btn_google_signin_light_normal_web.png';


export default function Login() {

    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({ nome: '', email: '', password: '', password2: '' });


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        auth();
    }

    const history = useHistory();


    const auth = async () => {

        logout();

        try {
            setLoading(true);
            const response = await api.post('/auth', {
                email: values.email,
                password: values.password
            });
            
            login(response.data);
            history.push("/invoices");
            

        } catch (error) {

           
            swal({
                title: "Não foi possível realizar a autenticação.",
                text: "Os dados inseridos não foram encontrados na base de dados",
                dangerMode: true
            });

            setLoading(false);
        }

    }

    useEffect(() => {
        let token = (new URLSearchParams(window.location.search)).get("token");
        if (token){
            setLoading(true);
            var payload = decode(token);
            payload['token']=token;
            login(payload);
            history.push("/invoices");
        }
    }, [history])

        return (

            <div>

                <header className="main-header">
                    <div className="container" style={{ justifyContent: 'center' }}>
                        <h1 className="mh-logo">
                            <img src={logo} className="logo-img" alt="Finance Ninja" />
                        </h1>

                    </div>
                </header>

                {loading ? (
                    <Spinner animation="grow" className='spinner' />
                ) : (

                        <div>
                            <div className="container_login">
                            <div className='div-center'> 

                                <a href='https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback%2F&scope=openid%20email%20profile&client_id=72605505433-fo2f3d05r9k0upjmkda92kipp7skkn5f.apps.googleusercontent.com&flowName=GeneralOAuthFlow'>
                                    <img src={loginGoogle}  alt="Entrar com Google" />
                                </a>
                                
                                <br /><Link to="/new_user">Registrar</Link><br />
                            </div>
                            <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" name="email" required onChange={handleInputChange} value={values.email} />

                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="password" required onChange={handleInputChange} value={values.password} />
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
