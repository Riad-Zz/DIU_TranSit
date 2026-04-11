import React, { use } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useLoggedInUser from '../../hooks/LoggedInUser/useLoggedInUser';
import Loader from '../../Componets/Loader/Loader';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    const CurrentLoggedInUser = useLoggedInUser(user?.email);

    if (loading) {
        return <Loader />;
    }

    const role = CurrentLoggedInUser?.LoggedInUser?.role;

    if (role !== 'admin') {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;