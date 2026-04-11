import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : `https://diutransitserver.vercel.app`
    // baseURL : `http://localhost:3000`
})

const useAxios = () => {
    return axiosInstance ;
};

export default useAxios;