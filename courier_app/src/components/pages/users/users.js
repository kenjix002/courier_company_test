import "./users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";
import Pagination from "../../common/pagination/pagination";

const User = () => {
    const navigate = useNavigate();
    // user list
    const [users, setUsers] = useState([]);
    // create user
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("DRIVER");
    const [client, setClient] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [maxPerPage, setMaxPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Auth
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        const checkAuth = async () => {
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

        getUsers(currentPage);
    }, [navigate, currentPage]);

    const getUsers = async (page) => {
        const token = localStorage.getItem("authToken");

        try {
            await api
                .get(`/users/?page=${page}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    setCurrentPage(Number(res.data.pageinfo.currentPage));
                    setTotalPages(res.data.pageinfo.totalPages);
                    setMaxPerPage(res.data.pageinfo.maxItemPerPage);
                    setTotalItems(res.data.pageinfo.totalItems);
                    setUsers(res.data.data);
                })
                .catch((error) => {
                    swal("Error", error.response.data.message, "error");
                });
        } catch (error) {
            swal("Error", error.response.data.message, "error");
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        try {
            const userinfo = {
                username,
                password,
                name,
                email,
                role,
                client,
            };

            await api
                .post("/users", userinfo, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => {
                    getUsers(currentPage);
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

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const clearState = () => {
        setUsername("");
        setPassword("");
        setName("");
        setEmail("");
        setRole("DRIVER");
        setClient("");
        toggleCollapse();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="content">
            <div id="user-list">
                <h1>User List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <th scope="row">{(currentPage - 1) * maxPerPage + index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalItems > maxPerPage && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>

            <hr />

            <div className="user-create">
                <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                    Create User {isOpen ? "-" : "+"}
                </h1>
                {isOpen && (
                    <form onSubmit={createUser} id="user-create-form">
                        <div>
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
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="client">Client</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="client"
                                    value={client}
                                    onChange={(e) => {
                                        setClient(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    className="form-control"
                                    id="role"
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                    }}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="DRIVER">DRIVER</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default User;
