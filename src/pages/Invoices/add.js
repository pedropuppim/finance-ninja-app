import React, { useState } from 'react';
import './styles.css';
import { Form, Modal, Button } from 'react-bootstrap';
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

        await api.post('/invoices', {
            amount,
            dt_duedate,
            account_id,
            status: 1,
            description
        });

    }


    const handleSubmit = e => {
        e.preventDefault();

        try {
            saveItem();
            props.loader('reset');
        } catch (error) {
            console.log(error);
        }

    }

    const [values, setValues] = useState({ amount: 0, dt_duedate: '', account_id: '', description: '' });

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
                            <Form.Control type='text' name='dt_duedate' mask='1111-11-11' required onChange={handleInputChange} value={values.dt_duedate} />
                        </Form.Group>
                        <Form.Group controlId="account_id">
                            <Form.Label>Account</Form.Label>
                            <Form.Control as="select" name="account_id" onChange={handleInputChange} value={values.account_id} >

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