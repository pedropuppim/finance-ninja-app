import React, { useState } from 'react';
import { Form, Modal, Button, Alert } from 'react-bootstrap';
import api from "./../../services/api";
import NumberFormat from 'react-number-format';
import './styles.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const EditInvoice = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Edit
            </Button>

            <ModalInvoice show={show} loader={props.loader} invoiceId={props.invoiceId} handleClose={handleClose} handleShow={handleShow} accounts={props.accounts} />


        </>
    );
}

export const ModalInvoice = (props) => {

    const [values, setValues] = useState({ amount: '', dt_duedate: '', account_id: '', description: '' });
    const [dt_duedate, setStartDate] = useState(new Date());
    const [msgSuccess, setSuccess] = useState(false);

    const loadItem = async () => {
        const invoice = await api.get('/invoices/' + props.invoiceId);
        setValues(invoice.data);
    }


    const handleInputChange = e => {
        try {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const saveItem = async () => {

        const { amount, account_id, description } = values;
        const dt_duedate_formated = dt_duedate.toISOString().split('T')[0];

        if (props.invoiceId) {
            await api.put('/invoices/' + props.invoiceId, {
                amount,
                dt_duedate: dt_duedate_formated,
                account_id,
                status: 1,
                description
            });
        } else {
            await api.post('/invoices', {
                amount,
                dt_duedate: dt_duedate_formated,
                account_id,
                status: 1,
                description
            });
        }


    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await saveItem();
            setSuccess(true);
            setTimeout(e => { props.handleClose(); }, 1000);
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

                    <Alert show={msgSuccess} variant="success">Saved successfully</Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="Amount">
                            <Form.Label>Amount: </Form.Label>
                            <NumberFormat className="input_bootstrap" name="amount" decimalSeparator={"."} decimalScale={2} required onChange={handleInputChange} value={values.amount} />
                        </Form.Group>
                        <Form.Group controlId="dt_duedate">
                            <Form.Label>Due Date: </Form.Label>
                            <DatePicker className="input_bootstrap" id="dt_duedate" name="dt_duedate" dateFormat="MM/dd/yyyy" required selected={dt_duedate} onChange={date => setStartDate(date)} />
                        </Form.Group>
                        <Form.Group controlId="account_id">
                            <Form.Label>Account</Form.Label>
                            <Form.Control as="select" name="account_id" required onChange={handleInputChange} value={values.account_id} >
                                <option value=''>Select Account</option>
                                {props.accounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description: </Form.Label>
                            <Form.Control type="text" name="description" placeholder="Enter Description" required onChange={handleInputChange} value={values.description} />
                        </Form.Group>

                        <Modal.Footer>

                            <Button variant="dark" type="submit">
                                Save
                            </Button>

                        </Modal.Footer>
                    </Form>
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

            <ModalInvoice show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} accounts={props.accounts} />

        </>
    );
}

export default AddInvoice;