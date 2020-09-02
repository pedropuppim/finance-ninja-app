import React, { useState, useEffect  } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

import AddCategory, { EditCategory } from "./add";

const moment = require("moment");


export default function Categories() {
 
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        loadCategories();
        
    }, []);


    async function loadCategories() {
        const response = await api.get("/categories");
        setCategories(response.data);
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
                                <p><AddCategory loader={loadCategories} /></p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Data da Criação</th>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(category => (
                                            <tr key={category.id}>
                                                <td><EditCategory loader={loadCategories} categoryId={category.id} /></td>
                                                <td>{category.id}</td>
                                                <td>{moment(category.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{category.name}</td>
                                                <td>{category.type === "1" ? "Pagar" : "Receber"}</td>
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
