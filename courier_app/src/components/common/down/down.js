import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServerDown = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/");
        }, 10000);

        return () => clearTimeout(timeout); // Clean up the timeout on component unmount
    }, [navigate]);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">Server down</h1>
                <p className="fs-3">
                    {" "}
                    <span className="text-danger">Opps!</span> Server is currently down.
                </p>
                <p className="lead">Please wait for a moment for the server to come back up.</p>
                <a href="/" className="btn btn-primary">
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default ServerDown;
