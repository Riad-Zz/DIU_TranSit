import React from 'react';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaRegDotCircle, FaEnvelope } from 'react-icons/fa';
import useAxios from '../../../hooks/Axios/useAxios';
import { useQuery } from '@tanstack/react-query';

const CardManagement = () => {
    const axiosInstance = useAxios();

    const { data: applications = [], refetch } = useQuery({
        queryKey: ['cardApplications'],
        queryFn: async () => {
            const res = await axiosInstance.get('/card-applications');
            return res.data;
        }
    });

    const handleAction = async (studentId, status) => {
        const isApprove = status === 'active';
        const actionText = isApprove ? 'APPROVE' : 'REJECT';
        
        try {
            const res = await axiosInstance.patch(`/card-status/${studentId}`, { status });
            if (res.data.success) {
                Swal.fire({
                    icon: isApprove ? 'success' : 'info',
                    title: `CARD ${actionText}ED`,
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: { title: 'font-black italic uppercase text-sm' }
                });
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', 'Update failed', 'error');
        }
    };

    return (
        <div className="min-h-screen pb-24 max-w-11/12 md:max-w-7xl mx-auto px-4 md:px-10 font-sans">
            <section className="pt-20">
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                    Card <span className="italic text-primary">Applications</span>
                </h3>
                <p className="text-sm max-w-xl my-10 md:text-xl opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic text-black">
                    Sorted by most recent. Manage status from 'Pending' to 'Active' or 'None'.
                </p>

                <div className="overflow-x-auto border border-gray-300 bg-white py-2 rounded-2xl my-7 shadow-sm">
                    <table className="table table-zebra w-full text-center">
                        <thead>
                            <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-300">
                                <th>No.</th>
                                <th>Student Info</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, index) => (
                                <tr key={app.application_id} className='text-black hover:bg-gray-100 transition-colors'>
                                    <th className="text-[10px] font-black italic opacity-50">{index + 1}</th>
                                    
                                    <td className="text-left">
                                        <p className="text-sm font-black italic text-[#0a2533] uppercase leading-none">{app.student_name}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1 italic tracking-tighter">{app.student_id} • {app.department}</p>
                                    </td>

                                    <td className="text-left">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <FaEnvelope className="text-[10px]" />
                                            <p className="text-[11px] font-bold lowercase italic">{app.student_email}</p>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`text-[9px] font-black uppercase italic px-3 py-1 rounded-full ${
                                            app.card_status === 'active' ? 'bg-green-100 text-green-600' : 
                                            app.card_status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                            'bg-gray-100 text-gray-400'
                                        }`}>
                                            {app.card_status}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest italic bg-primary/10 text-primary inline-flex items-center gap-2 leading-none">
                                            <FaRegDotCircle /> ৳{app.paid_amount}
                                        </span>
                                    </td>

                                    <td className='flex justify-center gap-2'>
                                        {/* LOGIC: Buttons are only clickable if status is 'pending'. 
                                            Once status changes to 'active' or 'none', buttons disable.
                                        */}
                                        <button 
                                            disabled={app.card_status !== 'pending'}
                                            onClick={() => handleAction(app.student_id, 'active')} 
                                            className='btn btn-sm bg-green-100 text-green-700 border-none hover:bg-green-600 hover:text-white font-black italic uppercase text-[10px] disabled:opacity-20'
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button 
                                            disabled={app.card_status !== 'pending'}
                                            onClick={() => handleAction(app.student_id, 'none')} 
                                            className='btn btn-sm bg-red-100 text-red-600 border-none hover:bg-red-600 hover:text-white font-black italic uppercase text-[10px] disabled:opacity-20'
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CardManagement;