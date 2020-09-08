import React, { useState, useEffect  } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import icon_xls from './../../assets/images/icon_xls.png';
import { Table, Spinner, Col, Row } from 'react-bootstrap';
import AddAccount, { EditAccount } from "./add";

const moment = require("moment");

export default function Accounts() {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        loadAccounts();
        
     }, []);

     async function generateXlsx() {

        try {
            const response = await api.get("/accounts?xlsx=true");
            window.location.href = response.data.file;
        } catch (error) {
            console.log(error);
        }

    }

    async function loadAccounts() {

        try {
            const response = await api.get("/accounts");
            setAccounts(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
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
                                    <Col><AddAccount loader={loadAccounts} /></Col>
                                    <Col xs={1} className="m-top15"><img src={icon_xls} className="pointer" onClick={()=>generateXlsx()} alt="Exportar" /></Col>
                                </Row>
                                    
                                    <p></p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data de Criação</th>
                                            <th>Nome</th>
                                            <th>Saldo Inicial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map(account => (
                                            <tr key={account.id}>
                                                <td><EditAccount loader={loadAccounts} accountId={account.id} /></td>
                                                <td>{account.id}</td>
                                                <td>{moment(account.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{account.name}</td>
                                                <td>R$ {account.balance.toFixed(2)}</td>
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
