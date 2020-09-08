import React, { useState, useEffect  } from 'react';
import api from "../../services/api";
import Header from "../../components/Header";
import './styles.css';
import { Table, Spinner, Col, Row } from 'react-bootstrap';

import AddPaymentMethod, { EditPaymentMethod } from "./add";
import icon_xls from './../../assets/images/icon_xls.png';

const moment = require("moment");


export default function PaymentMethods() {


    const [payment_methods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        loadpaymentMethods();
        
    }, []);

    async function generateXlsx() {

        try {
            const response = await api.get("/payment_methods?xlsx=true");
            window.location.href = response.data.file;
        } catch (error) {
            console.log(error);
        }

    }

    async function loadpaymentMethods() {
        try {
            const response = await api.get("/payment_methods");
            setPaymentMethods(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    
        return (

            <div>
                <Header />
                <div className="container_bill">
                    {loading ? (
                        <Spinner animation="grow" className='spinner' />
                    ) : (

                            <div>
                            
                                    <Row>
                                        <Col><AddPaymentMethod loader={loadpaymentMethods} /></Col>
                                        <Col xs={1} className="m-top15"><img src={icon_xls} className="pointer" onClick={()=>generateXlsx()} alt="Exportar" /></Col>
                                    </Row>
                               
                                <p></p>
                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data da Criação</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payment_methods.map(payment_method => (
                                            <tr key={payment_method.id}>
                                                <td><EditPaymentMethod loader={loadpaymentMethods} PaymentMethodId={payment_method.id} /></td>
                                                <td>{payment_method.id}</td>
                                                <td>{moment(payment_method.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{payment_method.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )
                    }
                </div>
            </div>

        );
    }
