import axios from 'axios';
import { use, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Providers/AuthProvider/AuthProvider';


const axiosInstance = axios.create({
    // baseURL : `https://diutransitserver.vercel.app`
    baseURL : `http://localhost:3000`
});

const useAxios = () => {
    const { user, LogOut } = use(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.accessToken) return;

        // ================= REQUEST INTERCEPTOR =================
        const reqInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        // ================= RESPONSE INTERCEPTOR =================
        const resInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    console.warn("Unauthorized or Forbidden — Logging out...");

                    LogOut().then(() => {
                        navigate('/');
                    });
                }

                return Promise.reject(error);
            }
        );

        // ================= CLEANUP =================
        return () => {
            axiosInstance.interceptors.request.eject(reqInterceptor);
            axiosInstance.interceptors.response.eject(resInterceptor);
        };
    }, [user?.accessToken, LogOut, navigate]);

    return axiosInstance;
};

export default useAxios;