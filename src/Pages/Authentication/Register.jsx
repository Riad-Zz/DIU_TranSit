import React, { use, useRef, useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import imageUpload from '../../assets/avatat.png'
import { AuthContext } from '../../Providers/AuthProvider/AuthProvider';
import axios from 'axios';
import useAxios from "../../hooks/Axios/useAxios"

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const [eye, setEye] = useState(false);
    const [preview, setPreview] = useState(imageUpload)
    const { user, setUser, googleLogin, EmailRegister, updateUser } = use(AuthContext)
    const location = useLocation();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);  //HIU 01
    const axiosInstance = useAxios()

    //----------Hidden Image upload field Activate Control (HIU) -----------
    //HIU ------> 02  
    const handleUploadAvater = () => {
        imageInputRef.current.click();
    }
    //HIU ------> 03
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
        // console.log(file);
    }

    const handleEyeClick = (e) => {
        e.preventDefault();
        setEye(!eye);
    }

    const handleRegister = async (data, e) => {
        console.log(data);
        const profileImage = data.avatar[0];
        e.target.reset();
        setPreview(imageUpload)
        const formData = new FormData();
        formData.append('image', profileImage)
        const profileImageApiURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`

        const res = await axios.post(profileImageApiURL, formData);
        const finalImageURL = res.data.data.url;
        console.log(finalImageURL);


        EmailRegister(data.email, data.password)
            .then(async (result) => {
                const currentUser = result.user
                setUser(currentUser);
                navigate(location.state || '/');
                if (currentUser) {
                    await updateUser({ displayName: data.name, photoURL: finalImageURL })
                        .then(() => {
                            setUser({ ...currentUser, displayName: data.name, photoURL: finalImageURL })
                        })
                        .catch(error => {
                            const errorMessage = error.message;
                            console.log(errorMessage);
                        })
                    const newUser = {
                        name: data.name,
                        email: data.email
                    }

                    //-------------Save the user to Database ---------------------
                    axiosInstance.post('/users', newUser)
                        .then(data => {
                            if(data.data.id){
                                console.log(data.data.id) ;
                            }
                        })

                    
                }
            })
    }

    //-----------------Handle Google Login --------------------------------
    const handleGoogleLogin = () => {
        googleLogin().then((result) => {
            const currentUser = result.user
            setUser(currentUser);
            navigate(location.state || '/');

            const newUser = {
                name: currentUser.displayName,
                email: currentUser.email,
            }

            //-------------Save the user to Database ---------------------
                    axiosInstance.post('/users', newUser)
                        .then(data => {
                            console.log(data) ;
                            if(data.data.id){
                                console.log(data.data.id) ;
                            }
                        })

        })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }


    return (
        <div className='flex mt-12 items-center justify-center p-2 '>

            <form onSubmit={handleSubmit(handleRegister)} className='w-full lg:mt-20 xl:mt-0 max-w-md py-10 px-5 p-2 border border-[#94A3B8] lg:border-none rounded-2xl lg:p-0'>
                <p className='text-black text-center text-3xl md:text-4xl 2xl:text-left font-bold'>
                    Create an Account
                </p>
                <p className='text-black mb-5 text-center 2xl:text-left'>Register with RouteSync</p>
                <div className='my-4 flex flex-col items-center gap-2'>
                    <img src={preview} alt=""
                        className='cursor-pointer h-13 w-13 rounded-full object-cover'
                        // HIU ------> 04 
                        onClick={handleUploadAvater}
                    />
                    <p className='text-[#403F3F] font-bold'>Upload Your Avatar</p>
                </div>

                {/*------------------ Hidden Input field to Upload image ---------------- */}


                {/* HIU ------> 05  */}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("avatar", {
                        required: "Avatar is required"
                    })}
                    ref={(e) => {
                        register("avatar").ref(e);
                        imageInputRef.current = e;
                    }}
                    onChange={(e) => {
                        register("avatar").onChange(e);
                        handleFileChange(e);
                    }}
                />

                {errors.avatar && (
                    <p className="text-red-600 text-sm mb-2 text-center ">{errors.avatar.message}</p>
                )}

                {/* Name  */}
                <label className="label font-bold text-[#403F3F] text-[16px] mb-2">Name</label>
                <input
                    type="text"
                    className="input mb-3 w-full bg-white border-[#94A3B8] py-4 px-4 rounded-lg outline-none"
                    placeholder="Name"
                    name='name'
                    {...register('name', { required: true })}
                />
                {errors.name && <p className='text-red-600 mb-2 text-sm'>Name is Mendatory</p>}

                {/* Email  */}

                <label className="label font-bold text-[#403F3F] text-[16px] mb-2">Email</label>
                <input
                    type="email"
                    className="input mb-3 w-full bg-white border-[#94A3B8] py-4 px-4 rounded-lg outline-none"
                    placeholder="Email"
                    name='email'
                    {...register('email', { required: true })}
                />
                {errors.email && <p className='text-red-600 text-sm mb-2'>Please Enter your Email</p>}

                {/* Password  */}
                <label className="label font-bold text-[#403F3F] text-[16px] mb-2 ">Password</label>
                <div className='relative'>
                    <input
                        type={`${eye ? "text" : "password"}`}
                        className="input mb-3 w-full bg-white border-[#94A3B8] pr-10 py-4 px-4 rounded-lg outline-none"
                        placeholder="Password"
                        name='password'
                        //---------------------Password Validate-------------------------------- 
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            },
                            validate: {
                                hasUppercase: value =>
                                    /[A-Z]/.test(value) || "At least one uppercase letter required",

                                hasLowercase: value =>
                                    /[a-z]/.test(value) || "At least one lowercase letter required",

                                hasNumber: value =>
                                    /\d/.test(value) || "At least one number required",
                            }
                        })}

                    />
                    {
                        eye ? <FaEyeSlash onClick={handleEyeClick} className='z-10 absolute right-4 bottom-5 text-xl text-gray-800'></FaEyeSlash> : <FaEye onClick={handleEyeClick} className='z-10 absolute right-4 bottom-5 text-xl text-gray-800'></FaEye>
                    }
                </div>
                {errors.password && (
                    <p className="text-red-600 mb-2 text-sm">{errors.password.message}</p>
                )}

                <div className='mt-3 flex items-center md:flex-row gap-3 justify-between'>
                    <div className='flex items-center gap-2'>
                        <input type="checkbox" className="checkbox " />
                        <p className='font-bold text-sm'>Remember me</p>
                    </div>

                </div>

                <button type="submit" className="btn mt-7 mb-3 bg-primary transition font-bold border-none text-white w-full py-3 rounded-lg">
                    Register
                </button>

                <p className='text-center font-semibold text-gray-500 mb-4'>OR</p>

                <button onClick={handleGoogleLogin} type="button" className="btn font-bold bg-[#E9ECF1] text-black border border-[#e5e5e5] w-full flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-200 transition">
                    <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                        <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                        <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                    </svg>
                    Login with Google
                </button>

                <p className='text-[#706F6F] text-center mt-6'>
                    Already have an account?{' '}
                    <Link to={'/login'} className='font-bold text-[#8FA748]'>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;