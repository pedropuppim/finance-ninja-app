import React, { useState } from 'react';
import './styles.css';
import { Form, Modal, Button } from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput'
import api from "./../../services/api";

const AddInvoice = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    }


    const saveItem = async () => {

        const { amount, dt_duedate, account_id, description } = values;
        const response = await api.post('/invoices', {
            amount: amount,
            dt_duedate: dt_duedate,
            account_id: account_id,
            status: 1,
            description: description
        });

        console.log(response);
    }


    const handleSubmit = e => {
        e.preventDefault();

        console.log(values);

        saveItem();
        props.loader();

    }

    const [values, setValues] = useState({ amount: 0, dt_duedate: '', account_id: '1', description: '' });

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
                            <Form.Control type="text" name="amount" required onChange={handleInputChange} value={values.amount} />
                        </Form.Group>
                        <Form.Group controlId="dt_duedate">
                            <Form.Label>Due Date: </Form.Label>
                            <MaskedFormControl type='text' name='dt_duedate' mask='1111-11-11' required onChange={handleInputChange} value={values.dt_duedate} />
                        </Form.Group>
                        <Form.Group controlId="account_id">
                            <Form.Label>Account</Form.Label>
                            <Form.Control as="select" required onChange={handleInputChange} value={values.account_id}>
                                <option>Select Account</option>
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