import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit.png';


export const EditCompany = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalCompany show={show} loader={props.loader} companyId={props.companyId} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export const ModalCompany = (props) => {

    const [values, setValues] = useState({ name: '' });
    const [msgSuccess, setSuccess] = useState(false);

    const loadItem = async () => {
        const company = await api.get('/companies/' + props.companyId);
        setValues(company.data);
    }


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }


    const removeItem = async (id) => {

        try {
            if (window.confirm("Você realmente deseja remover esse Cliente/Fornecedor?")) {
                await api.delete('/companies/' + id);

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

        const { name, tel_number, zip, street, number,complement, neighborhood, city, state } = values;

        if (props.companyId) {
            await api.put('/companies/' + props.companyId, {
                name, tel_number, zip, street, number,complement, neighborhood, city, state
            });
        } else {
            await api.post('/companies', {
                name, tel_number, zip, street, number,complement, neighborhood, city, state
            });
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

    if (props.show && props.companyId && !values.name) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Cliente/Fornecedor {props.companyId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Salvo com sucesso</Alert>
                        <Form onSubmit={handleSubmit}>


                        <Row>
                            <Col xs={7}>
                                <Form.Group controlId="name">
                                    <Form.Label>Nome: </Form.Label>
                                    <Form.Control type="text" name="name" placeholder="" onChange={handleInputChange} value={values.name} required />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group controlId="number">
                                    <Form.Label>Telefone: </Form.Label>
                                    <Form.Control type="text" name="tel_number" maxLength="12" onChange={handleInputChange} value={values.tel_number} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="zip">
                                    <Form.Label>Cep: </Form.Label>
                                    <Form.Control type="text" name="zip" placeholder="" onChange={handleInputChange} value={values.zip} required />
                                </Form.Group>

                            </Col>
                            <Col xs={8}>
                                <Form.Group controlId="street">
                                    <Form.Label>Rua: </Form.Label>
                                    <Form.Control type="text" name="street" onChange={handleInputChange} value={values.street} required />
                                </Form.Group>
                            </Col>
        
                        </Row>

                        <Row>

                            <Col xs={3}>
                                <Form.Group controlId="complement">
                                    <Form.Label>Numero: </Form.Label>
                                    <Form.Control type="text" name="complement" onChange={handleInputChange} value={values.complement} required />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="number">
                                    <Form.Label>Complemento: </Form.Label>
                                    <Form.Control type="text" name="number" onChange={handleInputChange} value={values.number} required />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="neighborhood">
                                    <Form.Label>Bairro: </Form.Label>
                                    <Form.Control type="text" name="neighborhood" onChange={handleInputChange} value={values.neighborhood} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="city">
                                    <Form.Label>Cidade: </Form.Label>
                                    <Form.Control type="text" name="city" onChange={handleInputChange} value={values.city} required />
                                </Form.Group>
                            </Col>

                            <Col xs={3}>
                                <Form.Group controlId="state">
                                    <Form.Label>Estado: </Form.Label>
                                    <Form.Control type="text" name="state" maxLength="2" onChange={handleInputChange} value={values.state} required />
                                </Form.Group>
                            </Col>
    
                        </Row>

                            <Modal.Footer>
                                {props.companyId &&
                                    <Button variant="danger" onClick={() => removeItem(props.companyId)}> Excluir </Button>
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

export const AddCompany = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalCompany show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddCompany;