import React from 'react';
import bus from '../../../assets/abtImage.jpg'
import bus2 from '../../../assets/abtus2.jpg'
import bus3 from '../../../assets/abtus3.jpg'
import { GoClock } from "react-icons/go";
import { AiOutlineSafety } from "react-icons/ai";
import { LuLeafyGreen } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";

const AboutUs = () => {

    const allCards = [
        {
            logo: GoClock,
            title: 'Always on Time',
            description: 'Reliable bus schedules help students reach campus and return home on time without unnecessary delays.'
        },
        {
            logo: AiOutlineSafety,
            title: 'Safe and Secure',
            description: 'A trusted university transport system ensures safer daily travel with verified routes and dependable service.'
        },
        {
            logo: LuLeafyGreen,
            title: 'Eco-Friendly Environment',
            description: 'Using shared campus transport reduces fuel consumption and supports a cleaner, greener environment.'
        },
        {
            logo: GiReceiveMoney,
            title: 'Cost-Effective',
            description: 'Affordable transport options help students save money compared to daily rides on private vehicles or apps.'
        }
    ];

    return (
        <div className='max-w-11/12 xl:max-w-7xl mx-auto mt-20'>
            <p className='text-secondary font-extrabold text-3xl text-center'>About Us</p>
            <p className='font-medium text-base-content text-center mt-1 mb-2'>Everything you need to know about how our service works.</p>


            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 my-5 gap-6'>
                {
                    allCards.map((card, index) => (
                        <div
                            key={index}
                            className='bg-gray-100 p-8 rounded-3xl hover:scale-102 transition-all duration-100 cursor-pointer'
                        >
                            <card.logo className="text-5xl text-primary" />

                            <p className='font-bold text-xl text-secondary mt-4 mb-3'>
                                {card.title}
                            </p>

                            <p className='font-medium text-base-content text-[16px]'>
                                {card.description}
                            </p>
                        </div>
                    ))
                }
            </div>

            {/* Parent Div */}
            <div className="flex flex-col lg:flex-row items-center gap-10 my-15">

                {/* Left Image Grid */}
                <div className="flex-1 grid grid-cols-2 gap-3 h-full">

                    <img
                        src={bus}
                        alt=""
                        className="col-span-2 w-full h-64 object-cover rounded-2xl"
                    />

                    <img
                        src={bus2}
                        alt=""
                        className="w-full h-40 object-cover rounded-2xl"
                    />

                    <img
                        src={bus3}
                        alt=""
                        className="w-full h-40 object-cover rounded-2xl"
                    />

                </div>

                {/* Right Text */}
                <div className="flex-1 flex flex-col justify-center">

                    <p className="text-2xl md:text-4xl font-bold text-secondary mb-4 text-center lg:text-left">
                        Our Observation
                    </p>

                    <p className="text-lg leading-8 text-gray-700 text-justify mb-6">
                        Transportation is a major issue for both students and parents. Most university students are mature enough to travel to campus independently. In these cases, students use public transport from different places. DIU is always concerned about their students. For this purpose, we now have around 50+ buses exclusively used for students, faculty, admin personnel, and staff. A parent car and an ambulance are also available. The entire transportation system is managed from the Ashulia campus. All transports operate on different routes connecting campuses from Ashulia. Students just need to present their ID card to access this facility.
                    </p>

                    <button className="mt-2 flex items-center gap-2 btn-base py-2.5 sm:py-3 px-5 sm:px-6 bg-primary text-white border border-transparent w-fit">
                        Get Started
                        <FaArrowRight />
                    </button>

                </div>

            </div>
        </div>
    );
};

export default AboutUs;