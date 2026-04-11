import React from 'react';
import {
    FiSend,
    FiMail,
    FiMapPin,
    FiPhone,
} from 'react-icons/fi';
import {
    FaLinkedinIn,
    FaGithub,
    FaFacebookF,
} from 'react-icons/fa';

const Contact = () => {
    return (
        <div className='max-w-11/12 xl:max-w-7xl mx-auto my-10'>
            <div className="mb-12 md:mb-20 text-center lg:text-left">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none text-base-content">
                    Contact Transport <span className="text-primary italic">Services</span>
                </h2>
                <p className="text-sm md:text-xl opacity-50 mt-4 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold italic">
                    Need help with routes, schedules, or buses? Let us know
                </p>
            </div>

            <div className="grid bg-gray-100 grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 rounded-2xl backdrop-blur-3xl border border-base-content/10 p-6 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden">

                {/* Left Side */}
                <div className="space-y-10 md:space-y-12 order-2 lg:order-1">
                    <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-base-content">
                            Need a Ride? Contact Us
                        </h3>
                        <p className="text-base md:text-lg opacity-70 leading-relaxed max-w-md mx-auto lg:mx-0 text-base-content">
                            We're here to assist you with your daily campus transportation needs!
                        </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group cursor-pointer text-center sm:text-left">
                            <div className="p-3 md:p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                                <FiMail className="text-[22px] md:text-[24px]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                                    Primary Email
                                </p>
                                <p className="text-base md:text-lg font-bold text-base-content break-all">
                                    anisurrahman699@gmail.com
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group cursor-pointer text-center sm:text-left">
                            <div className="p-3 md:p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                                <FiPhone className="text-[22px] md:text-[24px]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                                    Voice / WhatsApp
                                </p>
                                <a
                                    href="tel:+8801881463387"
                                    className="text-base md:text-lg font-bold text-base-content hover:text-primary transition-colors"
                                >
                                    +8801847140037
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group cursor-pointer text-center sm:text-left">
                            <div className="p-3 md:p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                                <FiMapPin className="text-[22px] md:text-[24px]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                                    Location
                                </p>
                                <p className="text-base md:text-lg font-bold text-base-content">
                                    Dhaka, Bangladesh
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-start gap-3 md:gap-4">
                        {[
                            { icon: <FaGithub /> },
                            { icon: <FaLinkedinIn /> },
                            { icon: <FaFacebookF /> }
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.link}
                                target="_blank"
                                rel="noreferrer"
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-base-content/5 border border-base-content/10 hover:bg-primary hover:text-white transition-all duration-500 text-xl"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right Side Form */}
                <form className="space-y-5 md:space-y-6 order-1 lg:order-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 text-base-content">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-5 py-3.5 md:px-6 md:py-4 rounded-xl mt-2 bg-base-content/5 border border-base-content/10 text-base-content focus:border-primary/50 focus:bg-base-content/10 focus:outline-none transition-all duration-300 placeholder:opacity-30 text-sm md:text-base"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 text-base-content">
                            Return Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-5 py-3.5 md:px-6 md:py-4 rounded-xl mt-2 bg-base-content/5 border border-base-content/10 text-base-content focus:border-primary/50 focus:bg-base-content/10 focus:outline-none transition-all duration-300 placeholder:opacity-30 text-sm md:text-base"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 text-base-content">
                            Message
                        </label>
                        <textarea
                            rows="4"
                            className="w-full px-5 py-3.5 md:px-6 md:py-4 rounded-xl mt-2 bg-base-content/5 border border-base-content/10 text-base-content focus:border-primary/50 focus:bg-base-content/10 focus:outline-none transition-all duration-300 resize-none placeholder:opacity-30 text-sm md:text-base"
                            placeholder="Engineering requirement details..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold tracking-wide hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FiSend className="text-lg" />
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;