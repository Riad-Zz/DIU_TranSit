import React, { use } from 'react';
import useLoggedInUser from '../../hooks/LoggedInUser/useLoggedInUser';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loader from '../../Componets/Loader/Loader';
import { Navigate } from 'react-router';

const StudentRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    const { LoggedInUser, isLoading } = useLoggedInUser(user?.email);

    if (loading || isLoading) {
        return <Loader />;
    }

    const role = LoggedInUser?.role;

    const allowedRoles = ['admin', 'student'];

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/varifyError" replace />;
    }

    return children;
};

export default StudentRoute;