import "./vehicle-maintenance.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";

const VehicleMaintenance = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("userRole");
    const { vehicle_id } = useParams();
    const [maintenanceDetails, setMaintenanceDetails] = useState([]);
    const [maintenanceList, setMaintenanceList] = useState([]);

    const [isCreate, setIsCreate] = useState(true);
    const [maintenanceId, setMaintenanceId] = useState(0);
    const [updateId, setUpdateId] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

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
        getVehicleMaintenance(vehicle_id);

        if (role === "ADMIN") {
            getMaintenanceType();
        }
    }, [navigate, role, vehicle_id]);

    const getMaintenanceType = async () => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get(`/maintenance-type`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setMaintenanceList(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const getVehicleMaintenance = async (vehicle_id) => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get(`/vehicle-maintenance/${vehicle_id}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setMaintenanceDetails(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const createVehicleMaintenance = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        try {
            const vehicleMaintenanceInfo = {
                maintenance_type_id: Number(maintenanceId),
                vehicle_id: Number(vehicle_id),
            };

            await api
                .post("/vehicle-maintenance", vehicleMaintenanceInfo, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    getVehicleMaintenance(vehicle_id);
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

    const updateVehicleMaintenance = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const updateinfo = {
            maintenance_type_id: Number(maintenanceId),
            vehicle_id: Number(vehicle_id),
        };

        await api
            .put(`/vehicle-maintenance/${updateId}`, updateinfo, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                swal("Success", res.data.message, "success");
                getVehicleMaintenance(vehicle_id);
                clearState();
            })
            .catch((error) => {
                swal("Error", error.response.data.message, "error");
            });
    };

    const completeVehicleMaintenance = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const index = e.target.getAttribute("data-id");

        swal({
            title: "Complete Vehicle Maintenance Detail",
            text: `You have completed maintenance number ${index}?`,
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
        }).then(async (isConfirm) => {
            if (isConfirm) {
                const updateinfo = {
                    maintenance_type_id: Number(e.target.getAttribute("data-maintenance-id")),
                    vehicle_id: Number(vehicle_id),
                    completed: true,
                };

                await api
                    .put(`/vehicle-maintenance/${e.target.value}`, updateinfo, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        swal("Success", `Successfully completed number ${index}`, "success");
                        getVehicleMaintenance(vehicle_id);
                        clearState();
                    })
                    .catch((error) => {
                        swal("Error", error.response.data.message, "error");
                    });
            }
        });
    };

    const deleteMaintenanceDetail = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const index = e.target.getAttribute("data-id");

        swal({
            title: "Delete Vehicle Maintenance Detail",
            text: `Are you sure you want to delete number ${index}?`,
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await api
                    .delete(`/vehicle-maintenance/${e.target.value}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        swal("Success", `Successfully deleted number ${index}`, "success");
                        getVehicleMaintenance(vehicle_id);
                        clearState();
                    })
                    .catch((error) => {
                        swal("Error", error.response.data.message, "error");
                    });
            }
        });
    };

    const setEdit = (e) => {
        setUpdateId(Number(e.target.value));
        setMaintenanceId(Number(e.target.getAttribute("data-maintenance-id")));
        setIsCreate(false);
        setIsOpen(true);
    };

    const toggleCollapse = () => {
        clearState();
        setIsOpen(!isOpen);
    };

    const clearState = () => {
        setMaintenanceId(0);
        setIsCreate(true);
        setUpdateId(0);
        setIsOpen(false);
    };

    return (
        <div className="content">
            <div id="vehicle-maintenance-list">
                <h1>Vehicle Maintenance Detail List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Maintenance Type</th>
                            <th scope="col">Due Schedule</th>
                            {role === "ADMIN" && <th scope="col">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceDetails.map((detail, index) => (
                            <tr key={detail.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{detail.maintenance.type}</td>
                                <td>{detail.due_schedule}</td>
                                {role === "ADMIN" && (
                                    <td>
                                        <button
                                            className="btn btn-success"
                                            value={detail.id}
                                            data-id={index + 1}
                                            data-maintenance-id={detail.maintenance.id}
                                            onClick={completeVehicleMaintenance}
                                        >
                                            Complete
                                        </button>
                                        <button
                                            className="btn btn-info"
                                            data-maintenance-id={detail.maintenance.id}
                                            value={detail.id}
                                            onClick={setEdit}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            value={detail.id}
                                            data-id={index + 1}
                                            onClick={deleteMaintenanceDetail}
                                        >
                                            Del
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr />

            {role === "ADMIN" && (
                <div className="vehicle-maintenance-create">
                    <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                        {isCreate ? "Create" : "Update"} Vehicle Maintenance Detail {isOpen ? "-" : "+"}
                    </h1>
                    {isOpen && (
                        <form
                            onSubmit={isCreate ? createVehicleMaintenance : updateVehicleMaintenance}
                            id="driver-vehicle-create-form"
                        >
                            <div className="form-group">
                                <label htmlFor="role">Driver</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    value={maintenanceId}
                                    onChange={(e) => {
                                        setMaintenanceId(e.target.value);
                                    }}
                                >
                                    <option value={0}>None</option>
                                    {maintenanceList.map((maintenance) => (
                                        <option key={maintenance.id} value={maintenance.id}>
                                            {maintenance.type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary mt-3">
                                {isCreate ? "Create" : "Update"}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehicleMaintenance;
