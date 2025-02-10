import React from 'react'
import { Link, Outlet } from "react-router-dom";
import "./Navbar.scss"
function Navbar() {
  return (
    <div className="layout">
            <header className="dashboard-header">
                <Link to={`/`}>
                    <h1 className="highlight">Alemeno</h1>
                </Link>
                <nav>
                    <a href="/student-dashboard">Dashboard</a>
                </nav>
            </header>
            <div className="content">
                <Outlet />
            </div>
        </div>
  )
}

export default Navbar
