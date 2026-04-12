import React, { use, useRef } from 'react';
import {
    FaUniversity, FaCheckCircle, FaExclamationCircle,
    FaTicketAlt, FaHistory, FaUserShield, FaMapMarkerAlt
} from 'react-icons/fa';
import { MdOutlineVerifiedUser, MdQrCodeScanner, MdSettings } from 'react-icons/md';
import { AuthContext } from '../../Providers/AuthProvider/AuthProvider';
import useLoggedInUser from '../../hooks/LoggedInUser/useLoggedInUser';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAxios from '../../hooks/Axios/useAxios';

// --- STYLING CONSTANTS ---
const inputStyle = "w-full bg-gray-100 border-none rounded-xl p-4 text-[#0a2533] font-bold italic uppercase tracking-wider text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30";
const labelStyle = "block font-black text-[10px] uppercase tracking-[0.3em] opacity-70 text-black mb-2 ml-1";

const Profile = () => {
    const { user } = use(AuthContext);
    const CurrentLoggedInUser = useLoggedInUser(user?.email);
    const role = CurrentLoggedInUser?.LoggedInUser?.role;
    const logged_id = CurrentLoggedInUser.LoggedInUser?.id;
    const modalRef = useRef();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosInstance = useAxios();

    const onformSubmit = (data) => {
        const { email, studentId } = data;
        const emailPattern = new RegExp(`${studentId}@diu\\.edu\\.bd$`);

        if (!emailPattern.test(email)) {
            toast.error("Verification Failed: Email must match Student ID");
            setTimeout(() => {
                modalRef.current?.close();
            }, 150);
            return;
        }

        // --- SUCCESS FLOW ---
        toast.success("Student Verification Successful !!!");

        const varifiedStudent = { studentId, edu_mail: email, user_id: logged_id };
        const upt = { user_id: logged_id };

        axiosInstance.patch('/users', upt).then(() => {
            CurrentLoggedInUser.refetch?.();
        });

        axiosInstance.post('/student', varifiedStudent);

        setTimeout(() => {
            modalRef.current?.close();
        }, 150);
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
        <div className="min-h-screen bg-white py-16 px-6 lg:px-12 font-sans overflow-x-hidden">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* --- LEFT SIDEBAR: PROFILE CARD --- */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 rounded-3xl p-10 flex flex-col items-center border border-gray-100 shadow-sm relative overflow-hidden">

                        {/* Profile Image with Status Indicator */}
                        <div className="relative mb-8 group">
                            <img
                                src={userData.image}
                                alt="Profile"
                                className="w-44 h-44 rounded-full object-cover border-8 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
                                {role === "admin" || role === "student" ?
                                    <FaCheckCircle className="text-primary text-2xl" /> :
                                    <FaExclamationCircle className="text-amber-500 text-2xl" />
                                }
                            </div>
                        </div>

                        {/* Name & Title */}
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{userData.name}</h2>
                            <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 italic">
                                <FaUniversity /> {userData.studentStatus}
                            </p>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="w-full mt-10 space-y-4 pt-8 border-t border-gray-300">
                            {[
                                { label: "Personal Email", value: userData.email },
                                { label: "Location", value: userData.location, icon: <FaMapMarkerAlt size={10} /> },
                                { label: "Academic Email", value: userData.eduMail },
                            ].map((info, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">{info.label}</span>
                                    <span className="text-sm font-bold italic text-[#0a2533] flex items-center gap-1">
                                        {info.icon} {info.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Verification Button */}
                        {role !== "admin" && role !== "student" ? (
                            <button
                                onClick={() => modalRef.current.showModal()}
                                className="mt-10 w-full py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] italic transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex justify-center items-center gap-3"
                            >
                                <MdOutlineVerifiedUser size={18} /> [ Verify Student ID ]
                            </button>
                        ) : (
                            <div className="mt-10 w-full py-5 rounded-full bg-[#0a2533] flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em] italic">
                                <FaUserShield size={18} /> Verified Account
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary transition-all duration-300">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white italic">Security Settings</span>
                        <MdSettings className="text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all" size={20} />
                    </div>
                </aside>

                {/* --- RIGHT CONTENT: ACTIVITY & HUB --- */}
                <main className="lg:col-span-8 space-y-10">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-gray-100 pb-10">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                                Student <span className="text-primary">Hub</span>
                            </h1>
                            <p className="text-xs uppercase tracking-widest font-bold opacity-40 mt-4 italic">
                                TRACK TRAVELS • MANAGE TOKENS • IDENTITY VERIFICATION
                            </p>
                        </div>
                        <button className="flex items-center gap-3 px-8 py-4 bg-[#0a2533] rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary transition-all italic shadow-lg">
                            <MdQrCodeScanner size={18} /> Generate Pass
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-300 flex flex-col justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Student Status</p>
                            <div className="flex items-end gap-3">
                                <p className={`text-5xl font-black italic tracking-tighter uppercase ${role === "admin" || role === "student" ? 'text-[#0a2533]' : 'text-slate-300'}`}>
                                    {role === "admin" || role === "student" ? 'Verified' : 'Unverified'}
                                </p>
                                <div className={`w-4 h-4 rounded-full mb-3 ${role === "admin" || role === "student" ? 'bg-primary animate-pulse' : 'bg-amber-400'}`}></div>
                            </div>
                        </div>

                        <div className="bg-[#0a2533] p-8 rounded-3xl shadow-2xl flex flex-col justify-between group overflow-hidden relative">
                            <FaTicketAlt className="absolute -right-6 -bottom-6 text-white/5 text-9xl rotate-12 group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 italic">Available Tokens</p>
                            <p className="text-5xl font-black italic tracking-tighter text-white relative z-10">12 UNITS</p>
                        </div>
                    </div>

                    <section className="bg-white rounded-3xl border border-gray-300 shadow-xl overflow-hidden">
                        <div className="px-8 py-8 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <FaHistory size={16} className="text-primary" />
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Recent Trips</h3>
                            </div>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline italic">Download Log</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em]">
                                        <th className="px-8 py-5">Trip Identity</th>
                                        <th className="px-8 py-5">Route</th>
                                        <th className="px-8 py-5 text-right">Fare</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paymentHistory.map((row) => (
                                        <tr key={row.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-8">
                                                <p className="text-sm font-black italic text-[#0a2533]">{row.id}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase italic">{row.date}</p>
                                            </td>
                                            <td className="px-8 py-8 text-xs font-black italic uppercase tracking-tight text-slate-600">{row.route}</td>
                                            <td className="px-8 py-8 text-sm font-black text-[#0a2533] text-right italic">{row.amount}</td>
                                            <td className="px-8 py-8 text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic ${row.status === 'Completed' ? 'bg-primary text-white' : 'bg-red-500 text-white'
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

            {/* --- VERIFICATION MODAL --- */}
            <dialog ref={modalRef} className="modal backdrop-blur-md">
                <div className="modal-box bg-white rounded-3xl border-4 border-[#0a2533] p-10 max-w-md">
                    <h3 className="font-black italic text-2xl uppercase tracking-tighter text-[#0a2533]">Student Verification</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-6 italic">Secure your account with DIU Credentials</p>

                    <form onSubmit={handleSubmit(onformSubmit)} className="space-y-6">
                        <div>
                            <label className={labelStyle}>Student ID</label>
                            <input
                                {...register("studentId", { required: "ID is required" })}
                                placeholder="E.G. 241-15-454"
                                className={inputStyle}
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>Educational Email</label>
                            <input
                                {...register("email", {
                                    required: "DIU Email is required",
                                })}
                                placeholder="NAME-ID@DIU.EDU.BD"
                                className={inputStyle}
                            />
                        </div>

                        <button type="submit" className="bg-primary py-4 w-full uppercase font-black italic tracking-[0.2em] text-xs rounded-full text-white hover:shadow-xl transition-all shadow-lg shadow-primary/20">
                            Submit for Verification
                        </button>
                    </form>

                    <div className="modal-action">
                        <form method="dialog" className="w-full">
                            <button className="text-[10px] font-black uppercase tracking-widest w-full opacity-30 hover:opacity-100 transition-opacity italic">Close Window</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Profile;