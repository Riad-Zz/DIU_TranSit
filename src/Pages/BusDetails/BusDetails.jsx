import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    MapPin,
    Clock,
    Users,
    ShieldCheck,
    ChevronLeft,
    Wifi,
    Plug
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/Axios/useAxios';
import Loader from '../../Componets/Loader/Loader';

const BusDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    // CENTRALIZED COLOR PALETTE
    const colors = {
        primary: '#15803D',       // Forest Green
        secondary: '#166534',     // Darker Green
        third: '#BBF7D0',         // Mint Tint
        text: '#606060',          // Base Content
        muted: '#9CA3AF',         // Gray-400
        slate: '#CBD5E1',         // Slate-300 for connecting lines
        bgLight: '#F9FAFB',       // Neutral-50 / Sidebar BG
        white: '#FFFFFF',
        border: '#E5E7EB'         // Neutral-200
    };

    const { data: busData = [], isLoading } = useQuery({
        queryKey: ['bus', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/busses/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const bus = busData[0] || {};

    const journeyData = useMemo(() => {
        if (!bus.from_time || !bus.stops_str) return null;

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
        const intermediateStops = rawStops.slice(1, -1).map((name, index) => ({
            name: name,
            time: getFormattedTime(bus.from_time, (index + 1) * 8)
        }));

        return {
            ...bus,
            startTimeFormatted: getFormattedTime(bus.from_time, 0),
            endTimeFormatted: getFormattedTime(bus.to_time, 0),
            intermediateStops
        };
    }, [bus]);

    if (isLoading) return <Loader />;

    if (!journeyData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" style={{ color: colors.muted }}>
                <div className="font-black uppercase tracking-[0.3em]">Bus Not Found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 font-sans" style={{ color: colors.text }}>
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER SECTION (UNTOUCHED TEXT) --- */}
                <div className="mb-12 text-center md:text-left">
                    <button
                        onClick={() => navigate(-1)}
                        style={{ color: colors.muted }}
                        className="group flex items-center gap-2 font-bold mb-6 hover:opacity-80 transition-all text-[11px] uppercase tracking-[0.2em] mx-auto md:mx-0"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform stroke-[3px]" />
                        Return to Schedule
                    </button>

                    <h3 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none">
                        Journey <span className="italic" style={{ color: colors.primary }}>Details</span>
                    </h3>
                    <p className="text-sm max-w-xl my-10 md:text-xl opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic">
                        We're here to assist you with your daily campus transportation needs!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT CONTENT --- */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Card 1: Route Details */}
                        <div 
                            className="p-8 md:p-12 rounded-2xl border shadow-sm"
                            style={{ backgroundColor: colors.bgLight, borderColor: colors.border }}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-md" style={{ backgroundColor: colors.third }}>
                                            <ShieldCheck size={16} style={{ color: colors.primary }} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: colors.primary }}>
                                            Route {journeyData.route_id}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold text-basse-content italic uppercase tracking-tighter leading-none">
                                        {journeyData.from} <span className="mx-1 opacity-20">→</span> {journeyData.to}
                                    </h1>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Daily Campus Shuttle Service</p>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-30">Ticket Fare</p>
                                    <div className="text-5xl font-black tracking-tighter italic" style={{ color: colors.primary }}>৳{journeyData.price}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: colors.border }}>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
                                        <Clock size={12}/> Departure
                                    </span>
                                    <span className="font-black text-xl italic">{journeyData.startTimeFormatted}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
                                        <Users size={12}/> Availability
                                    </span>
                                    <span className="font-black text-xl italic">{journeyData.seats} Seats</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase font-black tracking-widest opacity-40 flex items-center gap-2">
                                        <MapPin size={12}/> Schedule
                                    </span>
                                    <span className="font-black text-xl italic" style={{ color: colors.primary }}>{journeyData.day}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Station Roadmap */}
                        <div 
                            className="p-8 md:p-12 rounded-2xl border shadow-sm"
                            style={{ backgroundColor: colors.bgLight, borderColor: colors.border }}
                        >
                            <h2 className="font-black uppercase text-xs tracking-[0.3em] mb-12 flex items-center gap-3">
                                <div className="p-2 rounded-md">
                                    <MapPin size={16} style={{ color: colors.primary }} />
                                </div>
                                Roadmap Details
                            </h2>
                            
                            
                            <div className="relative border-l-2 ml-4 space-y-12" style={{ borderColor: colors.slate }}>
                                <div className="relative pl-10">
                                    <div 
                                        className="absolute -left-[9px]  top-1 w-4 h-4 rounded-full ring-4 ring-white shadow-sm"
                                        style={{ backgroundColor: colors.primary }}
                                    ></div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-black  text-2xl uppercase tracking-tighter">{journeyData.from}</span>
                                        <span 
                                            className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-200"
                                            style={{ color: colors.primary}}
                                        >
                                            {journeyData.startTimeFormatted}
                                        </span>
                                    </div>
                                </div>

                                {journeyData.intermediateStops.map((stop, index) => (
                                    <div key={index} className="relative pl-10 group">
                                        <div 
                                            className="absolute -left-[5px] top-2 w-2 h-2 rounded-full ring-2 ring-white transition-colors"
                                            style={{ backgroundColor: colors.slate }}
                                        ></div>
                                        <div className="flex justify-between items-center pr-4">
                                            <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-wide">{stop.name}</span>
                                            <span className="text-[9px] font-black opacity-30 uppercase italic hover:text-primary hover:opacity-90">{stop.time}</span>
                                        </div>
                                    </div>
                                ))}

                                <div className="relative pl-10">
                                    <div 
                                        className="absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white shadow-sm"
                                        style={{ backgroundColor: colors.text }}
                                    ></div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-black text-2xl uppercase tracking-tighter">{journeyData.to}</span>
                                        <span className="text-[10px] font-black opacity-80 bg-gray-200 px-2 py-0.5 rounded text-primary">{journeyData.endTimeFormatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDEBAR  --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl">
                            <h3 className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.3em] mb-10">Booking Summary</h3>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Student Pass</span>
                                    <span className="text-white font-black italic text-sm uppercase tracking-tight">Active ID</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Route Type</span>
                                    <span className="text-white font-black italic text-sm uppercase tracking-tight">Express</span>
                                </div>
                                <div className="pt-4 flex flex-col">
                                    <p className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">Total Payable</p>
                                    <span className="text-5xl font-black tracking-tighter italic">৳{journeyData.price}</span>
                                </div>
                            </div>
                            <button className="w-full bg-emerald-600 text-white font-black uppercase py-5 rounded-xl tracking-[4px] text-xs hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-900/40">
                                Confirm & Reserve
                            </button>
                            <div className="mt-12 space-y-4 border-t border-white/10 pt-8">
                                <div className="flex items-center gap-4 text-white/60">
                                    <Wifi size={16} className="text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">On-Board WiFi</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/60">
                                    <Plug size={16} className="text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Charging Ports</span>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="p-8 text-center border rounded-2xl shadow-sm"
                            style={{ backgroundColor: colors.bgLight, borderColor: colors.border }}
                        >
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-3">Need Assistance?</h4>
                            <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tighter opacity-50">
                                Our support team is available <br /> for your campus transport needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusDetails;