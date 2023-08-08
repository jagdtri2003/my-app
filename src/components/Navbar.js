import React from 'react'
import logo from '../images/travel-kro-logo.png'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
export default function Navbar(props) {
  return (
    <nav className="navbar navbar-expand-lg " style={{ backgroundColor: '#45526e'}}>
        <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{ color: '#fff' }}>
        {/* <img src={logo} alt="Logo" width="110" height="60" class="d-inline-block align-text-top"/> */}
        {props.title}
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
            <Link className="nav-link"  aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
        </ul>
        <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-light" type="submit">Search</button>
        </form>
        </div>
    </div>
    </nav>
  )
}

Navbar.propsTypes={
    title:PropTypes.string.isRequired
}

Navbar.defaultProps={
    title:'Set Title Here'
}
