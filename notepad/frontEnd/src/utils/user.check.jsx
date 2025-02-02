import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export const ProtectRoute = ({ children }) => {
    const { isAuthenticated, user, isCheakingAuth } = useAuthStore();

    // if (isCheakingAuth) {
    //     return <div>Loading...</div>; // Show a loading spinner
    // }

    if (!isAuthenticated && !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const AuthenticatedUserRoute = ({ children }) => {
    const { isAuthenticated, user, isCheakingAuth } = useAuthStore();
    // if (isCheakingAuth) {
    //     return <div>Loading...</div>; 
    // }
    if (isAuthenticated && user) {
        return <Navigate to="/" replace />;
    }

    return children;
};