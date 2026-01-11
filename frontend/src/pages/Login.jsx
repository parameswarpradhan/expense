import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(AuthContext);

    const [input, setInput] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = (e) => {
        setInput((currData) => {
            return { ...currData, [e.target.name]: e.target.value }
        })
    }
    
    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const loginResponse = await fetch(`${import.meta.env.VITE_API_URL!}/login`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                setError(errorData.message || "Invalid email or password.");
                setIsSubmitting(false);
                return;
            }

            const loginData = await loginResponse.json();

            if (loginData.token) {
                localStorage.setItem("token", loginData.token);
                setToken(loginData.token);
            } else {
                console.warn("No token received from login API");
            }

            const meResponse = await fetch(import.meta.env.VITE_API_URL1, {
                method: "GET",
                credentials: "include"
            });

            const data = await meResponse.json();

            if (data.loggedIn) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/dashboard");
            } else {
                setError("Login succeeded, but user session retrieval failed.");
            }

        } catch (err) {
            console.error("Login process failed:", err);
            setError("Could not connect to the server. Please check your network.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] w-full bg-white font-sans text-slate-900">
            
            {/* --- LEFT SIDE: Form --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
                
                <div className="max-w-md w-full mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500">
                            Please enter your details to access your dashboard.
                        </p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <p className="text-sm font-semibold text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                type="email" 
                                placeholder="name@company.com" 
                                value={input.email} 
                                onChange={setValue} 
                                name="email"
                                required
                            />
                        </div>
                        
                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                {/* Optional: Forgot Password Link place holder */}
                                {/* <a href="#" className="text-xs font-semibold text-slate-400 hover:text-slate-600">Forgot?</a> */}
                            </div>
                            <input 
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                type="password" 
                                placeholder="••••••••" 
                                value={input.password} 
                                onChange={setValue} 
                                name="password"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="mt-6 w-full bg-slate-900 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>
                    
                    {/* Footer Link */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        <span className="mr-2">Don't have an account?</span>
                        <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                            Create account
                        </Link>
                    </div>

                </div>
            </div>

            {/* --- RIGHT SIDE: Abstract Graphic (Access/Portal) --- */}
            {/* Consistent with the Register page but uses concentric rings to imply 'Entry' */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative flex-col items-center justify-center border-l border-slate-200">
                
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* The Graphic: Concentric Rings (Target/Access) */}
                <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                    
                    {/* Outer Ring */}
                    <div className="absolute w-64 h-64 border border-slate-200 rounded-full opacity-60"></div>
                    
                    {/* Middle Ring */}
                    <div className="absolute w-48 h-48 border border-slate-300 rounded-full opacity-80"></div>
                    
                    {/* Inner Ring */}
                    <div className="absolute w-32 h-32 border-2 border-slate-300 rounded-full"></div>

                    {/* Center Core */}
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center z-20">
                         {/* A simple 'Lock' or 'Key' metaphor shape (abstract) */}
                        <div className="w-6 h-6 rounded-sm bg-slate-900"></div>
                    </div>
                    
                    {/* Decorative Orbit Dot */}
                    <div className="absolute top-0 w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>

                </div>

                {/* Caption */}
                <div className="mt-12 text-center max-w-xs">
                    <h3 className="text-slate-900 font-semibold mb-2">Secure Access</h3>
                    <p className="text-slate-500 text-sm">Manage your expenses with confidence.</p>
                </div>

            </div>
        </div>
    )
}
