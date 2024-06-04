import "./users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import swal from "sweetalert";

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

        const getUsers = async () => {
            try {
                await api
                    .get("/users", {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then((res) => {
                        setUsers(res.data.data);
                    });
            } catch (error) {
                swal("Error", error.response.data.message, "error");
            }
        };
        getUsers();
    }, [navigate]);

    const createUser = async (e) => {
        e.preventDefault();

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
                .post("/users", userinfo)
                .then((res) => {
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
                                <th scope="row">{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
