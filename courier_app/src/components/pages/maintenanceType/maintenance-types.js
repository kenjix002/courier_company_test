import "./maintenance-types.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";

const MaintenanceType = () => {
    const navigate = useNavigate();
    // maintenance type list
    const [maintenanceType, setMaintenanceType] = useState([]);
    // create maintenance type
    const [type, setType] = useState("");
    const [priority, setPriority] = useState("HIGH");
    const [periodicMaintenanceMonth, setPeriodicMaintenanceMonth] = useState(0);
    const [updateId, setUpdateId] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(true);

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

        getMaintenanceTypes();
    }, [navigate]);

    const getMaintenanceTypes = async () => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get("/maintenance-type", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setMaintenanceType(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const createMaintenanceType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        try {
            const vehicleTypeInfo = {
                type,
                priority,
                periodic_maintenance_month: periodicMaintenanceMonth,
            };

            await api
                .post("/maintenance-type", vehicleTypeInfo, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    getMaintenanceTypes();
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

    const editMaintenanceType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const updateinfo = {
            type,
            priority,
            periodic_maintenance_month: periodicMaintenanceMonth,
        };

        await api
            .put(`/maintenance-type/${updateId}`, updateinfo, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                swal("Success", res.data.message, "success");
                getMaintenanceTypes();
                clearState();
            })
            .catch((error) => {
                swal("Error", error.response.data.message, "error");
            });
    };

    const deleteMaintenanceType = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const index = e.target.getAttribute("data-id");

        swal({
            title: "Delete Maintenance Type",
            text: `Are you sure you want to delete number ${index}?`,
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await api
                    .delete(`/maintenance-type/${e.target.value}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        swal("Success", `Successfully deleted number ${index}`, "success");
                        getMaintenanceTypes();
                        clearState();
                    })
                    .catch((error) => {
                        swal("Error", error.response.data.message, "error");
                    });
            }
        });
    };

    const setEdit = (e) => {
        e.preventDefault();

        const maintenance = maintenanceType.find((i) => {
            return i.id === Number(e.target.value);
        });

        // Set
        setUpdateId(maintenance.id);
        setType(maintenance.type);
        setPriority(maintenance.priority);
        setPeriodicMaintenanceMonth(maintenance.periodic_maintenance_month);

        setIsCreate(false);
        setIsOpen(true);
    };

    const toggleCollapse = () => {
        clearState();
        setIsOpen(!isOpen);
    };

    const clearState = () => {
        setType("");
        setPriority("HIGH");
        setPeriodicMaintenanceMonth(0);
        setIsOpen(false);
        setIsCreate(true);
        setUpdateId(0);
    };

    return (
        <div className="content">
            <div id="maintenance-type-list">
                <h1>Maintenance Type List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Type</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Periodic Maintenance Month</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceType.map((maintenance, index) => (
                            <tr key={maintenance.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{maintenance.type}</td>
                                <td>{maintenance.priority}</td>
                                <td>{maintenance.periodic_maintenance_month}</td>
                                <td>
                                    <button className="btn btn-info" value={maintenance.id} onClick={setEdit}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        value={maintenance.id}
                                        data-id={index + 1}
                                        onClick={deleteMaintenanceType}
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

            <div className="maintenance-type-create">
                <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                    {isCreate ? "Create" : "Update"} Maintenance Type {isOpen ? "-" : "+"}
                </h1>
                {isOpen && (
                    <form
                        onSubmit={isCreate ? createMaintenanceType : editMaintenanceType}
                        id="maintenance-type-create-form"
                    >
                        <div>
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
                            <div className="form-group">
                                <label htmlFor="priority">Priority</label>
                                <select
                                    className="form-control"
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => {
                                        setPriority(e.target.value);
                                    }}
                                >
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="periodic_maintenance_month">Periodic Maintenance Month</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="periodic_maintenance_month"
                                    value={periodicMaintenanceMonth}
                                    onChange={(e) => {
                                        setPeriodicMaintenanceMonth(e.target.value);
                                    }}
                                />
                            </div>
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

export default MaintenanceType;
