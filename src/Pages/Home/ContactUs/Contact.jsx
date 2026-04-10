import React from 'react';
import { CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import diljeb from '../../../assets/diljeb.jpeg'
import enam from '../../../assets/Enam.jpeg'
import imran from '../../../assets/Imran.jpg'
import ansur from '../../../assets/ansur.jpg'
import { Link } from 'react-router';

const Contact = () => {
    // This class ensures the image is fully visible (no zoom) 
    // but contained within a consistent square box.
    const imgStyle = "w-full h-full object-contain transform transition-transform duration-500 hover:scale-105";
    const containerStyle = "overflow-hidden rounded-xl bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center";

    return (
        <div className='md:max-w-9/12 max-w-11/12 px-1 mx-auto my-20'>
            <p className='text-4xl -mt-6 text-[#15633e] font-bold text-center my-10'>
                Contact Our Authorities
            </p>
            <div className='grid grid-cols-1 mt-5 gap-7 md:grid-cols-2 xl:grid-cols-4'>
 
                <div className="flex flex-col">
                    <div className={containerStyle}>
                        <img src={diljeb} alt="Diljeb Kabir" className={imgStyle} />
                    </div>
                    <div className='flex justify-between items-start mt-3'>
                        <div>
                            <p className='text-xl font-semibold leading-tight'>Mr. Kazi Md. Diljeb Kabir</p>
                            <p className="text-gray-400 text-sm">Senior Assistant Registrar/Director</p>
                        </div>
                        <div className='flex gap-2 shrink-0 ml-2'>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <CiPhone size={18} />
                            </div>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                            <MdOutlineEmail size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className={containerStyle}>
                        <img src={enam} alt="Monir Ul Enam" className={imgStyle} />
                    </div>
                    <div className='flex justify-between items-start mt-3'>
                        <div>
                            <p className='text-xl font-semibold leading-tight'>Mr. Md. Monir Ul Enam</p>
                            <p className="text-gray-400 text-sm">Assistant Admin Officer</p>
                        </div>
                        <div className='flex gap-2 shrink-0 ml-2'>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <CiPhone size={18} />
                            </div>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <MdOutlineEmail size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className={containerStyle}>
                        <img src={imran} alt="Imran Hossain" className={imgStyle} />
                    </div>
                    <div className='flex justify-between items-start mt-3'>
                        <div>
                            <p className='text-xl font-semibold leading-tight'>Mr. Md. Imran Hossain</p>
                            <p className="text-gray-400 text-sm">Transport Supervisor</p>
                        </div>
                        <div className='flex gap-2 shrink-0 ml-2'>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <CiPhone size={18} />
                            </div>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <MdOutlineEmail size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className={containerStyle}>
                        <img src={ansur} alt="Ansur Rahman" className={imgStyle} />
                    </div>
                    <div className='flex justify-between items-start mt-3'>
                        <div>
                            <p className='text-xl font-semibold leading-tight'>Mr. Md. Ansur Rahman</p>
                            <p className="text-gray-400 text-sm">Assistant Admin Officer</p>
                        </div>
                        <div className='flex gap-2 shrink-0 ml-2'>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <CiPhone size={18} />
                            </div>
                            <div className='hover:bg-[#1563DF] border-gray-500 hover:text-white border rounded-full p-2 cursor-pointer'>
                                <MdOutlineEmail size={18} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;