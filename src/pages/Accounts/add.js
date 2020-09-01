import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit.png';
import CurrencyInput from 'react-currency-input';
import valueDb from '../../utils/money';

export const EditAccount = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Account" />
            <ModalAccount show={show} loader={props.loader} accountId={props.accountId} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export const ModalAccount = (props) => {

    const [values, setValues] = useState({ name: '', balance: '' });
    const [msgSuccess, setSuccess] = useState(false);

    const loadItem = async () => {
        const account = await api.get('/accounts/' + props.accountId);
        setValues(account.data);
    }


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const saveItem = async () => {

        var { name, balance } = values;
        balance = valueDb(balance);

        if (props.accountId) {
            await api.put('/accounts/' + props.accountId, {
                name,
                balance
            });
        } else {
            await api.post('/accounts', {
                name,
                balance
            });
        }


    }

    const removeItem = async (id) => {

        try {
            if (window.confirm("Você realmente deseja remover essa Conta?")) {
                await api.delete('/accounts/' + id);

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

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await saveItem();
            setSuccess(true);
            setTimeout(e => {
                props.handleClose();
                setValues({ name: '', balance: '' });
                setSuccess(false);
            }, 1500);
            props.loader('reset');


        } catch (error) {
            console.log(error);
        }

    }

    if (props.show && props.accountId && !values.name) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Conta {props.accountId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Salvo com sucesso</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="description">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={values.name} required />
                            </Form.Group>

                            <Form.Group controlId="Balance">
                                <Form.Label>Balance: </Form.Label>
                                <CurrencyInput decimalSeparator="," thousandSeparator="." className="input_bootstrap" name="balance" required onChange={handleInputChange} value={values.balance} />
                            </Form.Group>

                            <Modal.Footer>
                                {props.accountId &&
                                    <Button variant="danger" onClick={() => removeItem(props.accountId)}> Excluir </Button>
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

export const AddAccount = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalAccount show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddAccount;