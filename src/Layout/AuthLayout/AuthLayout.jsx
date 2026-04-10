import React from 'react';
import logo from '../../assets/Logoo.png'
import authModel from '../../assets/logIn3.png'
import { Link, Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            <div className='relative min-h-90vh'>
                <div className='md:relative'>
                    <Link to={'/'} className='flex justify-center lg:absolute left-1 items-center font-bold text-2xl gap-1 text-black'><img src={logo} alt="" className='h-10 w-10'/>Route<span className='text-primary'>Sync</span></Link>
                    
                </div>
                <div className='flex justify-between items-center'>
                    <div className='bg-white flex-1'>
                        <Outlet></Outlet>
                    </div>
                    <div className='hidden flex-1 lg:flex justify-center items-center bg-[#ECF1ED] min-h-screen'>
                        <img src={authModel} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;