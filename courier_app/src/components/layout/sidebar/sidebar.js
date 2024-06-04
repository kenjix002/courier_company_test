import "./sidebar.css";
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("userRole");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    return (
        <>
            <nav className="sidebar">
                <Link to="/" className="nav-brand">
                    Courier
                </Link>

                <ul className="navbar-nav mr-auto">
                    {role === "ADMIN" && (
                        <li className="nav-item">
                            <Link to="/users">Users</Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link to="/vehicles" className="nav-link">
                            Registered Vehicles
                        </Link>
                    </li>
                    {role === "ADMIN" && (
                        <li className="nav-item">
                            <Link to="/vehicle-types" className="nav-link">
                                Vehicle Types
                            </Link>
                        </li>
                    )}
                    {role === "ADMIN" && (
                        <li className="nav-item">
                            <Link to="/maintenance-types" className="nav-link">
                                Maintenance Types
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link onClick={handleLogout} to="" className="nav-link">
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
};

export default Sidebar;
