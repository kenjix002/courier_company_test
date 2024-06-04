import "./login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            await api
                .post(
                    "/verifytoken",
                    {},
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        navigate("/vehicles");
                    }
                })
                .catch(() => {
                    navigate("/");
                });
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const basicAuth = "Basic " + btoa(`${username}:${password}`);
            await api
                .post(
                    "/login",
                    {},
                    {
                        headers: {
                            Authorization: basicAuth,
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        localStorage.setItem("authToken", res.data.token);
                        localStorage.setItem("userId", res.data.user_id);
                        localStorage.setItem("userRole", res.data.role);
                        navigate("/vehicles");
                    }
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    return (
        <div className="login-wrapper text-center d-flex align-items-center justify-content-center vh-100">
            <div className="login-content">
                <h2 className="fw-bold login-title mb-3">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
