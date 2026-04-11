import React from 'react';
import { MdOutlineShoppingBag } from "react-icons/md";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { FaBus } from "react-icons/fa";

const Overview = () => {
    // Tailwind dynamic class map to ensure styles are loaded
    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    };

    const stats = [
        {
            title: "Total Transaction",
            value: "10,000 ৳",
            percentage: "2.6",
            icon: MdOutlineShoppingBag,
            footer: "Includes student & faculty top-ups",
            accent: "blue",
            isLoss: false,
        },
        {
            title: "New Users",
            value: "20",
            percentage: "0.1",
            icon: AiOutlineUser,
            footer: "Registered in the last 24 hours",
            accent: "emerald",
            isLoss: true,
        },
        {
            title: "Card Request",
            value: "1,240",
            percentage: "2.8",
            icon: AiOutlineShoppingCart,
            footer: "Pending approval: 45 cards",
            accent: "amber",
            isLoss: false,
        },
        {
            title: "Available Bus",
            value: "234",
            percentage: "3.6",
            icon: FaBus,
            footer: "Currently active on 12 routes",
            accent: "purple",
            isLoss: false,
        },
    ];

    return (
        <div className="bg-[#f4f7fe] min-h-screen p-10 font-sans">
            <div className="mb-12 max-w-2xl">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Real-time statistics for <span className="text-green-700 font-bold border-b-2 border-green-200">Daffodil Bus Service</span>.
                    Monitor fleet performance, user engagement, and financial transactions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {stats.map((item, index) => {
                    const theme = colorMap[item.accent];
                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-8 flex flex-col justify-between h-60 border border-white shadow-2xl shadow-slate-200/60 transition-all duration-500 hover:scale-[1.01]"
                        >
                            {/* Background Faded Icon */}
                            <div className="absolute -right-4 bottom-8 overflow-hidden pointer-events-none">
                                <item.icon
                                    className={`text-[10rem] opacity-[0.03] rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110 ${theme.text}`}
                                />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-4 ${theme.bg} ${theme.text} rounded-2xl`}>
                                    <item.icon size={26} />
                                </div>
                                <div className={`flex items-center gap-1 font-bold text-xs px-3 py-1.5 rounded-full ${item.isLoss ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                    {item.isLoss ? <IoTrendingDown size={14} /> : <IoTrendingUp size={14} />}
                                    <span>{item.percentage}%</span>
                                </div>
                            </div>

                            <div className="mt-4 relative z-10">
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                                    {item.value}
                                </h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    {item.title}
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 relative z-10">
                                <span className="text-[11px] text-slate-400 font-medium italic">
                                    {item.footer}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Overview;