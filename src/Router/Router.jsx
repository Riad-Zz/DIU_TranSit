import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root/Root";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Authentication/Login";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import Register from "../Pages/Authentication/Register";

export const router = createBrowserRouter([
    {
        path : '/',
        Component : Root,
        children : [
            {index : true , Component : Home},
        ]
    },
    {
        path : '/',
        Component : AuthLayout ,
        children : [
            {path:'/login' , Component : Login},
            {path : '/register' , Component : Register}
        ]
    }
])