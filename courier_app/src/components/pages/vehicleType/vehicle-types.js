import "./vehicle-types.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Pagination from "../../common/pagination/pagination";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [maxPerPage, setMaxPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState([]);
    const [sort, setSort] = useState("");
    const [order, setOrder] = useState("ASC");

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

        getVehicleTypes(currentPage, sort, order);
    }, [navigate, currentPage, sort, order]);

    const getVehicleTypes = async (page, sort, order) => {
        const token = localStorage.getItem("authToken");

        try {
            let sortQuery = "";
            if (sort !== "") {
                sortQuery = `&sortBy=${sort}&order=${order}`;
            }

            await api
                .get(`/vehicle-type/?page=${page}${sortQuery}`, {
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
                    setVehicleTypes(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
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
                    getVehicleTypes(currentPage, sort, order);
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
                getVehicleTypes(currentPage, sort, order);
                clearState();
            })
            .catch((error) => {
                swal("Error", error.response.data.message, "error");
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
                        clearState();
                        getVehicleTypes(1, sort, order);
                    })
                    .catch((error) => {
                        swal("Error", error.response.data.message, "error");
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
        <div className="content vehicle-type-content">
            <div className="vehicle-type-list">
                <h1>Vehicle Type List</h1>
                <div className="vehicle-type-sorting row">
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

                <div className="vehicle-type-table mt-2">
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
                                    <th scope="row">{(currentPage - 1) * maxPerPage + index + 1}</th>
                                    <td>{vehicle.brand}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.availability ? "Yes" : "No"}</td>
                                    <td className="button-group">
                                        <button className="btn btn-info" value={vehicle.id} onClick={setEdit}>
                                            <i className="bi bi-pencil icons-prevent" />
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            value={vehicle.id}
                                            data-id={(currentPage - 1) * maxPerPage + index + 1}
                                            onClick={deleteVehicleType}
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

            <div className="vehicle-type-create">
                <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                    {isCreate ? "Create" : "Update"} Vehicle Type {isOpen ? "-" : "+"}
                </h1>
                {isOpen && (
                    <form onSubmit={isCreate ? createVehicleType : editVehicleType} id="vehicle-type-create-form">
                        <div>
                            <div className="row">
                                <div className="form-group col-md-5">
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
                                <div className="form-group col-md-5">
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
                            </div>
                            <div className="row mt-2">
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
                                {!isCreate && (
                                    <div className="form-group col-md-5">
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

export default VehicleType;
