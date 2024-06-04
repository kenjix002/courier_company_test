import "./vehicle-types.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";

const VehicleType = () => {
    const navigate = useNavigate();
    // vehicle type list
    const [vehicleTypes, setVehicleTypes] = useState([]);
    // create vehicle type
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [type, setType] = useState("");
    const [updateId, setUpdateId] = useState(0);
    const [availability, setAvailability] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(true);

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

        getVehicleTypes();
    }, [navigate]);

    const getVehicleTypes = async () => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get("/vehicle-type", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setVehicleTypes(res.data.data);
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const createVehicleType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        try {
            const vehicleTypeInfo = {
                brand,
                model,
                type,
            };

            await api
                .post("/vehicle-type", vehicleTypeInfo, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    getVehicleTypes();
                    clearState();
                    swal("Success", res.data.message, "success");
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const editVehicleType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const updateinfo = {
            brand,
            model,
            type,
            availability,
        };

        await api
            .put(`/vehicle-type/${updateId}`, updateinfo, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                swal("Success", res.data.message, "success");
                getVehicleTypes();
                clearState();
            });
    };

    const deleteVehicleType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const index = e.target.getAttribute("data-id");

        swal({
            title: "Delete Vehicle Type",
            text: `Are you sure you want to delete number ${index}?`,
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await api
                    .delete(`/vehicle-type/${e.target.value}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        swal("Success", `Successfully deleted number ${index}`, "success");
                        getVehicleTypes();
                        clearState();
                    });
            }
        });
    };

    const toggleCollapse = () => {
        clearState();
        setIsOpen(!isOpen);
    };

    const setEdit = (e) => {
        e.preventDefault();

        const vehicle = vehicleTypes.find((i) => {
            return i.id === Number(e.target.value);
        });

        // Set
        setUpdateId(vehicle.id);
        setBrand(vehicle.brand);
        setModel(vehicle.model);
        setType(vehicle.type);
        setAvailability(vehicle.availability);

        setIsCreate(false);
        setIsOpen(true);
    };

    const clearState = () => {
        setBrand("");
        setModel("");
        setType("");
        setAvailability(true);
        setIsOpen(false);
        setIsCreate(true);
        setUpdateId(0);
    };

    return (
        <div className="content">
            <div id="vehicle-type-list">
                <h1>Vehicle Type List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Brand</th>
                            <th scope="col">Model</th>
                            <th scope="col">Type</th>
                            <th scope="col">Available</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicleTypes.map((vehicle, index) => (
                            <tr key={vehicle.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.type}</td>
                                <td>{vehicle.availability ? "Yes" : "No"}</td>
                                <td>
                                    <button className="btn btn-info" value={vehicle.id} onClick={setEdit}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        value={vehicle.id}
                                        data-id={index + 1}
                                        onClick={deleteVehicleType}
                                    >
                                        Del
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr />

            <div className="vehicle-type-create">
                <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                    {isCreate ? "Create" : "Update"} Vehicle Type {isOpen ? "-" : "+"}
                </h1>
                {isOpen && (
                    <form onSubmit={isCreate ? createVehicleType : editVehicleType} id="vehicle-type-create-form">
                        <div>
                            <div className="form-group">
                                <label htmlFor="brand">Brand</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brand"
                                    value={brand}
                                    onChange={(e) => {
                                        setBrand(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="model"
                                    value={model}
                                    onChange={(e) => {
                                        setModel(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="type"
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                    }}
                                />
                            </div>
                            {!isCreate && (
                                <div className="form-group">
                                    <label htmlFor="role">Availability</label>
                                    <select
                                        className="form-control"
                                        id="role"
                                        value={availability}
                                        onChange={(e) => {
                                            setAvailability(e.target.value);
                                        }}
                                    >
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary mt-3">
                                {isCreate ? "Create" : "Update"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VehicleType;
