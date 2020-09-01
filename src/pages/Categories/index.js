import React, { Component } from 'react';
import api from "./../../services/api";
import Header from "./../../components/Header";
import './styles.css';
import { Table, Spinner } from 'react-bootstrap';

import AddCategory, { EditCategory } from "./add";

const moment = require("moment");


export default class Categories extends Component {

    state = {
        categories: [],
        loading: true
    }

    componentDidMount() {
        this.loadCategories();
    }

    loadCategories = async () => {
        const response = await api.get("/categories");
        this.setState({ categories: response.data, loading: false })
    }

    render() {
        return (

            <div>
                <Header />
                <div className="container_bill">
                    {this.state.loading ? (
                        <Spinner animation="grow" className='spinner' />
                    ) : (

                            <div>
                                <p><AddCategory loader={this.loadCategories} /></p>

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
                                        {this.state.categories.map(category => (
                                            <tr key={category.id}>
                                                <td><EditCategory loader={this.loadCategories} categoryId={category.id} /></td>
                                                <td>{category.id}</td>
                                                <td>{moment(category.created_at).format("DD/MM/YYYY")}</td>
                                                <td>{category.name}</td>
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
}
