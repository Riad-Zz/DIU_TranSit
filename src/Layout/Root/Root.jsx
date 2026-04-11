import React, { useState, useEffect } from 'react';
import Navbar from '../../Pages/Shared/Navbar/Navbar';
import Footer from '../../Pages/Shared/Footer/Footer';
import { Outlet, useLocation } from 'react-router';
import Loader from '../../Componets/Loader/Loader';


const Root = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (loading) {
        return <Loader></Loader>;
    }

    return (
        <div className='min-h-screen'>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Root;