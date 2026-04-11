import React, { useMemo, useState, useEffect } from 'react';
import useAxios from '../../hooks/Axios/useAxios';

const Schedule = () => {
    const [dbRoutes, setDbRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFromLocation, setSelectedFromLocation] = useState('');
    const [selectedToLocation, setSelectedToLocation] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const axiosInstance = useAxios();

    const getDayName = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const d = new Date(dateString);
        return days[d.getDay()];
    };

    const navDays = useMemo(() => {
        const today = new Date();
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            const dayNum = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            days.push({
                day: i === 0 ? 'TODAY' : dayNames[date.getDay()],
                date: `${dayNum} ${month}`,
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return days;
    }, []);

    const [selectedDate, setSelectedDate] = useState(navDays[0].fullDate);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const dayName = getDayName(selectedDate);
                const params = { day: dayName };
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
    }, [selectedDate, selectedFromLocation, selectedToLocation, axiosInstance]);

    const routes = useMemo(() => {
        return dbRoutes.map(r => {
            const uiRoute = {
                ...r,
                id: r.route_id,
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
                    if (fromIdx !== -1) {
                        stopArray.slice(fromIdx + 1).forEach(s => stops.add(s));
                    }
                } else {
                    stopArray.forEach(s => stops.add(s));
                }
            }
        });
        return [...stops].sort();
    }, [dbRoutes, selectedFromLocation]);

    const routeOptions = useMemo(() => [...new Set(routes.map(r => r.id?.split('-')[0]))].filter(Boolean).sort(), [routes]);

    const filteredRoutes = useMemo(() => {
        return routes.filter(route => !selectedRoute || route.id.startsWith(selectedRoute));
    }, [selectedRoute, routes]);

    return (
        <div className="min-h-screen bg-[#f4f7f6] py-10 px-5 flex flex-col items-center font-sans text-left">
            <h1 className="text-[#0a2533] uppercase tracking-[1px] text-4xl mb-8 font-bold text-center">Recent Schedule</h1>
            <p className="text-base-content text-center mb-6 max-w-lg">
                Explore all available bus routes, departure times, and seat availability for incoming and outgoing trips. Select a date to view the full daily schedule.
            </p>

            {/* Filters Section */}
            <div className="w-full max-w-[1100px] bg-gray-200 p-10 mb-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[#0a2533] font-bold mb-2 text-sm">From Location</label>
                        <select value={selectedFromLocation} onChange={(e) => { setSelectedFromLocation(e.target.value); setSelectedToLocation(''); }} className="w-full px-4 py-3 border-2 rounded-2xl bg-white text-[#0a2533] font-medium outline-none focus:border-[#0a2533]">
                            <option value="">All Locations</option>
                            {fromLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#0a2533] font-bold mb-2 text-sm">To Location</label>
                        <select value={selectedToLocation} onChange={(e) => setSelectedToLocation(e.target.value)} className="w-full px-4 py-3 border-2 rounded-2xl bg-white text-[#0a2533] font-medium outline-none focus:border-[#0a2533]">
                            <option value="">All Locations</option>
                            {toLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#0a2533] font-bold mb-2 text-sm">Route</label>
                        <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className="w-full px-4 py-3 border-2 rounded-2xl bg-white text-[#0a2533] font-medium outline-none focus:border-[#0a2533]">
                            <option value="">All Routes</option>
                            {routeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
                {(selectedFromLocation || selectedToLocation || selectedRoute) && (
                    <button onClick={() => { setSelectedFromLocation(''); setSelectedToLocation(''); setSelectedRoute(''); }} className="mt-4 px-4 py-2 bg-primary text-[#0a2533] font-bold rounded text-sm text-white transition-colors">Clear Filters</button>
                )}
            </div>

            <div className="w-full max-w-[1100px] bg-white shadow-lg flex flex-col relative rounded-2xl overflow-hidden">
                {/* Sticky Date Nav - Responsive with overflow-x-auto */}
                <div className="sticky top-0 z-40 bg-[#0a2533] flex overflow-x-auto no-scrollbar text-white text-center shadow-md">
                    <div className="flex flex-nowrap min-w-full">
                        {navDays.map((item, index) => {
                            const isActive = item.fullDate === selectedDate;
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => setSelectedDate(item.fullDate)} 
                                    className={`flex-1 min-w-[120px] md:min-w-0 p-5 border-r border-white/10 cursor-pointer transition-colors text-sm ${isActive ? 'bg-primary text-white font-bold text-base flex items-center justify-center' : 'text-[#8fa0a8] hover:bg-white/10'}`}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>{item.day}</span>
                                        {!isActive && <span className="block text-[1.1rem] font-bold mt-1.5 text-white">{item.date}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-visible">
                    {/* min-h ensures tooltip has space even if only 1 bus is found */}
                    <div className={`min-w-[900px] transition-all duration-300 ${filteredRoutes.length === 1 ? 'min-h-[550px]' : 'pb-32'}`}>
                        {loading ? (
                            <div className="p-12 text-center text-[#8b9a9e] animate-pulse font-bold">Searching routes for {getDayName(selectedDate)}...</div>
                        ) : filteredRoutes.length > 0 ? (
                            filteredRoutes.map((route, idx) => (
                                <div key={idx} className="grid grid-cols-[1fr_1.5fr_1fr_1.5fr_1.2fr] items-center bg-[#f5f7f8] m-2.5 p-6 hover:bg-[#ebf0f1] transition-colors relative">
                                    {/* From */}
                                    <div>
                                        <h3 className="m-0 text-[1.3rem] text-[#0a2533] uppercase flex items-center gap-2 font-bold">
                                            <svg viewBox="0 0 12 16" className="w-[14px] h-[18px] fill-primary"><path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3Z" /></svg>
                                            {route.from}
                                        </h3>
                                        <p className="mt-2 ml-[22px] text-[0.9rem] text-[#0a2533] font-medium">{route.fromTime}</p>
                                    </div>

                                    {/* Route Visual & Tooltip */}
                                    <div className="flex items-center justify-center px-5 relative -mt-4 group py-4 cursor-pointer">
                                        <div className="flex-grow border-b-2 border-dotted border-[#b0bcc0] relative group-hover:border-primary transition-colors duration-300">
                                            <div className="absolute -top-[5px] -left-[5px] w-2 h-2 border-2 border-[#b0bcc0] rounded-full bg-[#f5f7f8] group-hover:border-primary transition-colors duration-300"></div>
                                            <div className="absolute -top-[5px] -right-[5px] w-2 h-2 border-2 border-[#b0bcc0] rounded-full bg-[#f5f7f8] group-hover:border-primary transition-colors duration-300"></div>
                                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-[#8b9a9e] font-bold group-hover:text-[#0a2533] transition-colors duration-300">{route.id}</span>
                                        </div>

                                        {/* Dropdown Tooltip - Uses high z-index and origin-top */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] opacity-0 invisible scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all z-50 origin-top pointer-events-none">
                                            <div className="bg-[#0a2533] text-white px-5 py-3 rounded-t-xl font-bold text-sm">Route {route.id} Stops</div>
                                            <div className="p-5 max-h-[260px] overflow-y-auto">
                                                <div className="relative border-l-2 border-primary ml-2 space-y-4">
                                                    {route.stopsList.map((stop, i) => (
                                                        <div key={i} className="relative pl-5 flex justify-between items-center text-left">
                                                            <span className="absolute -left-[9px] top-[2px] w-4 h-4 rounded-full bg-white border-[3px] border-primary"></span>
                                                            <span className="text-sm text-[#0a2533] font-semibold">{stop.name}</span>
                                                            <span className="text-xs text-[#8b9a9e] font-bold bg-[#f5f7f8] px-2 py-1 rounded">{stop.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* To */}
                                    <div>
                                        <h3 className="m-0 text-[1.3rem] text-[#0a2533] uppercase flex items-center gap-2 font-bold">
                                            <svg viewBox="0 0 12 16" className="w-[14px] h-[18px] fill-primary"><path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3Z" /></svg>
                                            {route.to}
                                        </h3>
                                        <p className="mt-2 ml-[22px] text-[0.9rem] text-[#0a2533] font-medium">{route.toTime}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="flex flex-col">
                                            <div className="text-[1.4rem] font-bold text-[#0a2533]"><span className="text-[1.1rem] mr-1 font-extrabold">৳</span>{route.price}</div>
                                            <div className="text-[0.8rem] text-[#8b9a9e]">per person</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-[1.4rem] font-bold text-[#0a2533]">{route.seats}</div>
                                            <div className="text-[0.8rem] text-[#8b9a9e]">seats left</div>
                                        </div>
                                    </div>

                                    <div>
                                        <button className="bg-primary py-4 w-full uppercase font-bold text-[0.85rem] rounded-4xl cursor-pointer text-white transition-all hover:shadow-md">BUY TICKETS &rarr;</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-[#8b9a9e] text-lg font-medium italic">No routes found for your search criteria.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;