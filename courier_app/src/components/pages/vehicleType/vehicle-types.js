import "./vehicle-types.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const VehicleType = () => {
    const navigate = useNavigate();

    // Auth
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            const role = localStorage.getItem("userRole");

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
                    if (res.status !== 200 || role !== "ADMIN") {
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
            <h1>list vehicle types</h1>
            <hr />
            <h1>create vehicle types</h1>
        </div>
    );
};

export default VehicleType;
