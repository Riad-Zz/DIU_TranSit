import { useQuery } from '@tanstack/react-query';
import React, { use, useMemo } from 'react';
import { FaBus, FaRegDotCircle } from "react-icons/fa";
import { Link } from 'react-router';
import { AuthContext } from '../../../Providers/AuthProvider/AuthProvider';
import useAxios from '../../../hooks/Axios/useAxios';

const BusFleet = () => {
    const { user } = use(AuthContext);
    const axiosInstance = useAxios();

    const { data: busses = [], isLoading } = useQuery({
        queryKey: ['busFleetData', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get('/busses');
            return res.data;
        }
    });

    //  ensuring they are from different days
    const displayedBusses = useMemo(() => {
        const selected = [];
        const seenDays = new Set();

        for (const bus of busses) {
            if (!seenDays.has(bus.day)) {
                selected.push(bus);
                seenDays.add(bus.day);
            }
            if (selected.length === 3) break;
        }

        // No 3 unique day just fill with remaining buses
        if (selected.length < 3) {
            const remaining = busses.filter(b => !selected.includes(b));
            return [...selected, ...remaining].slice(0, 3);
        }

        return selected;
    }, [busses]);

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mt-10">
            {/* --- HEADER --- */}
            <div className="px-8 py-8 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <FaBus size={18} className="text-primary" />
                    <h3 className="text-xl font-black italic tracking-tighter uppercase text-[#0a2533]">Fleet Schedule</h3>
                </div>
                <Link 
                    to="/manage" 
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline italic"
                >
                    [ View All ]
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-50">
                            <th className="px-8 py-5">Bus Identity</th>
                            <th className="px-8 py-5">Assigned Route</th>
                            <th className="px-8 py-5">Operating Day</th>
                            <th className="px-8 py-5 text-right">Fare</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-[10px] font-black uppercase italic opacity-20 tracking-widest">
                                    Loading Fleet Data...
                                </td>
                            </tr>
                        ) : displayedBusses.length > 0 ? (
                            displayedBusses.map((bus, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                    {/* Bus ID & Capacity */}
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black italic text-[#0a2533]">BUS-{bus.route_id}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1 italic tracking-tighter">
                                            {bus.seats} Seats 
                                        </p>
                                    </td>

                                    {/* Route Info */}
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black italic uppercase tracking-tight text-slate-600 leading-none">
                                            {bus.from} &rarr; {bus.to}
                                        </p>
                                    </td>

                                    {/* Day Info */}
                                    <td className="px-8 py-6 text-xs font-bold text-[#0a2533] italic uppercase opacity-70">
                                        {bus.day}
                                    </td>

                                    {/* Price/Status Style */}
                                    <td className="px-8 py-6 text-right">
                                        <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest italic bg-primary/10 text-primary flex items-center justify-end gap-2">
                                            <FaRegDotCircle className="animate-pulse" />
                                            ৳{bus.price}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-[10px] font-black uppercase italic opacity-20 tracking-widest">
                                    No Active Fleet Records
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default BusFleet;