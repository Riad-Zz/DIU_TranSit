import React, { use, useEffect, useRef, useState } from 'react';
import {
    FaEnvelope, FaUniversity, FaCheckCircle,
    FaExclamationCircle, FaTicketAlt, FaHistory,
    FaExternalLinkAlt, FaUserShield, FaMapMarkerAlt
} from 'react-icons/fa';
import { MdOutlineVerifiedUser, MdQrCodeScanner, MdSettings } from 'react-icons/md';
import { AuthContext } from '../../Providers/AuthProvider/AuthProvider';
import useLoggedInUser from '../../hooks/LoggedInUser/useLoggedInUser';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAxios from '../../hooks/Axios/useAxios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Profile = () => {
    const { user } = use(AuthContext)
    const CurrentLoggedInUser = useLoggedInUser(user?.email);
    const role = CurrentLoggedInUser?.LoggedInUser?.role;
    const logged_id = CurrentLoggedInUser.LoggedInUser.id
    const modalRef = useRef();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const axiosInstance = useAxios();


    const onformSubmit = (data) => {
        const { email, studentId } = data;

        const emailPattern = new RegExp(`${studentId}@diu\\.edu\\.bd$`);

        if (!emailPattern.test(email)) {
            toast.warning("Email must match your Student ID (e.g. name" + studentId + "@diu.edu.bd)");
            modalRef.current.close();
            toast.error("Student Varification Failed !!!")
            return;
        }

        console.log("Valid Data:", data);
        // close modal after success
        toast.success("Student Varification Successfull !!!")

        // ------------ New Student Information ------------------ 
        const varifiedStudent = {
            studentId: studentId,
            edu_mail: email,
            user_id: logged_id
        }

        const upt = {
            user_id: logged_id
        }

        //------------------------Update User role -----------------------
        axiosInstance.patch('/users',upt)
        .then((res)=>{
            console.log(res) ;
            // setRole('student') ;
            CurrentLoggedInUser.refetch?.();
        })

        // ------------------ Post the Varified Student to Database --------------------------
        axiosInstance.post('/student', varifiedStudent)
            .then((data) => {
                if (data.data.id) {
                    console.log(data.data.id);
                }
            })
        modalRef.current.close();
    };

    


    const userData = {
        name: user?.displayName,
        email: user?.email,
        eduMail: "tohidul.cse@daffodil.edu",
        studentStatus: "2nd Year, CSE",
        location: "Dhaka, Bangladesh",
        image: user?.photoURL
    };

    const paymentHistory = [
        { id: "TK-9921", date: "Apr 10, 2026", route: "Ashulia - Dhanmondi", amount: "৳40", status: "Completed" },
        { id: "TK-9845", date: "Apr 08, 2026", route: "Dhanmondi - Ashulia", amount: "৳40", status: "Completed" },
        { id: "TK-9712", date: "Apr 05, 2026", route: "Ashulia - Savar", amount: "৳25", status: "Refunded" },
    ];

    return (
        <div className="min-h-screen bg-gray-200 py-16 px-6 lg:px-12 font-sans text-base-content selection:bg-slate-200">

            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

                {/* LEFT */}
                <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-12">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 flex flex-col items-center">

                        <div className="relative mb-8 group">
                            <div className="absolute -inset-1 bg-linear-to-tr from-slate-200 to-slate-50 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src={userData.image}
                                alt="Profile"
                                className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl shadow-slate-200"
                            />
                            <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border border-slate-50">
                                {role == "admin" || role == "student" ?
                                    <FaCheckCircle className="text-black text-2xl" /> :
                                    <FaExclamationCircle className="text-amber-500 text-2xl" />
                                }
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-base-content">{userData.name}</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
                                <FaUniversity className="text-slate-400" /> {userData.studentStatus}
                            </p>
                        </div>

                        <div className="w-full mt-10 space-y-4 pt-8 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2 items-center justify-between text-sm ">
                                <span className="text-black">Email</span>
                                <span className=" font-semibold">{userData.email}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
                                <span className="text-black ">Location</span>
                                <span className=" font-semibold flex items-center gap-1">
                                    <FaMapMarkerAlt size={12} /> {userData.location}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3 items-center justify-between text-sm">
                                <span className="text-black ">Student Email</span>
                                <span className="font-semibold">{userData.eduMail}</span>
                            </div>
                        </div>

                        {role !== "admin" && role !== "student" ? (
                            <button
                                onClick={() => modalRef.current.showModal()}
                                className="mt-10 w-full py-4 px-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-slate-200 active:scale-95 flex justify-center items-center gap-3"
                            >
                                <MdOutlineVerifiedUser size={18} /> Verify Identity
                            </button>
                        ) : (
                            <div className="mt-10 w-full py-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-3 text-black font-black text-xs uppercase tracking-widest">
                                <FaUserShield size={18} /> Verified Account
                            </div>
                        )}


                        {/* Modal that will open  */}
                        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Student Verification</h3>

                                <form onSubmit={handleSubmit(onformSubmit)} className="space-y-4 mt-4">
                                    {/* Student ID */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Student ID (e.g. 241-15-454)"
                                            className="input input-bordered w-full outline-none"
                                            {...register("studentId", {
                                                required: "Student ID is required",
                                            })}
                                        />
                                        {errors.studentId && (
                                            <p className="text-red-500 text-sm">
                                                {errors.studentId.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Student Email (e.g. islam241-15-454@diu.edu.bd)"
                                            className="input input-bordered w-full outline-none"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@diu\.edu\.bd$/,
                                                    message: "Must be a valid DIU email",
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button className="btn btn-primary w-full text-white">
                                        Submit Verification
                                    </button>
                                </form>

                                {/* Close */}
                                <div className="modal-action">
                                    <form method="dialog">
                                        <button className="btn">Close</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                        <span className="text-xs font-bold text-slate-500 group-hover:text-black">Account Settings</span>
                        <MdSettings className="text-slate-400 group-hover:rotate-45 transition-transform" size={20} />
                    </div>
                </aside>

                {/* RIGHT */}
                <main className="lg:col-span-8 space-y-10">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                        <div>
                            <h1 className="text-5xl text-gray-900 font-bold">Student Hub</h1>
                            <p className="text-slate-500 mt-2 font-medium max-w-sm">Track your recent travels, verify your student status, and manage your bus tokens in one place ..</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-black transition-all shadow-sm">
                            <MdQrCodeScanner size={18} /> Get Travel Pass
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Status</p>
                            <div className="flex items-end gap-3">
                                <p className={`text-4xl font-black tracking-tighter ${role == "admin" || role == "student" ? 'text-black' : 'text-slate-400'}`}>
                                    {role == "admin" || role == "student" ? 'Verified' : 'Unverified'}
                                </p>
                                <div className={`w-3 h-3 rounded-full mb-2 ${role == "admin" || role == "student" ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-slate-200 flex flex-col justify-between group overflow-hidden relative">
                            <FaTicketAlt className="absolute -right-4 -bottom-4 text-slate-800 text-8xl rotate-12 group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 relative z-10">Available Tokens</p>
                            <p className="text-4xl font-black tracking-tighter text-white relative z-10">12 Total</p>
                        </div>
                    </div>

                    <section className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                        <div className="px-8 py-8 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-base-content">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <FaHistory size={16} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                            </div>
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors">Export PDF</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                                        <th className="px-8 py-5">Ticket Details</th>
                                        <th className="px-8 py-5">Route</th>
                                        <th className="px-8 py-5 text-right">Price</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paymentHistory.map((row) => (
                                        <tr key={row.id} className="group transition-all hover:bg-slate-50/50">
                                            <td className="px-8 py-8">
                                                <p className="text-sm font-black text-black">{row.id}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{row.date}</p>
                                            </td>
                                            <td className="px-8 py-8 text-sm font-bold text-base-content">{row.route}</td>
                                            <td className="px-8 py-8 text-sm font-black text-black text-right">{row.amount}</td>
                                            <td className="px-8 py-8 text-right">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${row.status === 'Completed'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-red-500 text-white'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Profile;