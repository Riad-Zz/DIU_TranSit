import React, { use } from 'react';
import { MdOutlineShoppingBag } from "react-icons/md";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import BusFleet from '../Buses/BusFleet';
import StudentList from '../Student/StudentList';
import { AuthContext } from '../../../Providers/AuthProvider/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/Axios/useAxios';

const Overview = () => {
    const axiosInstance = useAxios() ;

    const {user} = use(AuthContext)

    const { data: busses = []} = useQuery({
        queryKey: ['busFleetData', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get('/busses');
            return res.data;
        }
    });

    const { data: allUsers = [], isLoading } = useQuery({
            queryKey: ['allUsers', user?.email],
            queryFn: async () => {
                const res = await axiosInstance.get('/users');
                return res.data;
            }
        });

        const { data: infos } = useQuery({
        queryKey: ['paymentStats'],
        queryFn: async () => {
            const res = await axiosInstance.get('/payment-stats');
            return res.data;
        }
    });

    // Provide a default value of 0 if the API returns null
    const totalRevenue = infos?.total_revenue || 0;
    const totalCount = infos?.total_count || 0;
    // console.log(busses)
    // console.log(students) ;

    const stats = [
        {
            title: "Total Transaction",
            value: totalRevenue,
            unit: "৳",
            percentage: "2.6",
            icon: MdOutlineShoppingBag,
            footer: "Includes student & faculty top-ups",
            isLoss: false,
        },
        {
            title: "New Users",
            value: allUsers.length,
            unit: "Users",
            percentage: "0.1",
            icon: AiOutlineUser,
            footer: "Registered in the last 24 hours",
            isLoss: true,
        },
        {
            title: "Card Request",
            value: totalCount,
            unit: "Reqs",
            percentage: "2.8",
            icon: AiOutlineShoppingCart,
            footer: "Pending approval: 45 cards",
            isLoss: false,
        },
        {
            title: "Available Bus",
            value: busses.length,
            unit: "Fleet",
            percentage: "3.6",
            icon: FaBus,
            footer: "Currently active on 12 routes",
            isLoss: false,
        },
    ];

    return (
        <div className="bg-transparent font-sans max-w-11/12 xl:max-w-7xl mx-auto lg:px-10">
            {/* --- HEADER SECTION --- */}
            <div className="py-5">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-[#0a2533]">
                    System <span className="text-primary">Overview</span>
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 my-4 italic">
                    Real-time diagnostics • Daffodil Bus Service • Fleet Intelligence
                </p>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
                    >
                        {/* High-Contrast Background Accent */}
                        <div className="absolute -right-6 -bottom-6 opacity-[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                            <item.icon className="text-[10rem] text-[#0a2533]" />
                        </div>

                        <div className="flex justify-between items-start relative z-10 mb-8">
                            <div className="p-4 bg-[#0a2533] text-white rounded-2xl shadow-lg shadow-[#0a2533]/20">
                                <item.icon size={24} />
                            </div>

                            <div className={`flex items-center gap-1 font-black italic text-[10px] px-3 py-1.5 rounded-full uppercase tracking-tighter ${item.isLoss ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
                                }`}>
                                {item.isLoss ? <IoTrendingDown size={14} /> : <IoTrendingUp size={14} />}
                                <span>{item.percentage}%</span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-4xl font-black italic text-[#0a2533] tracking-tighter">
                                    {item.value}
                                </h3>
                                <span className="text-primary font-black italic text-lg">{item.unit}</span>
                            </div>
                            <p className="text-[#8fa0a8] text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
                                {item.title}
                            </p>
                        </div>

                    </div>
                ))}
            </div>

            {/* --- NEW TABLES SECTION --- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                <BusFleet />
                <StudentList />
            </div>
        </div>
    );
};

export default Overview;