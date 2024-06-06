import "./sidebar.css";
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import BrandLogo from "../../../assets/images/deliverylogo.png";

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("userRole");
    const [showNavList, setShowNavList] = useState(true);

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth < 700) {
                setShowNavList(false);
            } else {
                setShowNavList(true);
            }
        });
    });

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    const toggleNavList = () => {
        setShowNavList(!showNavList);
    };

    return (
        <>
            <nav className="sidebar">
                <Link to="/" className="nav-brand">
                    <img src={BrandLogo} alt="Placeholder" className="sidebar-image" width="100" />
                </Link>
                <hr />
                <div className="burger-div" onClick={toggleNavList}>
                    {showNavList ? <i className="bi bi-x" /> : <i className="bi bi-list" />}
                </div>
                {showNavList && (
                    <div className="nav-list">
                        {role === "ADMIN" && (
                            <div>
                                <Link to="/users">Users</Link>
                            </div>
                        )}
                        <Link to="/vehicles" className="nav-link">
                            Registered Vehicles
                        </Link>
                        {role === "ADMIN" && (
                            <div>
                                <Link to="/vehicle-types" className="nav-link">
                                    Vehicle Types
                                </Link>
                                <Link to="/maintenance-types" className="nav-link">
                                    Maintenance Types
                                </Link>
                            </div>
                        )}
                        <hr />
                        <Link onClick={handleLogout} to="" className="nav-link">
                            Logout
                        </Link>
                    </div>
                )}
            </nav>
            <Outlet />
        </>
    );
};

export default Sidebar;
