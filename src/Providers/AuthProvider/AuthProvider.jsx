import { createContext, useEffect, useState } from "react";
import app from "../../Firebase/Firebase.config";
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const AuthContext = createContext() ;
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider() ;

import React from 'react';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //------------------- Google Login --------------------------
    const googleLogin = () =>{
        return signInWithPopup(auth,googleProvider)
    }

    // --------------------- Log Out -----------------------------
    const logOut = () =>{
        return signOut(auth)
    }

    //----------------------Register With Email and password---------------------
    const EmailRegister = (email,password)=>{
        return createUserWithEmailAndPassword(auth,email,password)
    }

     //------------------------Update a User Profile-------------------------
    const updateUser = (updatedInfo) => {
        return updateProfile(auth.currentUser , updatedInfo) ;
    }

     //------------------------Observer------------------------------ 
    useEffect(()=>{
        const tracking = onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser) ;
            setLoading(false)
        })
        return ()=>{
            tracking() ;
        }
    },[])

    const AuthData = {
        user,
        setUser,
        loading,
        setLoading,
        googleLogin,
        logOut,
        EmailRegister,
        updateUser
    }

    return (
        <div>
            <AuthContext value={AuthData}>{children}</AuthContext>
        </div>
    );
};

export default AuthProvider;