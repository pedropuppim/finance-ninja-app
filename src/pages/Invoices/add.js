import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import DatePicker from "react-datepicker";
import ButtonEdit from './images/edit2.png';
import CurrencyInput from 'react-currency-input';


import "react-datepicker/dist/react-datepicker.css";

export const EditInvoice = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalInvoice show={show} loader={props.loader} invoiceId={props.invoiceId} handleClose={handleClose} handleShow={handleShow} accounts={props.accounts} companies={props.companies} />


        </>
    );
}

export const ModalInvoice = (props) => {

    const [values, setValues] = useState({ amount: '', dt_duedate: '', account_id: '', company_id: '', description: '', status: '', type: '' });
    const [dt_duedate, setStartDate] = useState(new Date());
    const [msgSuccess, setSuccess] = useState(false);

    const loadItem = async () => {
        const invoice = await api.get('/invoices/' + props.invoiceId);
        setValues(invoice.data);

        const dt_duedate_formated = invoice.data.dt_duedate.split('T')[0];
        var duedateDate = new Date(dt_duedate_formated);
        setStartDate(duedateDate);
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

        const { amount, account_id, company_id, description, status, type } = values;
        const dt_duedate_formated = dt_duedate.toISOString().split('T')[0];

        if (props.invoiceId) {
            await api.put('/invoices/' + props.invoiceId, {
                amount,
                dt_duedate: dt_duedate_formated,
                account_id,
                company_id,
                status,
                type,
                description
            });
        } else {
            await api.post('/invoices', {
                amount,
                dt_duedate: dt_duedate_formated,
                account_id,
                company_id,
                status,
                type,
                description
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
                setValues({ amount: '', dt_duedate: '', account_id: '', company_id: '', description: '', status: '', type: '' });
                setSuccess(false);
            }, 1500);
            props.loader('reset');


        } catch (error) {
            console.log(error);
        }

    }

    if (props.show && props.invoiceId && !values.amount) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>New Invoice {props.invoiceId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Saved successfully</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Row>
                                <Col>
                                    <Form.Group controlId="Amount">
                                        <Form.Label>Amount: </Form.Label>
                                        <CurrencyInput className="input_bootstrap" name="amount" required onChange={handleInputChange} value={values.amount} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="dt_duedate">
                                        <Form.Label>Due Date: </Form.Label>
                                        <DatePicker className="input_bootstrap" id="dt_duedate" name="dt_duedate" dateFormat="MM/dd/yyyy" required selected={dt_duedate} onChange={date => setStartDate(date)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Account</Form.Label>
                                        <Form.Control as="select" name="account_id" required onChange={handleInputChange} value={values.account_id} >
                                            <option value=''>Select Account</option>
                                            {props.accounts.map(account => (
                                                <option key={account.id} value={account.id}>{account.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control as="select" name="company_id" required onChange={handleInputChange} value={values.company_id} >
                                            <option value=''>Select Company</option>
                                            {props.companies.map(company => (
                                                <option key={company.id} value={company.id}>{company.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="account_id">
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" name="type" required onChange={handleInputChange} value={values.type} >
                                    <option value='1'>Pay</option>
                                    <option value='2'>Receive</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description: </Form.Label>
                                <Form.Control type="text" name="description" placeholder="Enter Description" required onChange={handleInputChange} value={values.description} />
                            </Form.Group>

                            <Form.Group controlId="status">
                                <Form.Label>Status: </Form.Label><br />
                                <Form.Check inline label="Open" type='radio' name='status' id='status_radio1' value='1' onChange={handleInputChange} checked={values.status === "1"} />
                                <Form.Check inline label="Paid" type='radio' name='status' id='status_radio2' value='2' onChange={handleInputChange} checked={values.status === "2"} />
                                <Form.Check inline label="Canceled" type='radio' name='status' id='status_radio3' value='3' onChange={handleInputChange} checked={values.status === "3"} />

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

export const AddInvoice = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                New
            </Button>

            <ModalInvoice show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} accounts={props.accounts} companies={props.companies} />

        </>
    );
}

export default AddInvoice;