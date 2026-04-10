import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root/Root";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Authentication/Login";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import Register from "../Pages/Authentication/Register";
import ErrorPage from "../Pages/Error/ErrorPage";

export const router = createBrowserRouter([
    {
        path : '/',
        Component : Root,
        errorElement : <ErrorPage></ErrorPage> ,
        children : [
            {index : true , Component : Home},
        ]
    },
    {
        path : '/',
        Component : AuthLayout ,
        errorElement : <ErrorPage></ErrorPage> ,
        children : [
            {path:'/login' , Component : Login},
            {path : '/register' , Component : Register}
        ]
    }
])