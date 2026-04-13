import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { MdArrowOutward } from "react-icons/md";
import banner1 from '../../../assets/busses.png';
import banner2 from '../../../assets/routesss.png';
import banner3 from '../../../assets/service.png';
import { CiClock1 } from "react-icons/ci";
import { useNavigate } from 'react-router';

const Banner = () => {

    const title1 = <>Your Daily <span className='text-primary'>DIU Bus Ride</span>, Made Simple</>;
    const title2 = <>Track Routes,<span className='text-primary'>Schedules</span> in One Place</>;
    const title3 = <>Enjoy a Smarter, Safer <span className='text-primary'>Campus Commute</span></>;
    const navigate = useNavigate() ;

    const allBanners = [
        {
            title: title1,
            image: banner1,
            description:
                "Make your daily university travel easier with a dedicated transport platform designed specifically for DIU students. From checking available buses and routes to applying for transport services, everything is organized in one place to help you save time, avoid confusion, and enjoy a smoother commute every day."
        },
        {
            title: title2,
            image: banner2,
            description:
                "Stay informed with up-to-date route details, seat availability, pickup points, and transport schedules — all in one simple dashboard. No more uncertainty about bus timings or crowded rides. Plan your trips efficiently and travel to campus with greater convenience and peace of mind."
        },
        {
            title: title3,
            image: banner3,
            description:
                "Experience a smarter and more reliable campus transport system built to make student life easier. Manage transport applications, monitor payment status, receive important notices, and stay updated on route changes — all through a seamless digital solution tailored for DIU students."
        }
    ];

    return (
        <div className='max-w-11/12 xl:max-w-7xl mx-auto'>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
                pagination={{ clickable: true }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper my-6 rounded-2xl"
            >
                {allBanners.map((banner, index) => (
                    <SwiperSlide key={index}>

                        <div className="flex flex-col-reverse xl:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 bg-[#ECF1ED] p-6 sm:p-8 md:p-12 xl:p-20">

                            {/* LEFT TEXT SECTION */}
                            <div className="flex-1 text-center xl:text-left px-2 md:px-0">
                                <p className="font-extrabold text-2xl sm:text-3xl md:text-4xl xl:text-6xl text-secondary">
                                    {banner.title}
                                </p>

                                <p className="text-[#606060]  my-3 sm:my-4 md:my-6 line-clamp-4 md:line-clamp-none">
                                    {banner.description}
                                </p>
                                <div className="flex my-3 flex-wrap gap-3 sm:gap-4 justify-center xl:justify-start">

                                    <div className="flex justify-center gap-px">
                                        <button onClick={()=>navigate('/cardapply')} className="flex justify-center btn-base py-2.5 sm:py-3 px-5 sm:px-6 bg-primary text-white border border-transparent hover:bg-transparent hover:border-[#DADADA] hover:text-black transition-all">
                                            Apply for Card <MdArrowOutward className='inline text-xl'></MdArrowOutward>
                                        </button>
                                    </div>

                                    
                                </div>
                            </div>

                            {/* RIGHT IMAGE SECTION (BIGGER) */}
                            <div className="flex-[1.2] flex justify-center items-center">
                                <img
                                    src={banner.image}
                                    alt=""
                                    className="w-full max-w-none object-contain h-40 md:h-100"
                                />
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
        </div>
    );
};

export default Banner;