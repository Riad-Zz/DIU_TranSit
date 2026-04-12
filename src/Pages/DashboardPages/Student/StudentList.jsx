import React, { use } from 'react';
import { PiStudentDuotone } from "react-icons/pi";
import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { AuthContext } from '../../../Providers/AuthProvider/AuthProvider';
import useAxios from '../../../hooks/Axios/useAxios';

const StudentList = () => {
    const { user } = use(AuthContext);
    const axiosInstance = useAxios();

    const { data: students = [], isLoading } = useQuery({
        queryKey: ['studentinfo', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get('/studentinfo');
            return res.data;
        }
    });

    // Take only the first 3 students for the Overview display
    const displayedStudents = students.slice(0, 3);

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mt-10">
            {/* --- HEADER --- */}
            <div className="px-8 py-8 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <PiStudentDuotone size={20} className="text-primary" />
                    <h3 className="text-xl font-black italic tracking-tighter uppercase text-[#0a2533]">Student Registry</h3>
                </div>
                <Link 
                    to="/manage" 
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors italic underline"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-50">
                            <th className="px-8 py-5">Full Name & ID</th>
                            <th className="px-8 py-5">Academic Year</th>
                            <th className="px-8 py-5">Email Address</th>
                            <th className="px-8 py-5 text-right">Card Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-[10px] font-black uppercase italic opacity-20 tracking-widest">
                                    Syncing Registry...
                                </td>
                            </tr>
                        ) : displayedStudents.length > 0 ? (
                            displayedStudents.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                    {/* Name & ID */}
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black italic text-[#0a2533] uppercase leading-none">
                                            {item.name || "Unknown Student"}
                                        </p>
                                        <p className="text-[10px] text-primary font-bold mt-1.5 italic tracking-tighter">
                                            {item.student_id}
                                        </p>
                                    </td>

                                    {/* Year & Semester (Conditional Rendering) */}
                                    <td className="px-8 py-6 text-xs font-black italic uppercase tracking-tight text-slate-600">
                                        {item.academic_year && item.academic_semester ? (
                                            `${item.academic_year} Yr, ${item.academic_semester} Sem`
                                        ) : (
                                            <span className="opacity-30">Unassigned</span>
                                        )}
                                    </td>

                                    {/* Email */}
                                    <td className="px-8 py-6 text-[11px] font-bold text-slate-400 italic lowercase">
                                        {item.edu_mail}
                                    </td>

                                    {/* Card Status (Conditional Styling) */}
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.card_status === 'active' && <FaCheckCircle className="text-primary text-xs" />}
                                            {item.card_status === 'pending' && <FaClock className="text-amber-500 text-xs" />}
                                            {item.card_status === 'none' && <FaExclamationCircle className="text-slate-300 text-xs" />}
                                            
                                            <span className={`text-[9px] font-black uppercase tracking-[0.1em] italic ${
                                                item.card_status === 'active' ? 'text-primary' : 
                                                item.card_status === 'pending' ? 'text-amber-500' : 
                                                'text-slate-400'
                                            }`}>
                                                {item.card_status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-[10px] font-black uppercase italic opacity-20 tracking-widest">
                                    No Students Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default StudentList;