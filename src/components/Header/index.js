import React from 'react'
import { Link } from "react-router-dom";
import './styles.css';

import logo from './logo-finance-ninja.png';

import { logout, getUser }  from "./../../services/auth"

const user = getUser();


const logoutHeader = () => {
    logout();
};


export default function Header() {
    return (
<header className="main-header">
                <div className="container">
                    
                    <h1 className="mh-logo">
                        <Link to="/">
                            <img src={logo} className="logo-img" alt="Finance Ninja" />
                        </Link>
                    </h1>
                    <div className="main-nav">
                        {user.name}<br />
                        <Link to="/" onClick={() => logoutHeader()}><span>Sair</span></Link>
                    </div>

                    <nav className="main-nav">
                        <ul className="main-nav-list">

                            { user.admin==="1" && (
                            <li>
                                <Link to="/dashboard">
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            )}


                            <li>
                                <Link to="/invoices">
                                    <span>Lançamentos</span>
                                </Link>
                            </li>
                            

                            { user.admin==="1" && (
                            <li>
                                <Link to="/payment_methods">
                                    <span>Formas de Pagamento</span>
                                </Link>
                            </li>
                            )}

                            { user.admin==="1" && (
                            <li>
                                <Link to="/categories">
                                    <span>Categorias</span>
                                </Link>
                            </li>
                            )}
            
                            { user.admin==="1" && (
                            <li>
                                <Link to="/accounts">
                                    <span>Contas</span>
                                </Link>
                            </li>
                            )}

                            <li>
                                <Link to="/companies">
                                    <span>Cliente / Fornecedor</span>
                                </Link>
                            </li>
                            { user.admin==="1" && (
                                <li>
                                    <Link to="/users">
                                        <span>Usuários</span>
                                    </Link>
                                </li>
                            )}


                        </ul>
                    </nav>
                </div>
            </header>
    )
}
