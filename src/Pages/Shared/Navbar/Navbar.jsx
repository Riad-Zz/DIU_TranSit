import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { Link, NavLink } from 'react-router';
import Smalllogo from '../../../assets/Logoo.png'
import { RiMenuFill } from "react-icons/ri";

const Navbar = () => {
    const alllinks = <>
        <li className='text-base-content text-[16px] font-bold mb-1'><NavLink to={'/'}>Home</NavLink></li>
        {/* <li className='text-base-content text-[16px] font-medium mb-1'><NavLink to={'/services'}>Services</NavLink></li> */}
        <li className='text-base-content text-[16px] font-bold mb-1'><NavLink to={'/schedule'}>Schedule</NavLink></li>
        <li className='text-base-content text-[16px] font-bold mb-1'><NavLink to={'/cardapply'}>Card Apply</NavLink></li>
        <li className='text-base-content text-[16px] font-bold mb-1'><NavLink to={'/aboutus'}>About Us</NavLink></li>
        <li className='text-base-content text-[16px] font-bold mb-1'><NavLink to={'/contact'}>Contact</NavLink></li>
    </>

    const user = false ;

    return (
        <div>
            <div className='w-full shadow-sm '>
                <div className="navbar py-4 md:px-4">
                    <div className="navbar-start">
                        <div className="md:hidden dropdown">
                            <label tabIndex={0} className="btn btn-ghost btn-square p-2 py-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 w-6 `}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>

                            </label>
                            <ul
                                tabIndex={0}
                                className="menu menu-compact dropdown-content mt-4 p-4 shadow bg-base-100 rounded-box w-75 space-y-2 hamburger"
                            >
                                {alllinks}
                            </ul>
                        </div>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1">
                            <img src={Smalllogo} alt="Logo" className="h-12 w-auto transition-all duration-500" />
                            <span className={`text-3xl font-bold hidden lg:inline-block`}>
                                Route<span className='text-primary'>Sync</span>
                            </span>
                        </Link>
                    </div>
                    <div className="navbar-center hidden md:flex">
                        <ul className="flex gap-6 px-1 midLinks">
                            {alllinks}
                        </ul>
                    </div>
                    <div className="navbar-end gap-px md:gap-2 relative">
                        {/* Sign In Button  */}
                        {
                                            user ?
                                                <div className="dropdown dropdown-end">
                                                    {/* Trigger Button */}
                                                    <label tabIndex={0} className="">
                                                        <div className="cursor-pointer">
                                                            <img src={user.photoURL} alt="User Avatar" className='w-11 h-11 rounded-full' />
                                                        </div>
                                                    </label>

                                                    {/* Dropdown Content */}
                                                    <div
                                                        tabIndex={0}
                                                        className="dropdown-content z-10 menu p-4 shadow-xl bg-white text-gray-900 rounded-lg mt-5
                               w-72 sm:w-80 max-w-[90vw]"
                                                    >
                                                        {/* Section: Currently In */}
                                                        <div className="px-1 mb-2">
                                                            <span className="text-xs text-gray-500 font-medium">Currently in</span>
                                                        </div>

                                                        {/* Profile Card */}
                                                        <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-xl mb-2">
                                                            {/* Avatar */}
                                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                                <img src={user?.photoURL} alt="profile" className="object-cover w-full h-full" />
                                                            </div>

                                                            {/* User Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-center">
                                                                    <h3 className="font-bold text-lg truncate">{user?.displayName || "User"}</h3>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="#8FA748"
                                                                        className="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-gray-600 text-sm">Personal</p>
                                                                <p className="text-gray-400 text-xs mt-1 truncate">
                                                                    {user?.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Menu Items */}
                                                        <ul className="p-0 space-y-2">
                                                            {/* Section Header */}
                                                            <li className="px-4 py-1 text-xs text-gray-500 font-normal uppercase tracking-wide">
                                                                Your accounts
                                                            </li>

                                                            {/* Logout Button */}
                                                            <li>
                                                                <button
                                                                    // onClick={handleLogOut}
                                                                    className="w-full bg-primary py-2 text-black  flex justify-center font-bold"
                                                                >
                                                                    Log out
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>


                            :
                            (<div className='flex gap-2'>
                                <Link to={'/login'}>
                                    <button className='btn-base border border-[#DADADA] py-3 px-4 md:px-6'>Sign In</button>
                                </Link>
                                {/* be a Rider Button  */}
                                <Link to={'/register'}>
                                    <button className='hidden lg:block btn-base py-3 text-white! px-6 bg-primary border-none'>Register</button>
                                </Link>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;