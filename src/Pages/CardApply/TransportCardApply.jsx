import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

// --- STYLING CONSTANTS ---
const inputStyle = "w-full bg-gray-100 border-none rounded-xl p-4 text-[#0a2533] font-bold italic uppercase tracking-wider text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30 appearance-none cursor-pointer";
const labelStyle = "block font-black text-[10px] uppercase tracking-[0.3em] opacity-70 text-black mb-2 ml-1";
const errorStyle = "text-red-500 text-[10px] font-black uppercase tracking-tighter mt-1 ml-1 italic";

const TransportCardApply = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    // Watch fields for dynamic calculations and display
    const selectedDuration = watch("duration");
    const selectedYear = watch("academicYear");
    const selectedSemester = watch("academicSemester");
    const pricePerSemester = 6000;
    
    const totalPrice = useMemo(() => {
        return (parseInt(selectedDuration) || 0) * pricePerSemester;
    }, [selectedDuration]);

    const onSubmit = (data) => {
        // --- SWEET ALERT PAYMENT FLOW ---
        Swal.fire({
            title: '<span class="font-black italic tracking-tighter uppercase text-2xl">Confirm Payment</span>',
            html: `
                <div class="text-left font-sans py-4">
                    <p class="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Total Amount</p>
                    <p class="text-4xl font-black italic text-primary leading-none mb-6">৳${totalPrice}</p>
                    <div class="space-y-2 opacity-80 uppercase text-xs font-bold italic">
                        <p>Student: ${data.fullName}</p>
                        <p>Academic: Year ${data.academicYear}, ${data.academicSemester} Semester</p>
                        <p>Plan: ${data.duration} Semester(s)</p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'PROCEED TO PAY',
            cancelButtonText: 'CANCEL',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-primary text-white px-8 py-4 rounded-full font-black italic tracking-widest uppercase text-xs mx-2 hover:scale-105 transition-all',
                cancelButton: 'bg-gray-200 text-gray-500 px-8 py-4 rounded-full font-black italic tracking-widest uppercase text-xs mx-2'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Processing...',
                    text: 'Redirecting to payment gateway.',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-white py-10 px-5 flex flex-col items-center font-sans text-left overflow-x-hidden">
            
            {/* Header Section */}
            <h1 className="text-4xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-none italic text-center">
                Card <span className='text-primary'>Application</span>
            </h1>
            <p className="text-sm text-center max-w-3xl md:text-lg opacity-50 my-4 uppercase tracking-[0.2em] md:tracking-[0.1em] font-bold italic">
                Secure your transport access. Fill in your academic details below.
            </p>

            {/* Form Section */}
            <div className="w-full max-w-2xl bg-[#F9FAFB] shadow-2xl rounded-3xl p-8 md:p-12 mt-6 border border-gray-300 relative overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className={labelStyle}>Full Name</label>
                            <input 
                                {...register("fullName", { required: "Full name is required" })}
                                placeholder="E.G. RIADUL ISLAM"
                                className="w-full bg-gray-100 border-none rounded-xl p-4 text-[#0a2533] font-bold italic uppercase tracking-wider text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30"
                            />
                            {errors.fullName && <p className={errorStyle}>{errors.fullName.message}</p>}
                        </div>

                        {/* Student ID */}
                        <div>
                            <label className={labelStyle}>Student ID</label>
                            <input 
                                {...register("studentId", { required: "ID is required" })}
                                placeholder="XX-XXXXX-X"
                                className="w-full bg-gray-100 border-none rounded-xl p-4 text-[#0a2533] font-bold italic uppercase tracking-wider text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30"
                            />
                            {errors.studentId && <p className={errorStyle}>{errors.studentId.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Academic Year Dropdown */}
                        <div>
                            <label className={labelStyle}>Academic Year</label>
                            <select 
                                {...register("academicYear", { required: "Required" })}
                                className={inputStyle}
                            >
                                <option value="">Select Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                            {errors.academicYear && <p className={errorStyle}>{errors.academicYear.message}</p>}
                        </div>

                        {/* Academic Semester Dropdown */}
                        <div>
                            <label className={labelStyle}>Academic Semester</label>
                            <select 
                                {...register("academicSemester", { required: "Required" })}
                                className={inputStyle}
                            >
                                <option value="">Select Semester</option>
                                <option value="1st">1st Semester</option>
                                <option value="2nd">2nd Semester</option>
                                <option value="3rd">3rd Semester</option>
                            </select>
                            {errors.academicSemester && <p className={errorStyle}>{errors.academicSemester.message}</p>}
                        </div>
                    </div>

                    {/* Purchased For */}
                    <div>
                        <label className={labelStyle}>Plan Duration</label>
                        <select 
                            {...register("duration", { required: "Select duration" })}
                            className={inputStyle}
                        >
                            <option value="">How many semesters are you paying for?</option>
                            <option value="1">1 Semester</option>
                            <option value="2">2 Semesters</option>
                            <option value="3">3 Semesters</option>
                        </select>
                        {errors.duration && <p className={errorStyle}>{errors.duration.message}</p>}
                    </div>

                    {/* Dynamic Payment Card */}
                    <div className={`mt-4 p-6 rounded-2xl border-2 border-dashed transition-all duration-500 ${totalPrice > 0 ? 'bg-primary/5 border-primary/20 scale-100 opacity-100' : 'bg-gray-50 border-gray-200 scale-95 opacity-50'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Calculated Fees</p>
                                <p className="text-[11px] font-bold italic uppercase opacity-40 mt-1">৳6,000 / Semester</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black italic tracking-tighter text-[#0a2533]">
                                    <span className="text-primary mr-1 text-xl">৳</span>{totalPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button 
                            type="submit"
                            className="bg-primary py-5 w-full uppercase font-black italic tracking-[0.3em] text-[1rem] rounded-full cursor-pointer text-white transition-all hover:shadow-2xl hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            Proceed to Payment &rarr;
                        </button>
                    </div>
                </form>

                {/* Decorative Background */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default TransportCardApply;