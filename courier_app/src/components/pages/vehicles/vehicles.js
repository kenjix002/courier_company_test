import "./vehicles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const Vehicle = () => {
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
                    if (res.status !== 200) {
                        navigate("/");
                    }
                })
                .catch(() => {
                    navigate("/");
                });
        };

        checkAuth();
    }, [navigate]);

    return (
        <div className="content">
            <h1>list Vehicle</h1>
            <hr />
            <h1>create Vehicle</h1>
        </div>
    );
};

export default Vehicle;
