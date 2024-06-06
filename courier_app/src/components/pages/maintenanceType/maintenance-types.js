import "./maintenance-types.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Pagination from "../../common/pagination/pagination";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [maxPerPage, setMaxPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState([]);
    const [sort, setSort] = useState("");
    const [order, setOrder] = useState("ASC");

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

        getMaintenanceTypes(currentPage, sort, order);
    }, [navigate, currentPage, sort, order]);

    const getMaintenanceTypes = async (page, sort, order) => {
        const token = localStorage.getItem("authToken");

        try {
            let sortQuery = "";
            if (sort !== "") {
                sortQuery = `&sortBy=${sort}&order=${order}`;
            }

            await api
                .get(`/maintenance-type/?page=${page}${sortQuery}`, {
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
                    getMaintenanceTypes(currentPage, sort, order);
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
                getMaintenanceTypes(currentPage, sort, order);
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
                        clearState();
                        getMaintenanceTypes(1, sort, order);
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
        <div className="content maintenance-type-content">
            <div className="maintenance-type-list">
                <h1>Maintenance Type List</h1>
                <div className="maintenance-type-sorting row">
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

                <div className="maintenance-type-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Periodic Maintenance(Month)</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceType.map((maintenance, index) => (
                                <tr key={maintenance.id}>
                                    <th scope="row">{(currentPage - 1) * maxPerPage + index + 1}</th>
                                    <td>{maintenance.type}</td>
                                    <td>{maintenance.priority}</td>
                                    <td>{maintenance.periodic_maintenance_month}</td>
                                    <td className="button-group">
                                        <button className="btn btn-info" value={maintenance.id} onClick={setEdit}>
                                            <i className="bi bi-pencil icons-prevent" />
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            value={maintenance.id}
                                            data-id={(currentPage - 1) * maxPerPage + index + 1}
                                            onClick={deleteMaintenanceType}
                                        >
                                            <i className="bi bi-trash icons-prevent" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalItems > maxPerPage && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
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
                            <div className="row">
                                <div className="form-group col-md-5">
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
                                <div className="form-group col-md-5">
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
                            </div>
                            <div className="row mt-2">
                                <div className="form-group col-md-5">
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
