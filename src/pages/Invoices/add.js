import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import api from "./../../services/api";
import './styles.css';
import DatePicker from "react-datepicker";
import ButtonEdit from './../../assets/images/edit.png';
import CurrencyInput from 'react-currency-input';
import valueDb from '../../utils/money';
import { getUser }  from "./../../services/auth"
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";


export const EditInvoice = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>

            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalInvoice show={show} loader={props.loader} invoiceId={props.invoiceId} handleClose={handleClose} handleShow={handleShow}  accounts={props.accounts} companies={props.companies} categories={props.categories} payment_methods={props.payment_methods} />


        </>
    );
}

export const ModalInvoice = (props) => {

    const [values, setValues] = useState({ amount: '', dt_duedate: '', account_id: '', company_id: '', payment_method_id: '', category_id: '' , description: '', status: "1", type: "1" });
    const [dt_duedate, setStartDate] = useState(new Date());
    const [msgSuccess, setSuccess] = useState(false);
    const [user, setUser] = useState('');


    useEffect(() => {
        setUser(getUser());
    }, []);

    const loadItem = async () => {
        const invoice = await api.get('/invoices/' + props.invoiceId);
        setValues(invoice.data);

        const dt_duedate_formated = invoice.data.dt_duedate.split('T')[0];
        var duedateDate = new Date(dt_duedate_formated);
        setStartDate(duedateDate);
    }


    const handleSelectChange = (e,p) => {
        try {

            const name = p.name;
            const value = e.id;
            setValues({ ...values, [name]: value });

        } catch (error) {
            console.log(error);
        }
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

        var { amount, account_id, company_id, description, status, type, payment_method_id, category_id } = values;
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
                payment_method_id,
                category_id,
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
                payment_method_id,
                category_id,
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
                                        <DatePicker  className="input_bootstrap" id="dt_duedate" name="dt_duedate" dateFormat="dd/MM/yyyy" required selected={dt_duedate} onChange={date => setStartDate(date)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Conta</Form.Label>

                                        <Select    
                                        getOptionLabel ={(option)=>option.id +' - '+ option.name}
                                        getOptionValue ={(option)=>option.id} 
                                        options={props.accounts} 
                                        name="account_id" 
                                        required onChange={handleSelectChange} 
                                        value={props.accounts.filter(option => option.id === values.account_id)} />

                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="account_id">
                                        <Form.Label>Cliente / Fornecedor</Form.Label>

                                        <Select    
                                        getOptionLabel ={(option)=>option.id +' - '+ option.name}
                                        getOptionValue ={(option)=>option.id} 
                                        options={props.companies} 
                                        name="company_id" 
                                        required onChange={handleSelectChange} 
                                        value={props.companies.filter(option => option.id === values.company_id)} />

         
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group controlId="category_id">
                                        <Form.Label>Categoria</Form.Label>
                                    
                                            <Select    
                                        getOptionLabel ={(option)=>option.id +' - '+ option.name}
                                        getOptionValue ={(option)=>option.id} 
                                        options={props.categories.filter(category => {
                                            if (category.type === values.type) {
                                                return category;
                                            }
                                            return null;
                                                
                                        })}
                                        name="category_id" 
                                        required onChange={handleSelectChange} 
                                        value={props.categories.filter(option => option.id === values.category_id)} />

                                    
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="payment_method_id">
                                        <Form.Label>Forma de Pagamento</Form.Label>

                                        <Select    
                                        getOptionLabel ={(option)=>option.id +' - '+ option.name}
                                        getOptionValue ={(option)=>option.id} 
                                        options={props.payment_methods} 
                                        name="payment_method_id" 
                                        required onChange={handleSelectChange} 
                                        value={props.payment_methods.filter(option => option.id === values.payment_method_id)} />

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
                                        <Form.Check inline disabled={props.invoiceId && user.admin === "0" ? true : false} label="Em Aberto" type='radio' name='status' id='status_radio1' value='1' onChange={handleInputChange} checked={values.status === "1"} required />
                                        <Form.Check inline disabled={props.invoiceId && user.admin === "0" ? true : false} label="Paga" type='radio' name='status' id='status_radio2' value='2' onChange={handleInputChange} checked={values.status === "2"} required />
                                        <Form.Check inline disabled={props.invoiceId && user.admin === "0" ? true : false} label="Cancelada" type='radio' name='status' id='status_radio3' value='3' onChange={handleInputChange} checked={values.status === "3"} required />

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

            <ModalInvoice show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow}  accounts={props.accounts} companies={props.companies} categories={props.categories} payment_methods={props.payment_methods}  />

        </>
    );
}

export default AddInvoice;