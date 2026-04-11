import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    MapPin,
    Clock,
    Users,
    ShieldCheck,
    ChevronLeft,
    Wifi,
    Plug,
    Airplay
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/Axios/useAxios';
import Loader from '../../Componets/Loader/Loader';

const BusDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    // const [selectedSeats, setSelectedSeats] = useState([]);

    const { data: busData = [], isLoading } = useQuery({
        queryKey: ['bus', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/busses/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const bus = busData[0] || {};

    // Generate dynamic stop times and structured data
    const journeyData = useMemo(() => {
        if (!bus.from_time || !bus.stops_str) return null;

        // Helper to add minutes to "HH:mm:ss" and return formatted "hh:mm AM/PM"
        const getFormattedTime = (baseTime, minutesToAdd) => {
            let [hours, minutes] = baseTime.split(':').map(Number);
            let totalMinutes = hours * 60 + minutes + minutesToAdd;
            
            let h = Math.floor(totalMinutes / 60) % 24;
            let m = totalMinutes % 60;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
        };

        const rawStops = bus.stops_str.split(', ');
        
        // The first stop is the starting point, the last is the destination
        const intermediateStops = rawStops.slice(1, -1).map((name, index) => ({
            name: name,
            time: getFormattedTime(bus.from_time, (index + 1) * 8) // 8 min intervals
        }));

        return {
            ...bus,
            startTimeFormatted: getFormattedTime(bus.from_time, 0),
            endTimeFormatted: getFormattedTime(bus.to_time, 0),
            intermediateStops
        };
    }, [bus]);

    if (isLoading) {
        return (
            <Loader></Loader>
        );
    }

    if (!journeyData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6]">
                <div className="text-slate-400 font-bold uppercase">Bus Information Not Found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7f6] py-10 px-4 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#0a2533] font-bold mb-6 hover:text-[#15803D] transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Schedule
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Route Info & Timeline */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="bg-[#15803D]/10 text-[#15803D] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        Route {journeyData.route_id}
                                    </span>
                                    <h1 className="text-3xl font-black text-[#0a2533] mt-2 italic uppercase">
                                        {journeyData.from} <span className="text-[#15803D] not-italic">→</span> {journeyData.to}
                                    </h1>
                                    <p className="text-slate-500 font-medium mt-1">University Special / Hino 1J</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-[#15803D]">৳{journeyData.price}</div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Per Ticket</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-[#15803D]" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Departure</p>
                                        <p className="font-bold text-[#0a2533]">{journeyData.startTimeFormatted}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="text-[#15803D]" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Seats</p>
                                        <p className="font-bold text-[#0a2533]">{journeyData.seats} Available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-[#15803D]" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Day</p>
                                        <p className="font-bold text-emerald-600">{journeyData.day}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h2 className="text-[#0a2533] font-black uppercase text-sm tracking-widest mb-8 flex items-center gap-2">
                                <MapPin size={18} className="text-[#15803D]" /> Journey Timeline
                            </h2>
                            <div className="relative border-l-2 border-dotted border-slate-200 ml-3 space-y-10">
                                {/* Start Point */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#15803D] border-4 border-white shadow-sm"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-[#0a2533] text-lg uppercase">{journeyData.from}</span>
                                        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{journeyData.startTimeFormatted}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">Initial Pickup</p>
                                </div>

                                {/* Intermediate Stops */}
                                {journeyData.intermediateStops.map((stop, index) => (
                                    <div key={index} className="relative pl-8 group">
                                        <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#15803D] transition-colors"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-600 group-hover:text-[#0a2533] transition-colors">{stop.name}</span>
                                            <span className="text-xs font-semibold text-slate-400">{stop.time}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* End Point */}
                                <div className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0a2533] border-4 border-white shadow-sm"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-[#0a2533] text-lg uppercase">{journeyData.to}</span>
                                        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{journeyData.endTimeFormatted}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">Campus Drop-off</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Amenities & Actions */}
                    <div className="space-y-6">
                        {/* Amenities */}
                        <div className="bg-[#0a2533] p-8 rounded-3xl text-white">
                            <h3 className="font-black uppercase tracking-widest text-xs text-[#15803D] mb-6">Bus Amenities</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                    <Wifi size={20} className="text-[#15803D]" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">Free WiFi</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                    <Plug size={20} className="text-[#15803D]" />
                                    <span className="text-xs font-bold uppercase tracking-tighter">Charging</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-40">
                                    <Airplay size={20} />
                                    <span className="text-xs font-bold uppercase tracking-tighter line-through">Entertainment</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="text-[#0a2533] font-black uppercase text-sm tracking-widest mb-6">Purchase Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Selected Route</span>
                                    <span className="text-[#0a2533] font-bold italic">{journeyData.route_id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Tickets</span>
                                    <span className="text-[#0a2533] font-bold">1 Adult Passenger</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                                    <span className="text-[#0a2533] font-black uppercase text-xs">Total Fare</span>
                                    <span className="text-2xl font-black text-[#15803D]">৳{journeyData.price}</span>
                                </div>
                            </div>
                            <button className="w-full bg-[#15803D] text-white font-black uppercase py-4 rounded-2xl tracking-[2px] shadow-lg shadow-[#15803D]/20 hover:bg-[#116631] transition-all active:scale-95">
                                Book This Trip
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed uppercase font-bold px-4">
                                Secure checkout by DIU Transport Service.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BusDetails;