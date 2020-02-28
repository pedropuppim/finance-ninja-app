import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './styles.css';

import logo from './logo-finance-ninja.png';



class Header extends Component {
    render() {
        return (
            <header className="main-header">
                <div className="container">
                    <h1 className="mh-logo">
                        <Link to="/">
                            <img src={logo} className="logo-img" alt="Finance Ninja" />
                        </Link>
                    </h1>
                    <nav className="main-nav">
                        <ul className="main-nav-list">
                            <li>
                                <Link to="/invoices">
                                    <span>Invoices</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/accounts">
                                    <span>Accounts</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/companies">
                                    <span>Companies</span>
                                </Link>
                            </li>


                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
