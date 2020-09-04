import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import './styles.css';

import logo from './logo-finance-ninja.png';

import { logout, getUser }  from "./../../services/auth";
import { Nav, Navbar } from 'react-bootstrap';


export default function Header() {



    const [user, setUser] = useState('');

    const logoutHeader = () => {
        logout();
    };

    useEffect(() => {
        setUser(getUser());
    }, []);


    return (
        <header className="main-header">
                <div className="container">
                    
                    <h1 className="mh-logo">
                        <Link to="/">
                            <img src={logo} className="logo-img" alt="Finance Ninja" />
                        </Link>
                    </h1>
                    <div className="">
                    {user.name} | &nbsp;
                        <Link to="/" onClick={() => logoutHeader()}>
                            <span className="link-top">Sair</span>
                        </Link>
                    </div>
                </div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto nav-menu">
                        {user.admin === "1" && (
                            <Link to="/dashboard" className="menu">Dashboard</Link>
                        )}

                        <Link to="/invoices" className="menu">Lançamentos</Link>
                      

                        {user.admin === "1" && (
                            <Link to="/payment_methods" className="menu">Formas de Pagamento</Link>

                        )}

                        {user.admin === "1" && (
                            <Link to="/categories" className="menu">Categorias</Link>

                        )}

                        {user.admin === "1" && (
                            <Link to="/accounts" className="menu">Contas</Link>
                        )}
                        
                        <Link to="/companies" className="menu">Cliente / Fornecedor</Link>

                        {user.admin === "1" && (
                            <Link to="/users" className="menu">Usuários</Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            </header>
    )
}
