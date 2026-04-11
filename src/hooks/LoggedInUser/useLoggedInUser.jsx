import React from 'react';
import useAxios from '../Axios/useAxios';
import { useQuery } from '@tanstack/react-query';


const useLoggedInUser = (email) => {
    const axiosInstance = useAxios() ;

    const {data : LoggedInUser =[] , refetch} = useQuery({
        queryKey : ['loggedInuser',`${email}`] ,
        enabled : !!email ,
        queryFn : async()=>{
            const result = await axiosInstance.get(`/users?email=${email}`)
            // console.log(result.data) ;
            return result.data[0] ;
        }
    })
    return {LoggedInUser};
};

export default useLoggedInUser;