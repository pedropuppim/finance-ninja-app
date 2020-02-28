import React, { useState } from 'react';
import './styles.css';
import { Form, Modal, Button } from 'react-bootstrap';
import api from "./../../services/api";
import NumberFormat from 'react-number-format';
import './styles.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const EditInvoice = (props) => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const testClick = () => {
        handleShow();
    }

    return (
        <>
            <Button variant="dark" onClick={testClick}>
                Details
            </Button>


        </>
    );
}

export const AddInvoice = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


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

        await api.post('/invoices', {
            amount,
            dt_duedate: dt_duedate_formated,
            account_id,
            status: 1,
            description
        });

    }


    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await saveItem();
            props.loader('reset');
        } catch (error) {
            console.log(error);
        }

    }

    const [values, setValues] = useState({ amount: '', dt_duedate: '', account_id: '', description: '' });
    const [dt_duedate, setStartDate] = useState(new Date());

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                New
            </Button>


            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>New Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="Amount">
                            <Form.Label>Amount: </Form.Label>
                            <NumberFormat className="input_bootstrap" name="amount" decimalSeparator={"."} decimalScale={2} required onChange={handleInputChange} value={values.amount} />
                        </Form.Group>
                        <Form.Group controlId="dt_duedate">
                            <Form.Label>Due Date: </Form.Label>
                            <DatePicker className="input_bootstrap" id="dt_duedate" name="dt_duedate" dateFormat="yyyy-MM-dd" required selected={dt_duedate} onChange={date => setStartDate(date)} />
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

export default AddInvoice;