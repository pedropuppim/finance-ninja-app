import React, { useState, useEffect } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner, Badge, Col, Row } from 'react-bootstrap';

import AddUser, { EditUser } from "./add";

import icon_xls from './../../assets/images/icon_xls.png';

const moment = require("moment");


export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        loadUsers();
        
        }, []);

    async function generateXlsx() {

        try {
            const response = await api.get("/users?xlsx=true");
            window.location.href = response.data.file;
        } catch (error) {
            console.log(error);
        }

    }

    async function loadUsers() {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
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
                                <Col><AddUser loader={loadUsers} /></Col>
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
                                        <th>E-mail</th>
                                        <th>Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td><EditUser loader={loadUsers} userId={user.id} /></td>
                                            <td>{user.id}</td>
                                            <td>{moment(user.created_at).format("DD/MM/YYYY")}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                            
                                                <Badge variant={ user.admin === "1"  ? "primary" :  "secondary"}>{ user.admin === "1"  ? 'admin' :  'regular'}</Badge>

                                            </td>
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
