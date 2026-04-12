import React, { useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaEdit, FaUserShield, FaArrowRight, FaRegDotCircle, FaUserMinus } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../../hooks/Axios/useAxios';

const Manage = () => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();
    const [selectedDay, setSelectedDay] = useState("All");
    const [editingBus, setEditingBus] = useState(null);
    const addModalRef = useRef();

    // Pagination States
    const [busPage, setBusPage] = useState(1);
    const [studentPage, setStudentPage] = useState(1);
    const itemsPerPage = 8;

    const { register, handleSubmit, reset, setValue } = useForm();

    // ---------------- Fetching Bus data from api ----------------
    const { data: busses = [], refetch: refetchBusses, isLoading: busLoading } = useQuery({
        queryKey: ['manage-busses', selectedDay],
        queryFn: async () => {
            const res = await axiosInstance.get(`/manage-busses?day=${selectedDay}`);
            return res.data;
        }
    });

    // ---------------- Fetching Student data from api ----------------
    const { data: students = [], refetch: refetchStudents, isLoading: studentLoading } = useQuery({
        queryKey: ['admin-students'],
        queryFn: async () => {
            const res = await axiosInstance.get('/admin/students');
            return res.data;
        }
    });

    // ---------------- User Management Mutations ----------------

    // 1. Promote Admin (Sets role = 'admin' in users table)
    const promoteAdminMutation = useMutation({
        mutationFn: (id) => axiosInstance.patch(`/admin/users/promote/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-students']);
            Swal.fire({ title: "PROMOTED", text: "User is now an admin.", icon: "success" });
        }
    });

    // 2. Revoke (Sets role = 'user' and deletes from student table)
    const revokeUserMutation = useMutation({
        mutationFn: ({ userId, studentId }) => axiosInstance.patch(`/admin/users/revoke/${userId}`, { student_id: studentId }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-students']);
            Swal.fire({ title: "REVOKED", text: "User role reset and student record removed.", icon: "info" });
        }
    });

    // 3. Delete (Deletes from users table and student table)
    const deleteUserMutation = useMutation({
        mutationFn: ({ userId, studentId }) => axiosInstance.delete(`/admin/users/${userId}`, { data: { student_id: studentId } }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-students']);
            Swal.fire({ title: "DELETED", text: "User removed from system.", icon: "success" });
        }
    });

    // ---------------- Bus Management Mutations ----------------
    const addBusMutation = useMutation({
        mutationFn: (newBus) => axiosInstance.post('/bus-routes', newBus),
        onSuccess: () => {
            queryClient.invalidateQueries(['manage-busses']);
            Swal.fire({ title: "SUCCESS", text: "New route created.", icon: "success" });
            addModalRef.current.close();
            reset();
        }
    });

    const updateBusMutation = useMutation({
        mutationFn: (updatedData) => axiosInstance.patch(`/bus-routes/${editingBus.id}`, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries(['manage-busses']);
            Swal.fire({ title: "UPDATED", text: "Route details saved.", icon: "success" });
            addModalRef.current.close();
            setEditingBus(null);
            reset();
        }
    });

    const deleteBusMutation = useMutation({
        mutationFn: (id) => axiosInstance.delete(`/bus-routes/${id}`).then(() => refetchBusses()),
        onSuccess: () => queryClient.invalidateQueries(['manage-busses'])
    });

    // ---------------- Pagination Logic -------------------
    const paginatedBusses = useMemo(() => {
        const lastIndex = busPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return busses.slice(firstIndex, lastIndex);
    }, [busses, busPage]);

    const paginatedStudents = useMemo(() => {
        const lastIndex = studentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return students.slice(firstIndex, lastIndex);
    }, [students, studentPage]);

    // ---------------- Handlers & Alerts -------------------
    const openEditModal = (bus) => {
        setEditingBus(bus);
        Object.keys(bus).forEach(key => setValue(key, bus[key]));
        addModalRef.current.showModal();
    };

    const handlePromoteAdmin = (id) => {
        Swal.fire({
            title: "PROMOTE TO ADMIN?",
            text: "Grant full administrative access to this user?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0a2533",
            confirmButtonText: "YES, PROMOTE",
        }).then((result) => {
            if (result.isConfirmed) promoteAdminMutation.mutate(id);
        });
    };

    const handleRevokeUser = (userId, studentId) => {
        Swal.fire({
            title: "REVOKE STATUS?",
            text: "This will set role to 'user' and DELETE the student record!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F99D25",
            confirmButtonText: "YES, REVOKE",
        }).then((result) => {
            if (result.isConfirmed) revokeUserMutation.mutate({ userId, studentId });
        });
    };

    const handleDeleteUser = (userId, studentId) => {
        Swal.fire({
            title: "DELETE USER?",
            text: "This will permanently remove the user and all associated data!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#e83330",
            confirmButtonText: "YES, DELETE EVERYTHING",
        }).then((result) => {
            if (result.isConfirmed) deleteUserMutation.mutate({ userId, studentId });
        });
    };

    const handleDeleteBus = (id) => {
        Swal.fire({
            title: "DELETE ROUTE?",
            text: "This operation cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0a2533",
            confirmButtonText: "YES, DELETE",
        }).then((result) => {
            if (result.isConfirmed) deleteBusMutation.mutate(id);
        });
    };

    const handleFormSubmit = (data) => editingBus ? updateBusMutation.mutate(data) : addBusMutation.mutate(data);

    return (
        <div className="min-h-screen pb-24 max-w-11/12 md:max-w-7xl mx-auto px-4 md:px-10 font-sans">
            
            {/* --- FLEET SECTION --- */}
            <section className="pt-20">
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                    Bus <span className="italic text-primary">Collection</span>
                </h3>
                <p className="text-sm max-w-xl my-10 md:text-xl opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic text-black">
                    Manage and update campus shuttle schedules, routes, and pricing details.
                </p>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <select 
                        onChange={(e) => { setSelectedDay(e.target.value); setBusPage(1); }}
                        className="select select-bordered w-full md:w-64 font-black italic uppercase tracking-widest text-xs border-gray-300"
                    >
                        <option value="All">All Schedules</option>
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => { setEditingBus(null); reset(); addModalRef.current.showModal(); }}
                        className="btn btn-primary rounded-full px-10 font-black italic uppercase tracking-widest text-white shadow-lg"
                    >
                        <FaPlus /> New Route
                    </button>
                </div>

                <div className="overflow-x-auto border border-gray-300 bg-white py-2 rounded-2xl my-7 shadow-sm">
                    <table className="table table-zebra w-full text-center">
                        <thead>
                            <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-300">
                                <th>No.</th>
                                <th>Bus Identity</th>
                                <th>Assigned Route</th>
                                <th>Operating Day</th>
                                <th>Fare</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBusses.map((bus, index) => (
                                <tr key={bus.id} className='text-black hover:bg-gray-100'>
                                    <th className="text-[10px] font-black italic opacity-50">{(busPage - 1) * itemsPerPage + index + 1}</th>
                                    <td>
                                        <p className="text-sm font-black italic text-[#0a2533]">BUS-{bus.route_id}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1 italic tracking-tighter">{bus.seats} Seats</p>
                                    </td>
                                    <td>
                                        <p className="text-xs font-black italic uppercase tracking-tight text-slate-600 leading-none">
                                            {bus.from} <FaArrowRight className="inline mx-1 text-xs opacity-30" /> {bus.to}
                                        </p>
                                    </td>
                                    <td className="text-xs font-bold text-[#0a2533] italic uppercase opacity-70">{bus.day}</td>
                                    <td>
                                        <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest italic bg-primary/10 text-primary inline-flex items-center gap-2 leading-none">
                                            <FaRegDotCircle className="animate-pulse" />
                                            ৳{bus.price}
                                        </span>
                                    </td>
                                    <td className='flex justify-center gap-2'>
                                        <button onClick={() => openEditModal(bus)} className='btn btn-sm bg-[#94c6cb38] text-black border-none hover:bg-primary hover:text-white font-black italic uppercase text-[10px]'>Edit</button>
                                        <button onClick={() => handleDeleteBus(bus.id)} className='btn btn-sm bg-[#e833301a] text-[#E83330] border-none hover:bg-red-600 hover:text-white font-black italic uppercase text-[10px]'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center join">
                    <button onClick={() => setBusPage(p => Math.max(1, p - 1))} className="join-item btn btn-sm font-black italic uppercase">«</button>
                    <button className="join-item btn btn-sm font-black italic uppercase">Page {busPage}</button>
                    <button onClick={() => setBusPage(p => paginatedBusses.length === itemsPerPage ? p + 1 : p)} className="join-item btn btn-sm font-black italic uppercase">»</button>
                </div>
            </section>

            {/* --- USER REGISTRY --- */}
            <section className="pt-20">
                <h3 className="text-4xl text-center md:text-6xl font-black tracking-tighter leading-none uppercase">
                    User <span className="italic text-primary">Registry</span>
                </h3>
                <p className="text-sm text-center max-w-2xl mx-auto my-5 md:text-xl opacity-50 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic text-black">
                    Institutional verification, academic status, and system permission control.
                </p>

                <div className="overflow-x-auto border border-gray-300 bg-white py-2 rounded-2xl my-7 shadow-sm">
                    <table className="table table-zebra w-full text-center">
                        <thead>
                            <tr className="text-slate-400 text-[9px] uppercase font-black tracking-[0.2em] border-b border-gray-300">
                                <th>No.</th>
                                <th>Student Profile</th>
                                <th>Institutional Status</th>
                                <th>Card Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStudents.map((std, index) => (
                                <tr key={std.user_id || index} className='text-black hover:bg-gray-100'>
                                    <th className="text-[10px] font-black italic opacity-50">{(studentPage - 1) * itemsPerPage + index + 1}</th>
                                    <td>
                                        <p className="text-sm font-black italic text-[#0a2533] uppercase leading-none">{std.name || "GUEST USER"}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1 italic tracking-tighter">{std.student_id ? "STUDENT" : "NOT VERIFIED"}</p>
                                    </td>
                                    <td>
                                        <p className="text-xs font-black italic uppercase tracking-tight text-slate-600 leading-none">{std.department || "N/A"}</p>
                                        <p className="text-[9px] font-bold italic opacity-40 uppercase mt-1">Year {std.academic_year || '?'}</p>
                                    </td>
                                    <td>
                                        <span className={`text-[10px] font-black uppercase italic tracking-widest ${std.card_status === 'active' ? 'text-[#0AB010]' : 'text-[#F99D25]'}`}>
                                            {std.card_status || 'None'}
                                        </span>
                                    </td>
                                    <td className='flex justify-center gap-2'>
                                        <button 
                                            onClick={() => handlePromoteAdmin(std.user_id)}
                                            className='btn btn-sm bg-[#94c6cb38] text-black border-none hover:bg-[#0a2533] hover:text-white font-black italic uppercase text-[9px]'
                                        >
                                            <FaUserShield /> Promote Admin
                                        </button>
                                        <button 
                                            onClick={() => handleRevokeUser(std.user_id, std.student_id)}
                                            className='btn btn-sm bg-orange-50 text-orange-600 border-none hover:bg-orange-600 hover:text-white font-black italic uppercase text-[9px]'
                                        >
                                            <FaUserMinus /> Revoke
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(std.user_id, std.student_id)}
                                            className='btn btn-sm bg-[#e833301a] text-[#E83330] border-none hover:bg-red-600 hover:text-white font-black italic uppercase text-[9px]'
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center join">
                    <button onClick={() => setStudentPage(p => Math.max(1, p - 1))} className="join-item btn btn-sm font-black italic uppercase">«</button>
                    <button className="join-item btn btn-sm font-black italic uppercase">Page {studentPage}</button>
                    <button onClick={() => setStudentPage(p => paginatedStudents.length === itemsPerPage ? p + 1 : p)} className="join-item btn btn-sm font-black italic uppercase">»</button>
                </div>
            </section>

            {/* --- BUS MODAL --- */}
            <dialog ref={addModalRef} className="modal backdrop-blur-sm">
                <div className="modal-box rounded-3xl border-4 border-[#0a2533] p-10 max-w-2xl bg-white shadow-2xl">
                    <h3 className="font-black italic text-4xl uppercase tracking-tighter text-[#0a2533] mb-10 text-center leading-none">
                        {editingBus ? 'Update' : 'New'} <span className="text-primary">Journey</span>
                    </h3>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold italic uppercase">
                        <div className="form-control col-span-1">
                            <label className="label text-[10px] font-black opacity-40 italic">Route ID</label>
                            <input {...register("route_id")} className="input input-bordered rounded-xl border-gray-300" required />
                        </div>
                        <div className="form-control col-span-1">
                            <label className="label text-[10px] font-black opacity-40 italic">Day</label>
                            <select {...register("day")} className="select select-bordered rounded-xl border-gray-300 font-bold italic">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <input {...register("from")} placeholder="ORIGIN" className="input input-bordered rounded-xl border-gray-300" required />
                        <input {...register("to")} placeholder="DESTINATION" className="input input-bordered rounded-xl border-gray-300" required />
                        <input {...register("from_time")} type="time" className="input input-bordered rounded-xl border-gray-300" />
                        <input {...register("to_time")} type="time" className="input input-bordered rounded-xl border-gray-300" />
                        <input {...register("price")} type="number" placeholder="FARE" className="input input-bordered rounded-xl border-gray-300" />
                        <input {...register("seats")} type="number" placeholder="SEATS" className="input input-bordered rounded-xl border-gray-300" />
                        <textarea {...register("stops_str")} placeholder="TRANSIT STOPS..." className="textarea textarea-bordered rounded-xl border-gray-300 col-span-1 md:col-span-2 h-32" />
                        
                        <button type="submit" className="btn btn-primary btn-block rounded-xl col-span-1 md:col-span-2 font-black italic uppercase tracking-[0.2em] h-16 mt-4 text-white">
                            {editingBus ? 'Save Changes' : 'Confirm Entry'}
                        </button>
                    </form>
                    <form method="dialog" className="mt-6 text-center">
                        <button className="text-[10px] font-black uppercase italic opacity-20 hover:opacity-100 transition-opacity" onClick={() => { setEditingBus(null); reset(); }}>Close</button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default Manage;