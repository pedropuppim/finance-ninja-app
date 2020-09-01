import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container } from 'react-bootstrap';
import api from "../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit.png';


export const EditPaymentMethod = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalPaymentMethod show={show} loader={props.loader} PaymentMethodId={props.PaymentMethodId} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export const ModalPaymentMethod = (props) => {

    const [values, setValues] = useState({ name: '' });
    const [msgSuccess, setSuccess] = useState(false);

    const loadItem = async () => {
        const payment_method = await api.get('/payment_methods/' + props.PaymentMethodId);
        setValues(payment_method.data);
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

        const { name } = values;

        if (props.PaymentMethodId) {
            await api.put('/payment_methods/' + props.PaymentMethodId, {
                name
            });
        } else {
            await api.post('/payment_methods', {
                name
            });
        }


    }

    const removeItem = async (id) => {

        try {
            if (window.confirm("Você realmente deseja remover esse método de pagamento?")) {
                await api.delete('/payment_methods/' + id);

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
                setValues({ name: '' });
                setSuccess(false);
            }, 1500);
            props.loader('reset');


        } catch (error) {
            console.log(error);
        }

    }

    if (props.show && props.PaymentMethodId && !values.name) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Método de Pagamento {props.PaymentMethodId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Salvo com sucesso</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="description">
                                <Form.Label>Nome: </Form.Label>
                                <Form.Control type="text" name="name" placeholder="Método de Pagamento" onChange={handleInputChange} value={values.name} required />
                            </Form.Group>


                            <Modal.Footer>
                                {props.PaymentMethodId &&
                                    <Button variant="danger" onClick={() => removeItem(props.PaymentMethodId)}> Excluir </Button>
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

export const AddPaymentMethod = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalPaymentMethod show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddPaymentMethod;