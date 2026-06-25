// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import RMMain from "./RM/RMMain";
import QCDashboard from "../QC/QC_Dashboard";
import BranchManager from "./admin/branchmanager";
import Branches from "./admin/branches";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/rmmain"
        element={<RMMain />}
      />

      <Route
        path="/qc"
        element={<QCDashboard />}
      />

      <Route
        path="/branch-manager"
        element={<BranchManager />}
      />

      <Route
        path="/admin/branch-manager"
        element={<BranchManager />}
      />

      <Route
        path="/branches"
        element={<Branches />}
      />

      <Route
        path="/admin/branches"
        element={<Branches />}
      />
    </Routes>
  );
}

export default App;
