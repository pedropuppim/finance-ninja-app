import React, {useState} from 'react'
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import swal from 'sweetalert';
import { useHistory } from "react-router-dom";

import api from "./../../services/api";

import './styles.css';
import logo from './../../components/Header/logo-finance-ninja.png';


export default function NewUser() {

    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({ name: '', email: '', password: '', password2: '' });
    const [validPassword, setvalidPassword] = useState('');
    const [validEmail, setvalidEmail] = useState('');

    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const verifyEmail = async () => {

        const { email } = values;

        try {
            setvalidEmail(false);
            const response = await api.post('/users/verify_email', {
                email
            });

            if (response.data.email){
                setvalidEmail(true);
            }

        } catch (error) {
            console.log(error);
        }

    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {

            setvalidPassword(false);
            
            if (values.password !== values.password2){
                setvalidPassword(true);
                return 
            } 

            if (!validPassword && !validEmail){
                setLoading(true);
                register();
                setLoading(false);
            }


        } catch (error) {
            console.log(error);
        }

    }


    const history = useHistory();

    const register = async () => {

        try {
            const { name, email, password, password2 } = values;

            await api.post('/users', {
                name, email, password, password2
            });
           
            swal({
                title: "Cadastro Efetuado com sucesso",

                icon: "success"
            });

            history.push("/login");

        } catch (error) {
            swal({
                title: "Tente novamente",
                text: "Não foi possível realizar o cadastro",
                dangerMode: false
            });

            setLoading(false);
        }


    }


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
                        <Form onSubmit={handleSubmit}>

                        <Form.Group controlId="formBasicName">
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control type="text" placeholder="Enter seu nome" name="name" required onChange={handleInputChange} value={values.name} />

                            </Form.Group>


                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address:</Form.Label>
                                <Form.Control type="email" onBlur={() => verifyEmail()} placeholder="Enter email" name="email" required onChange={handleInputChange} value={values.email} />

                            </Form.Group>

                            <Alert show={Boolean(validEmail)} variant='danger'>E-mail já está em utilização</Alert>


                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Senha:</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="password" required onChange={handleInputChange} value={values.password} />
                            </Form.Group>
                            
                            <Form.Group controlId="formBasicPassword2">
                                <Form.Label>Confirmação Senha:</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="password2" required onChange={handleInputChange} value={values.password2} />
                            </Form.Group>

                            <Alert show={Boolean(validPassword)} variant='danger'>As senhas não conferem</Alert>


                            <Button variant="secondary" type="submit">
                                Cadastrar
                             </Button>
                        </Form>
                    </div>
                </div>
            )

        }

    </div>

    )
}

