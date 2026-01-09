import { useEffect } from "react"
import LoggedOutLanding from "./LoggedOutLanding" 
import Dashboard from "./Dashboard"
import { AuthContext } from "../Context/AuthContext.jsx";
import { useContext } from "react";


export default function Home(){
    const { user,setUser } = useContext(AuthContext);
    
   
    return(
        <>
        
        {user ? <Dashboard /> : <LoggedOutLanding />} 
         </>
    )
}