import "./vehicles.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Pagination from "../../common/pagination/pagination";

const Vehicle = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("userRole");
    const [driverVehicles, setDriverVehicles] = useState([]);
    const [driverList, setDriverList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);

    const [registry, setRegistry] = useState("");
    const [driverId, setDriverId] = useState(0);
    const [vehicleId, setVehicleId] = useState(0);
    const [updateId, setUpdateId] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [maxPerPage, setMaxPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState([]);
    const [sort, setSort] = useState("name");
    const [order, setOrder] = useState("ASC");

    const getCurrentDatetime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
        return localISOTime;
    };

    const [datetime, setDatetime] = useState(getCurrentDatetime());

    const [isCreate, setIsCreate] = useState(true);

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
        getDriverVehicle(currentPage, sort, order);

        if (role === "ADMIN") {
            getDrivers();
            getVehicles();
        }
    }, [navigate, role, currentPage, sort, order]);

    const getDriverVehicle = async (page, sort, order) => {
        const token = localStorage.getItem("authToken");

        try {
            let sortQuery = "";
            if (sort !== "") {
                sortQuery = `&sortBy=${sort}&order=${order}`;
            }

            await api
                .get(`/vehicle?page=${page}${sortQuery}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setCurrentPage(Number(res.data.pageinfo.currentPage));
                    setTotalPages(res.data.pageinfo.totalPages);
                    setMaxPerPage(res.data.pageinfo.maxItemPerPage);
                    setTotalItems(res.data.pageinfo.totalItems);
                    setSortField(res.data.sortField);
                    setDriverVehicles(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const getDrivers = async () => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get("/users", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setDriverList(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const getVehicles = async () => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get("/vehicle-type", {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setVehicleList(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const createDriverVehicle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        try {
            const driverVehicleInfo = {
                user_id: Number(driverId),
                vehicle_type_id: Number(vehicleId),
                registry: registry,
            };

            await api
                .post("/vehicle", driverVehicleInfo, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    const createdId = res.data.id;

                    // Default 3 maintenance
                    // Assumption: first 3 seed maintenance type is mandatory
                    createDefaultMaintenance(createdId, 1);
                    createDefaultMaintenance(createdId, 2);
                    createDefaultMaintenance(createdId, 3);

                    getDriverVehicle(currentPage, sort, order);
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

    const createDefaultMaintenance = async (vehicleId, maintenanceId) => {
        const token = localStorage.getItem("authToken");

        const vehicleMaintenanceInfo = {
            vehicle_id: vehicleId,
            maintenance_type_id: maintenanceId,
        };

        await api.post("/vehicle-maintenance", vehicleMaintenanceInfo, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
    };

    const editDriverVehicle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const updateinfo = {
            user_id: Number(driverId),
            vehicle_type_id: Number(vehicleId),
            registry: registry,
            datetime: datetime,
        };

        await api
            .put(`/vehicle/${updateId}`, updateinfo, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                swal("Success", res.data.message, "success");
                getDriverVehicle(currentPage, sort, order);
                clearState();
            })
            .catch((error) => {
                swal("Error", error.response.data.message, "error");
            });
    };

    const deleteDriverVehicle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        const index = e.target.getAttribute("data-id");

        swal({
            title: "Delete Driver Vehicle",
            text: `Are you sure you want to delete number ${index}?`,
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await api
                    .delete(`/vehicle/${e.target.value}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        swal("Success", `Successfully deleted number ${index}`, "success");
                        clearState();
                        getDriverVehicle(1, sort, order);
                    })
                    .catch((error) => {
                        swal("Error", error.response.data.message, "error");
                    });
            }
        });
    };

    const toMaintenance = (e) => {
        e.preventDefault();

        navigate(`/vehicle-maintenance-details/${e.target.value}`);
    };

    const setEdit = (e) => {
        setIsCreate(false);

        const driverVehicle = driverVehicles.find((i) => {
            return i.id === Number(e.target.value);
        });

        // Set
        setUpdateId(driverVehicle.id);
        setDriverId(driverVehicle.user.id);
        setVehicleId(driverVehicle.vehicleType.id);
        setRegistry(driverVehicle.registry);

        setIsCreate(false);
        setIsOpen(true);
    };

    const toggleCollapse = () => {
        clearState();
        setIsOpen(!isOpen);
    };

    const clearState = () => {
        setDriverId(0);
        setVehicleId(0);
        setRegistry("");
        setIsCreate(true);
        setUpdateId(0);
        setIsOpen(false);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSortChange = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        setSort(selectedOption.value);
        setOrder(selectedOption.getAttribute("data-order"));
    };

    return (
        <div className="content">
            <div id="vehicle-type-list">
                <h1>Vehicle Type List</h1>
                <div className="sorting row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="user-sort">Sort</label>
                            <select name="user-sort" className="form-control" onChange={(e) => handleSortChange(e)}>
                                <option value="">None</option>
                                {sortField.map((field) => (
                                    <React.Fragment key={field}>
                                        <option value={field} data-order="ASC">
                                            {field}+
                                        </option>
                                        <option value={field} data-order="DESC">
                                            {field}-
                                        </option>
                                    </React.Fragment>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Driver's Name</th>
                            <th scope="col">Driver's Client</th>
                            <th scope="col">Registry</th>
                            <th scope="col">Vehicle Brand</th>
                            <th scope="col">Vehicle Model</th>
                            <th scope="col">Vehicle Type</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverVehicles.map((driverVehicle, index) => (
                            <tr key={driverVehicle.id}>
                                <th scope="row">{(currentPage - 1) * maxPerPage + index + 1}</th>
                                <td>{driverVehicle.user.name}</td>
                                <td>{driverVehicle.user.client}</td>
                                <td>{driverVehicle.registry}</td>
                                <td>{driverVehicle.vehicleType.brand}</td>
                                <td>{driverVehicle.vehicleType.model}</td>
                                <td>{driverVehicle.vehicleType.type}</td>

                                <td>
                                    {" "}
                                    {role === "ADMIN" && (
                                        <span>
                                            <button className="btn btn-info" value={driverVehicle.id} onClick={setEdit}>
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                value={driverVehicle.id}
                                                data-id={(currentPage - 1) * maxPerPage + index + 1}
                                                onClick={deleteDriverVehicle}
                                            >
                                                Del
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        className="btn btn-success"
                                        onClick={toMaintenance}
                                        value={driverVehicle.id}
                                    >
                                        Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalItems > maxPerPage && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>

            <hr />

            {role === "ADMIN" && (
                <div className="driver-vehicle-create">
                    <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                        {isCreate ? "Create" : "Update"} Vehicle {isOpen ? "-" : "+"}
                    </h1>
                    {isOpen && (
                        <form
                            onSubmit={isCreate ? createDriverVehicle : editDriverVehicle}
                            id="driver-vehicle-create-form"
                        >
                            <div className="form-group">
                                <label htmlFor="registry">Registry</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="registry"
                                    value={registry}
                                    onChange={(e) => {
                                        setRegistry(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Driver</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    value={driverId}
                                    onChange={(e) => {
                                        setDriverId(e.target.value);
                                    }}
                                >
                                    <option value={0}>None</option>
                                    {driverList.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="vehicle">Vehicle</label>
                                <select
                                    className="form-control"
                                    id="vehicle"
                                    value={vehicleId}
                                    onChange={(e) => {
                                        setVehicleId(e.target.value);
                                    }}
                                >
                                    <option value={0}>None</option>
                                    {vehicleList.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.brand} | {vehicle.model} | {vehicle.type} |{" "}
                                            {vehicle.availability ? "AVAILABLE" : "OUT"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!isCreate && (
                                <div className="form-group">
                                    <label htmlFor="datetime">DateTime</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="datetime"
                                        value={datetime}
                                        onChange={(e) => {
                                            setDatetime(e.target.value);
                                        }}
                                    />
                                </div>
                            )}

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

export default Vehicle;
