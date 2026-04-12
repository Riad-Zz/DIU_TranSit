import React from 'react';
import { FaRegDotCircle, FaEnvelope, FaFileInvoiceDollar } from 'react-icons/fa';
import useAxios from '../../../hooks/Axios/useAxios';
import { useQuery } from '@tanstack/react-query';

const PaymentManagement = () => {
    const axiosInstance = useAxios();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['paymentRecords'],
        queryFn: async () => {
            const res = await axiosInstance.get('/payments');
            return res.data;
        }
    });

    console.log(payments) ;

    return (
        <div className="min-h-screen pb-24 max-w-11/12 md:max-w-7xl mx-auto px-4 md:px-10 font-sans">
            <section className="pt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                            Revenue <span className="italic text-primary">History</span>
                        </h3>
                        <p className="text-sm max-w-xl mt-6 md:text-xl opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic text-black">
                            Financial logs for transport card applications and renewals.
                        </p>
                    </div>
                    
                    {/* Optional: Total Revenue Counter */}
                    
                </div>

                <div className="overflow-x-auto border border-gray-300 bg-white py-2 rounded-2xl my-10 shadow-sm">
                    <table className="table table-zebra w-full text-center">
                        <thead>
                            <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-300">
                                <th className="py-5">Ref No.</th>
                                <th>Student Name</th>
                                <th>Official Email</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((pay, index) => (
                                <tr key={pay.payment_id} className='text-black hover:bg-gray-100 transition-colors'>
                                    <th className="text-[10px] font-black italic opacity-50">
                                        #{pay.payment_id.toString().padStart(4, '0')}
                                    </th>
                                    
                                    <td className="text-left">
                                        <p className="text-sm font-black italic text-[#0a2533] uppercase leading-none">
                                            {pay.student_name}
                                        </p>
                                    </td>

                                    <td className="text-left">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <FaEnvelope className="text-[10px] text-primary/40" />
                                            <p className="text-[11px] font-bold lowercase italic">{pay.student_email}</p>
                                        </div>
                                    </td>

                                    <td>
                                        <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                                            {new Date(pay.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </td>

                                    <td>
                                        <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest italic bg-green-50 text-green-600 inline-flex items-center gap-2 leading-none border border-green-100">
                                            <FaRegDotCircle className="text-[8px]" />
                                            ৳{pay.paid_amount.toLocaleString()}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="flex items-center justify-center gap-1 text-[9px] font-black uppercase italic text-blue-500">
                                            <FaFileInvoiceDollar /> Verified
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {payments.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="6" className="py-20 opacity-30 font-black italic uppercase tracking-widest">
                                        No payment records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default PaymentManagement;