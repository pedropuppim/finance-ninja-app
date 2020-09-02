import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import DatePicker from "react-datepicker";
import ButtonEdit from './../../assets/images/edit.png';
import CurrencyInput from 'react-currency-input';
import valueDb from '../../utils/money';

import "react-datepicker/dist/react-datepicker.css";


export const EditInvoice = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [companies, setCompanies] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [payment_methods, setPaymentMethods] = useState([]);

    const loadCompanies = async () => {
        const response = await api.get("/companies");
        setCompanies(response.data);
    }

    const loadAccounts = async () => {
        const response = await api.get("/accounts");
        setAccounts(response.data);
    }

    const loadCategories = async () => {
        const response = await api.get("/categories");
        setCategories(response.data);
    }

    const loadPaymentMethods = async () => {
        const response = await api.get("/payment_methods");
        setPaymentMethods(response.data);
    }

    useEffect(() => {
        loadCompanies();
        loadAccounts();
        loadCategories();
        loadPaymentMethods();

    }, []);


    return (
        <>

            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalInvoice show={show} loader={props.loader} invoiceId={props.invoiceId} handleClose={handleClose} handleShow={handleShow}  />


        </>
    );
}

export const ModalInvoice = (props) => {

    const [values, setValues] = useState({ amount: '', dt_duedate: '', account_id: '', company_id: '', payment_method_id: '', category_id: '' , description: '', status: "1", type: "1" });
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

    const removeItem = async (id) => {

        try {
            if (window.confirm("Você realmente deseja remover esse Lançamento?")) {
                await api.delete('/invoices/' + id);

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

        var { amount, account_id, company_id, description, status, type } = values;
        var dt_duedate_formated = dt_duedate.toISOString().split('T')[0];

        
        amount = valueDb(amount);

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
                setValues({ amount: '', dt_duedate: '', account_id: '', company_id: '', category_id: '', payment_method_id:'', description: '', status: "1", type: '1' });
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
                    <Modal.Title>Lançamento {props.invoiceId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">Salvo com sucesso</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Row>
                                <Col>
                                    <Form.Group controlId="Amount">
                                        <Form.Label>Valor: </Form.Label>
                                        <CurrencyInput decimalSeparator="," thousandSeparator="." className="input_bootstrap" name="amount" required onChange={handleInputChange} value={values.amount} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="dt_duedate">
                                        <Form.Label>Vencimento: </Form.Label>
                                        <DatePicker className="input_bootstrap" id="dt_duedate" name="dt_duedate" dateFormat="MM/dd/yyyy" required selected={dt_duedate} onChange={date => setStartDate(date)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Conta</Form.Label>
                                        <Form.Control as="select" name="account_id" required onChange={handleInputChange} value={values.account_id} >
                                            {/* <option value=''>Selecione a Conta</option>
                                            {props.accounts.map(account => (
                                                <option key={account.id} value={account.id}>{account.name}</option>
                                            ))} */}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Cliente / Fornecedor</Form.Label>
                                        <Form.Control as="select" name="company_id" required onChange={handleInputChange} value={values.company_id} >
                                            {/* <option value=''>Selecione o Cliente / Fornecedor</option>
                                            {props.companies.map(company => (
                                                <option key={company.id} value={company.id}>{company.name}</option>
                                            ))} */}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group controlId="category_id">
                                        <Form.Label>Categoria</Form.Label>
                                        <Form.Control as="select" name="category_id" required onChange={handleInputChange} value={values.category_id} >
                                            <option value=''>Selecione a Categoria</option>
                                            {/* {props.categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))} */}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="payment_method_id">
                                        <Form.Label>Forma de Pagamento</Form.Label>
                                        <Form.Control as="select" name="company_id" required onChange={handleInputChange} value={values.payment_method_id} >
                                            <option value=''>Selecione a Forma de Pagamento</option>
                                            {/* {props.payment_methods.map(payment_method => (
                                                <option key={payment_method.id} value={payment_method.id}>{payment_method.name}</option>
                                            ))} */}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={4}>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control as="select" name="type" required onChange={handleInputChange} value={values.type} >
                                            <option value='1'>Pagar</option>
                                            <option value='2'>Receber</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={8}>
                                    <Form.Group controlId="status">
                                        <Form.Label>Status: </Form.Label><br />
                                        <Form.Check inline label="Em Aberto" type='radio' name='status' id='status_radio1' value='1' onChange={handleInputChange} checked={values.status === "1"} required />
                                        <Form.Check inline label="Paga" type='radio' name='status' id='status_radio2' value='2' onChange={handleInputChange} checked={values.status === "2"} required />
                                        <Form.Check inline label="Cancelada" type='radio' name='status' id='status_radio3' value='3' onChange={handleInputChange} checked={values.status === "3"} required />

                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="description">
                                <Form.Label>Description: </Form.Label>
                                <Form.Control type="text" name="description" placeholder="Enter Description" onChange={handleInputChange} value={values.description} />
                            </Form.Group>


                            <Modal.Footer>
                                {props.invoiceId &&
                                    <Button variant="danger" onClick={() => removeItem(props.invoiceId)}> Excluir </Button>
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

export const AddInvoice = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalInvoice show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} accounts={props.accounts} companies={props.companies} />

        </>
    );
}

export default AddInvoice;