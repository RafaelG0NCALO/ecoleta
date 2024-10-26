import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import localStore from '../../stores/localStore';
import userStore from '../../stores/userStore';

const ProtectedRoute = ({ element }) => {
    const local = localStore();
    const user = userStore();
    const [isAuthChecked, setIsAuthChecked] = useState(false); 

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthChecked) {
                await local.checkAuthLocal();
                await user.checkAuth();
                setIsAuthChecked(true); 
            }
        };
        checkAuth();
    }, [local, user]);

    if (user.loggedIn) {
        return <Navigate to="/profile-user" />;
    }
    if (local.loggedInLocal) {
        return <Navigate to="/local-profile" />;
    }

    return element;
};

export default ProtectedRoute;
