import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export const ProtectRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    console.log(isAuthenticated, user)
    if (!isAuthenticated && !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AuthenticatedUserRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (isAuthenticated && user) {
        return <Navigate to="/" replace />;
    }

    return children;
};