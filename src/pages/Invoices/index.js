import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import Header from "../../components/Header";
import './styles.css';
import { Table, Badge, Spinner, Button } from 'react-bootstrap';

import AddInvoice, { EditInvoice } from "./add";
import Filters from "./filters";

const moment = require("moment");

export default function Invoices() {

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);
    const [loading_table, setLoadingTable] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [companies, setCompanies] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [payment_methods, setPaymentMethods] = useState([]);
    const [filters, setFilters] = useState('');


    useEffect(() => {
        
        loadInvoices();
        loadCompanies();
        loadAccounts();
        loadCategories();
        loadpaymentMethods();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadCompanies() {
        const response = await api.get("/companies");
        setCompanies(response.data);
        setLoading(false);
    }

    async function loadAccounts() {

        const response = await api.get("/accounts");
        setAccounts(response.data);
        setLoading(false);
    }
    
    async function loadCategories() {
        const response = await api.get("/categories");
        setCategories(response.data);
        setLoading(false);
    }

    async function loadpaymentMethods() {
        const response = await api.get("/payment_methods");
        setPaymentMethods(response.data);
        setLoading(false);
    }


    const loadInvoices = async (resetPage = null, string_filters = null) => {

        if (string_filters){
            setLoadingTable(true);
            setFilters(string_filters);
        } else {
            string_filters = filters;
        }

        var currentPage = (resetPage) ? 1 : pages.currentPage || 1;
        const response = await api.get("/invoices?page=" + currentPage + string_filters)
        setInvoices(response.data.data);

        setLastPage(response.data.pagination.lastPage);
        setPage(currentPage);

        setPages(response.data.pagination);
        setLoading(false);
        setLoadingTable(false);
    }

    const paginate = async (ptype) => {

        if (ptype === "previous") {
            if (pages.currentPage > 1) {
                setLoadingTable(true);
                pages.currentPage = parseInt(pages.currentPage) - 1;
            } else {
                return;
            }
        }

        if (ptype === "next") {
            if (pages.currentPage < pages.lastPage) {
                setLoadingTable(true);
                pages.currentPage = parseInt(pages.currentPage) + 1;
            } else {
                return;
            }
        }

        setPages(pages);
        setPage(pages.currentPage);
        setLastPage(pages.lastPage);
        loadInvoices();

    }


        return (

            <div>
                <Header />


                <div className="container_bill">

                    <Filters loadInvoices={loadInvoices} filters={filters} setFilters={setFilters} />
                    <br />
                    
                    {loading_table &&
                    <Spinner animation="border" className='spinner_table' />
                    }

                    {loading ? (
                        <Spinner animation="grow" className='spinner' />
                    ) : (

                            <div>
                                <p>
                                    <AddInvoice loader={loadInvoices} companies={companies} accounts={accounts} categories={categories} payment_methods={payment_methods} />
                                </p>

                                <Table striped bordered hover responsive variant="striped bordered hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>#</th>
                                            <th>Vencimento</th>
                                            <th>Valor</th>
                                            <th>Cliente/Fornecedor</th>
                                            <th>Conta</th>
                                            <th>Tipo</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map(invoice => (
                                            <tr key={invoice.id}>
                                                <td><EditInvoice loader={loadInvoices} invoiceId={invoice.id} companies={companies} accounts={accounts} categories={categories} payment_methods={payment_methods} /></td>
                                                <td>{invoice.id}</td>
                                                <td>{moment(invoice.dt_duedate).format("DD/MM/YY")}</td>
                                                <td>R$ {invoice.amount.toFixed(2)}</td>
                                                <td>{invoice.name_company}</td>
                                                <td>{invoice.name_account}</td>
                                                <td>{invoice.type === "1" ? "Pagar" : "Receber"}</td>
                                                <td><Badge variant={invoice.css_status}>{invoice.name_status}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="dark" disabled={page === 1} onClick={() => paginate('previous')}>Anterior</Button>
                                <Button variant="dark" disabled={page === lastPage} onClick={() => paginate('next')} style={{ float: "right" }}>Próxima</Button>
                            </div>


                        )

                    }

                </div>

            </div>

        );
    }
