import {useLocation,Outlet,Navigate,Route,Redirect}from "react-router-dom"
import useAuth from "../hooks/useAuth"

function RequireAuth({token,role}){
    if(token===""||token===undefined||token===null||role==="user"){
        return <Navigate to='/' replace/>;
    }
    return(
       <Outlet/>
    )
}
export default RequireAuth