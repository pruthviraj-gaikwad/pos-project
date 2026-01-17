// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const PrivateRoute = ({ children, roles = [] }) => {
    const { auth } = useContext(AppContext)
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (roles.length > 0 && !roles.includes(auth?.role)) {
        return <Navigate to="/" />; // Or redirect to "403 Forbidden" page
    }

    return children;
};

export default PrivateRoute;
