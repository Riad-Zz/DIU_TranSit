import React, { useMemo, useState, useEffect } from 'react';
import useAxios from '../../hooks/Axios/useAxios';
import { Link, useNavigate } from 'react-router';

const Schedule = () => {
    
    const [dbRoutes, setDbRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFromLocation, setSelectedFromLocation] = useState('');
    const [selectedToLocation, setSelectedToLocation] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    
   
    const [openDropdown, setOpenDropdown] = useState(null); // 'from', 'to', 'route', or null

 
    const axiosInstance = useAxios();
    // const navigate = useNavigate();

    // Date Navigation Generation
    const navDays = useMemo(() => {
        const today = new Date();
        const days = [];
        const apiDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const displayDayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayIdx = date.getDay();
            const dayNum = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            days.push({
                displayDay: i === 0 ? 'TODAY' : displayDayNames[dayIdx],
                displayDate: `${dayNum} ${month}`,
                apiDay: apiDayNames[dayIdx],
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return days;
    }, []);

    // Initial State for Selected Day
    const [selectedDayObj, setSelectedDayObj] = useState(navDays[0]);

    // Data Fetching Side Effect
    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const params = { day: selectedDayObj.apiDay };
                if (selectedFromLocation) params.from = selectedFromLocation;
                if (selectedToLocation) params.to = selectedToLocation;
                const response = await axiosInstance.get('/schedule', { params });
                setDbRoutes(response.data);
            } catch (error) {
                console.error("Error fetching routes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [selectedDayObj, selectedFromLocation, selectedToLocation, axiosInstance]);

    // Route Formatting Logic
    const routes = useMemo(() => {
        return dbRoutes.map(r => {
            const uiRoute = {
                ...r,
                id: r.id,
                busid: r.route_id,
                fromTime: r.from_time,
                toTime: r.to_time,
                price: parseInt(r.price),
                seats: parseInt(r.seats)
            };
            if (!uiRoute.fromTime || !uiRoute.stops_str) return { ...uiRoute, stopsList: [] };
            let [hours, minutes] = uiRoute.from_time.split(':').map(Number);
            const stopsList = uiRoute.stops_str.split(', ').map((stopName, i) => {
                let m = minutes + ((i + 1) * 8);
                let h = hours + Math.floor(m / 60);
                m = m % 60;
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return { name: stopName, time: `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}` };
            });
            return { ...uiRoute, stopsList };
        });
    }, [dbRoutes]);

    // Derived Location & Filter Options
    const fromLocations = useMemo(() => {
        const stops = new Set();
        dbRoutes.forEach(r => {
            if (r.stops_str) r.stops_str.split(', ').forEach(s => stops.add(s));
        });
        return [...stops].sort();
    }, [dbRoutes]);

    const toLocations = useMemo(() => {
        const stops = new Set();
        dbRoutes.forEach(r => {
            if (r.stops_str) {
                const stopArray = r.stops_str.split(', ');
                if (selectedFromLocation) {
                    const fromIdx = stopArray.indexOf(selectedFromLocation);
                    if (fromIdx !== -1) stopArray.slice(fromIdx + 1).forEach(s => stops.add(s));
                } else {
                    stopArray.forEach(s => stops.add(s));
                }
            }
        });
        return [...stops].sort();
    }, [dbRoutes, selectedFromLocation]);

    const routeOptions = useMemo(() => [...new Set(routes.map(r => r.busid?.split('-')[0]))].filter(Boolean).sort(), [routes]);
    
    // Final Filtered Routes
    const filteredRoutes = useMemo(() => routes.filter(route => !selectedRoute || route.busid.startsWith(selectedRoute)), [selectedRoute, routes]);

    // Event Listener for Closing Menus
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-white py-10 px-5 flex flex-col items-center font-sans text-left overflow-x-hidden">
            {/*======================= Header Section =======================*/}
            <h1 className="text-4xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-none italic">Recent <span className='text-primary'>Schedule</span> </h1>
            <p className="text-sm text-center max-w-3xl md:text-lg opacity-50 my-4 uppercase tracking-[0.2em] md:tracking-[0.1em] font-bold italic">
                Explore all available bus routes, departure times, and seat availability.
            </p>

            {/*======================= Filter Section =======================*/}
            <div className="w-full max-w-4xl mx-auto bg-gray-100 p-4 md:p-6 my-6 rounded-2xl border border-gray-100 shadow-sm relative z-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">

                    {/*======================= From Dropdown =======================*/}
                    <div className="flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block font-black text-[10px] uppercase tracking-[0.3em] opacity-70 text-black mb-1">From</label>
                        <button 
                            onClick={() => setOpenDropdown(openDropdown === 'from' ? null : 'from')}
                            className="w-full text-center py-2 text-sm md:text-base opacity-80 uppercase tracking-[0.1em] font-bold italic text-[#0a2533] flex items-center justify-center gap-2"
                        >
                            {selectedFromLocation || "All Locations"}
                            <svg className={`w-3 h-3 transition-transform ${openDropdown === 'from' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {openDropdown === 'from' && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-xl border border-gray-100 z-[110] mt-2 max-h-60 overflow-y-auto">
                                <div onClick={() => { setSelectedFromLocation(''); setSelectedToLocation(''); setOpenDropdown(null); }} className="p-3 text-[10px] font-black uppercase tracking-widest opacity-40 italic border-b cursor-pointer hover:bg-gray-50">All Locations</div>
                                {fromLocations.map(loc => (
                                    <div key={loc} onClick={() => { setSelectedFromLocation(loc); setSelectedToLocation(''); setOpenDropdown(null); }} className="p-3 text-sm font-bold uppercase italic text-[#0a2533] hover:text-primary hover:bg-primary/5 cursor-pointer">{loc}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/*======================= To Dropdown ======================= */}
                    <div className="flex flex-col items-center relative md:border-x border-gray-200" onClick={(e) => e.stopPropagation()}>
                        <label className="block font-black text-[10px] uppercase tracking-[0.3em] opacity-70 text-black mb-1">To</label>
                        <button 
                            onClick={() => setOpenDropdown(openDropdown === 'to' ? null : 'to')}
                            className="w-full text-center py-2 text-sm md:text-base opacity-80 uppercase tracking-[0.1em] font-bold italic text-[#0a2533] flex items-center justify-center gap-2"
                        >
                            {selectedToLocation || "All Locations"}
                            <svg className={`w-3 h-3 transition-transform ${openDropdown === 'to' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {openDropdown === 'to' && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-xl border border-gray-100 z-[110] mt-2 max-h-60 overflow-y-auto">
                                <div onClick={() => { setSelectedToLocation(''); setOpenDropdown(null); }} className="p-3 text-[10px] font-black uppercase tracking-widest opacity-40 italic border-b cursor-pointer hover:bg-gray-50">All Locations</div>
                                {toLocations.map(loc => (
                                    <div key={loc} onClick={() => { setSelectedToLocation(loc); setOpenDropdown(null); }} className="p-3 text-sm font-bold uppercase italic text-[#0a2533] hover:text-primary hover:bg-primary/5 cursor-pointer">{loc}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/*======================= Route Dropdown =======================*/}
                    <div className="flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block font-black text-[10px] uppercase tracking-[0.3em] opacity-70 text-black mb-1">Route</label>
                        <button 
                            onClick={() => setOpenDropdown(openDropdown === 'route' ? null : 'route')}
                            className="w-full text-center py-2 text-sm md:text-base opacity-80 uppercase tracking-[0.1em] font-bold italic text-[#0a2533] flex items-center justify-center gap-2"
                        >
                            {selectedRoute || "All Routes"}
                            <svg className={`w-3 h-3 transition-transform ${openDropdown === 'route' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {openDropdown === 'route' && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-xl border border-gray-100 z-[110] mt-2 max-h-60 overflow-y-auto">
                                <div onClick={() => { setSelectedRoute(''); setOpenDropdown(null); }} className="p-3 text-[10px] font-black uppercase tracking-widest opacity-40 italic border-b cursor-pointer hover:bg-gray-50">All Routes</div>
                                {routeOptions.map(opt => (
                                    <div key={opt} onClick={() => { setSelectedRoute(opt); setOpenDropdown(null); }} className="p-3 text-sm font-bold uppercase italic text-[#0a2533] hover:text-primary hover:bg-primary/5 cursor-pointer">{opt}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/*======================= Reset Filters Button ======================= */}
                {(selectedFromLocation || selectedToLocation || selectedRoute) && (
                    <div className="w-full flex justify-center mt-8">
                        <button
                            onClick={() => { setSelectedFromLocation(''); setSelectedToLocation(''); setSelectedRoute(''); }}
                            className="text-[10px] uppercase tracking-[0.3em] text-white py-3 px-8 rounded-full bg-primary font-bold italic transition-all hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer shadow-md relative z-10"
                        >
                            [ Reset Filters ]
                        </button>
                    </div>
                )}
            </div>

            {/*======================= Content Display Section =======================*/}
            <div className="w-full max-w-275 bg-white shadow-lg flex flex-col relative rounded-2xl overflow-hidden">
                
                {/*======================= Day Navigation Bar =======================*/}
                <div className="sticky top-0 z-30 bg-[#0a2533] flex overflow-x-auto no-scrollbar text-white text-center shadow-md">
                    <div className="flex flex-nowrap min-w-full">
                        {navDays.map((item, index) => {
                            const isActive = item.fullDate === selectedDayObj.fullDate;
                            return (
                                <div key={index} onClick={() => setSelectedDayObj(item)} className={`flex-1 min-w-30 md:min-w-0 p-5 border-r border-white/10 cursor-pointer transition-colors text-sm ${isActive ? 'bg-primary text-white font-bold text-base flex items-center justify-center' : 'text-[#8fa0a8] hover:bg-white/10'}`}>
                                    <div className="flex flex-col items-center">
                                        <span>{item.displayDay}</span>
                                        {!isActive && <span className="block text-[1.1rem] font-bold mt-1.5 text-white">{item.displayDate}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/*======================= Route List Display =======================*/}
                <div className="overflow-x-auto overflow-y-visible">
                    <div className={`min-w-[900px] transition-all duration-300 ${filteredRoutes.length === 1 ? 'min-h-[550px]' : 'pb-32'}`}>
                        {loading ? (
                            <div className="p-12 text-center text-[#8b9a9e] animate-pulse font-bold uppercase tracking-[0.2em] italic">Searching routes...</div>
                        ) : filteredRoutes.length > 0 ? (
                            filteredRoutes.map((route, idx) => (
                                <div key={idx} className="grid grid-cols-[1.3fr_1.5fr_1.3fr_1.3fr_1fr] items-center bg-[#f5f7f8] m-2.5 p-8 hover:bg-[#ebf0f1] transition-colors relative border-b border-black/5 rounded-sm">
                                    
                                    {/*======================= Departure Info =======================*/}
                                    <div>
                                        <h3 className="m-0 text-[1.6rem] text-[#0a2533] uppercase font-bold italic tracking-tighter flex items-center gap-2 leading-none">
                                            <svg viewBox="0 0 12 16" className="w-[16px] h-[20px] fill-primary italic-none"><path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3Z" /></svg>
                                            {route.from}
                                        </h3>
                                        <p className="mt-2.5 ml-[26px] text-[0.9rem] opacity-70 uppercase tracking-[0.2em] font-bold italic">{route.fromTime}</p>
                                    </div>

                                    {/*======================= Route Visual / Tooltip =======================*/}
                                    <div className="flex items-center justify-center px-10 relative -mt-2 group py-4 cursor-pointer">
                                        <div className="flex-grow border-b-2 border-dotted border-[#b0bcc0] relative group-hover:border-primary transition-colors duration-300">
                                            <div className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 border-2 border-[#b0bcc0] rounded-full bg-[#f5f7f8] group-hover:border-primary transition-colors"></div>
                                            <div className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 border-2 border-[#b0bcc0] rounded-full bg-[#f5f7f8] group-hover:border-primary transition-colors"></div>
                                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[12px] text-[#8b9a9e] font-bold uppercase tracking-[0.3em] group-hover:text-[#0a2533] transition-colors italic">{route.busid}</span>
                                        </div>
                                        
                                        {/*======================= Stops Popover ======================= */}
                                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 w-80 opacity-0 invisible scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all z-50 origin-top pointer-events-auto">
                                            <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden">
                                                <div className="bg-[#0a2533] text-white px-5 py-3 font-bold text-xs uppercase tracking-widest italic">Route {route.busid} Stops</div>
                                                <div className="p-5 max-h-[280px] overflow-y-auto custom-scrollbar">
                                                    <div className="relative border-l-2 border-primary ml-2 space-y-5">
                                                        {route.stopsList.map((stop, i) => (
                                                            <div key={i} className="relative pl-6 flex justify-between items-center text-left">
                                                                <span className="absolute -left-[9px] top-[3px] w-4 h-4 rounded-full bg-white border-[3px] border-primary"></span>
                                                                <span className="text-[14px] text-[#0a2533] font-bold uppercase tracking-tight italic">{stop.name}</span>
                                                                <span className="text-[11px] text-[#8b9a9e] font-bold bg-[#f5f7f8] px-2 py-1 rounded italic uppercase">{stop.time}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*======================= Arrival Info =======================*/}
                                    <div>
                                        <h3 className="m-0 text-[1.6rem] text-[#0a2533] uppercase font-bold italic tracking-tighter flex items-center gap-2 leading-none">
                                            <svg viewBox="0 0 12 16" className="w-[16px] h-[20px] fill-primary italic-none"><path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3Z" /></svg>
                                            {route.to}
                                        </h3>
                                        <p className="mt-2.5 ml-[26px] text-[0.9rem] opacity-70 uppercase tracking-[0.2em] font-bold italic">{route.toTime}</p>
                                    </div>

                                    {/*======================= Pricing & Seat Availability =======================*/}
                                    <div className="flex items-center justify-center gap-10">
                                        <div className="flex flex-col">
                                            <div className="text-[1.7rem] font-bold italic tracking-tighter text-[#0a2533] leading-none">
                                                <span className="text-xl mr-0.5 font-bold text-primary italic">৳</span>{route.price}
                                            </div>
                                            <div className="text-[11px] text-[#8b9a9e] uppercase font-bold tracking-widest mt-2 italic">Per Person</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-[1.7rem] font-bold italic tracking-tighter text-[#0a2533] leading-none">{route.seats}</div>
                                            <div className="text-[11px] text-[#8b9a9e] uppercase font-bold tracking-widest mt-2 italic">Seats</div>
                                        </div>
                                    </div>

                                    {/* ======================= Action Button =======================*/}
                                    <div>
                                        <Link to={`/busdetails/${route.id}`}>
                                            <button className="bg-primary py-4.5 w-full uppercase font-bold italic tracking-[0.25em] text-[0.85rem] rounded-full cursor-pointer text-white transition-all hover:shadow-xl hover:brightness-110 active:scale-95">Details &rarr;</button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-24 text-center text-[#8b9a9e] text-2xl font-bold uppercase tracking-[0.3em] opacity-30 italic">No routes found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;