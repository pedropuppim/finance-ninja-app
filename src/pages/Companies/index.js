import React, { useState, useEffect  } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

import AddCompany, { EditCompany } from "./add";

const moment = require("moment");


export default function Companies() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        loadCompanies();
        
        }, []);

    async function loadCompanies() {
        const response = await api.get("/companies");
        setCompanies(response.data);
        setLoading(false);
    }



    return (

        <div>
            <Header />
            <div className="container_bill">
                {loading ? (
                    <Spinner animation="grow" className='spinner' />
                ) : (

                        <div>
                            <p><AddCompany loader={loadCompanies} /></p>

                            <Table striped bordered hover responsive variant="striped bordered hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>#</th>
                                        <th>Data de Criação</th>
                                        <th>Nome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map(company => (
                                        <tr key={company.id}>
                                            <td><EditCompany loader={loadCompanies} companyId={company.id} /></td>
                                            <td>{company.id}</td>
                                            <td>{moment(company.created_at).format("DD/MM/YYYY")}</td>
                                            <td>{company.name}</td>
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
