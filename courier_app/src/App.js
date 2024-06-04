import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/layout/sidebar/sidebar";
import Login from "./components/pages/login/login";
import Users from "./components/pages/users/users";
import Vehicles from "./components/pages/vehicles/vehicles";
import MaintenanceTypes from "./components/pages/maintenanceType/maintenance-types";
import VehicleTypes from "./components/pages/vehicleType/vehicle-types";
import VehicleMaintenanceDetails from "./components/pages/vehicleMaintenanceDetail/vehicle-maintenance";
import NotFound from "./components/common/404/404";

function App() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/" element={<Navbar />}>
                    <Route path="/users" element={<Users />} />
                    <Route path="/vehicles" exact element={<Vehicles />} />
                    <Route path="/vehicle-maintenance-details/:vehicle_id" element={<VehicleMaintenanceDetails />} />
                    <Route path="/vehicle-types" element={<VehicleTypes />} />
                    <Route path="/maintenance-types" element={<MaintenanceTypes />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    );
}

export default App;
