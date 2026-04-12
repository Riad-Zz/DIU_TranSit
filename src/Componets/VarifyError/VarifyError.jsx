import React from 'react';
import photo from '../../assets/varify.png'
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router';

const VarifyError= () => {
    return (
        <div>
            <div >
            <div className='max-w-7xl mx-auto'>
                <div className='min-h-screen space-y-4 flex flex-col justify-center items-center '>
                    <img src={photo} alt="" className='max-h-100' />
                    <p className={` text-2xl  font-bold text-center mb-5 text-slate-900`}>Varify YourSelf First to Apply for Card</p>
                    <Link to={'/profile'}><button className=' btn px-10 py-3 bg-primary text-white rounded-xl text-black font-bold hover:scale-105 transition-transform'><IoMdArrowRoundBack></IoMdArrowRoundBack> Go to Profile</button></Link>
                </div>

            </div>
        </div>
        </div>
    );
};

export default VarifyError;