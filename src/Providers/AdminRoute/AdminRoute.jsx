import React, { use } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useLoggedInUser from '../../hooks/LoggedInUser/useLoggedInUser';
import Loader from '../../Componets/Loader/Loader';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    const {LoggedInUser,isLoading} = useLoggedInUser(user?.email);

    if (loading || isLoading) {
        return <Loader />;
    }

    const role = LoggedInUser?.role;

    if (role !== 'admin') {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;