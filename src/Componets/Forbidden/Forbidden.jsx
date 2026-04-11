import { Link } from "react-router";
import photo from '../../assets/unauth.png'
import { IoMdArrowRoundBack } from "react-icons/io";

const Forbidden = () => {
    return (
        <div>
            <div className='max-w-7xl mx-auto'>
                <div className='min-h-screen space-y-4 flex flex-col justify-center items-center '>
                    <img src={photo} alt="" className='max-h-100' />
                    <Link to={'/'}><button className=' btn px-10 py-3 bg-primary text-white rounded-xl text-black font-bold hover:scale-105 transition-transform'><IoMdArrowRoundBack></IoMdArrowRoundBack> Go Back</button></Link>
                </div>

            </div>
        </div>
    );
};

export default Forbidden;