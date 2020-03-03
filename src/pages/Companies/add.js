import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit2.png';


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

    const saveItem = async () => {

        const { name } = values;

        if (props.companyId) {
            await api.put('/companies/' + props.companyId, {
                name
            });
        } else {
            await api.post('/companies', {
                name
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
                    <Modal.Title>New Company {props.companyId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Saved successfully</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="description">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={values.name} required />
                            </Form.Group>


                            <Modal.Footer>
                                <Button variant="dark" type="submit"> Save </Button>
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
                New
            </Button>

            <ModalCompany show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddCompany;