import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container, Col } from 'react-bootstrap';
import api from "../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit.png';


export const EditUser = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalUser show={show} loader={props.loader} userId={props.userId} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export const ModalUser = (props) => {

    const [values, setValues] = useState({ name: '', email: '', password: '', password2: '', admin: "0" });
    const [msgSuccess, setSuccess] = useState('');
    const [validPassword, setvalidPassword] = useState('');
    const [validEmail, setvalidEmail] = useState('');

    const loadItem = async () => {
        const user = await api.get('/users/' + props.userId);
        setValues({...user.data, password: '', password2: ''});
    }


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const removeItem = async (id) =>{

        try {
            if (window.confirm("Você realmente deseja remover esse usuário?")) {
                await api.delete('/users/' + id);

                setSuccess('Removido com sucesso.');
                setTimeout(e => {
                    props.handleClose();
                    setValues({ name: '' });
                    setSuccess(false);
                }, 1500);

                props.loader('reset');
            }
        } catch (error) {
            console.log(error);
        }

  
    }

    const saveItem = async () => {

        const { name, email, password, password2, admin } = values;

        if (props.userId) {
            await api.put('/users/' + props.userId, {
                name, email, password, password2, admin
            });
        } else {
            await api.post('/users', {
                name, email, password, password2, admin
            });
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
                await saveItem();
                setSuccess('Salvo com sucesso.');
                setTimeout(e => {
                    props.handleClose();
                    setValues({ name: '' });
                    setSuccess(false);
                }, 1500);
                props.loader('reset');
            }


        } catch (error) {
            console.log(error);
        }

    }

    if (props.show && props.userId && !values.name) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Usuário {props.userId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={Boolean(msgSuccess)} variant="success">{msgSuccess}</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="name">
                                <Form.Label>Nome: </Form.Label>
                                <Form.Control type="text" name="name" onChange={handleInputChange} value={values.name} required />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>E-mail: </Form.Label>
                                <Form.Control type="text" onBlur={() => verifyEmail()} required autoComplete="new-email" name="email"  onChange={handleInputChange} value={values.email}  />
                            </Form.Group>

                            <Alert show={Boolean(validEmail)} variant='danger'>E-mail já está em utilização</Alert>


                            <Form.Row>
                                <Col>
                                    <Form.Group controlId="password">
                                        <Form.Label>Senha: </Form.Label>
                                            <Form.Control required={!props.userId} autoComplete="off" type="password"  name="password"  onChange={handleInputChange} value={values.password} />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group  controlId="password2">
                                        
                                        <Form.Label>Confirmação Senha: </Form.Label>
                                        <Form.Control required={!props.userId} autoComplete="off" type="password"   name="password2" onChange={handleInputChange} value={values.password2} />
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Alert show={Boolean(validPassword)} variant='danger'>As senhas não conferem</Alert>

                            <Form.Group controlId="admin">
                            <Form.Label>Tipo:</Form.Label>
                                <Form.Control as="select" name="admin" onChange={handleInputChange} value={values.admin}>
                                        <option value='0'>Regular</option>
                                        <option value='1'>admin</option>
                                    </Form.Control>
                            </Form.Group>

                            <Modal.Footer>
                                {props.userId &&
                                    <Button variant="danger" onClick={() => removeItem(props.userId)}> Excluir </Button>
                                }
                                <Button variant="dark" type="submit"> Salvar </Button>
                            </Modal.Footer>

                        </Form>
                    </Container>
                </Modal.Body>

            </Modal>
        </>
    );
}

export const AddUser = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalUser show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddUser;