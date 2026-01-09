import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
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
            
            const loginResponse = await fetch("http://localhost:8080/login", {
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

            const meResponse = await fetch("http://localhost:8080/me", {
                method: "GET",
                credentials: "include"
            });
            const data = await meResponse.json();

            if (data.loggedIn) {
                setUser(data.user);
                navigate("/");
            } else {
                setError("Login succeeded, but user session retrieval failed.");
            }
        } catch (err) {
            console.error("Login process failed:", err);
            setError("Could not connect to the server. Please check your network.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            
          
            <div className="w-full max-w-sm p-8 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10">
                
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Login
                </h1>
                <h3 className="text-base font-normal text-cyan-400 mb-8 text-center">
                    Access your Expense Splitting Dashboard
                </h3>

                <form onSubmit={submit} className="flex flex-col space-y-5" action="#">
                    
                    {/* Email Input */}
                    <input 
                        className="
                            w-full p-3 text-white bg-white/10 rounded-lg 
                            border border-transparent focus:border-cyan-400 outline-none
                            placeholder-blue-200 transition duration-200 font-medium
                        " 
                        type="email" 
                        placeholder="Email Address" 
                        value={input.email} 
                        onChange={setValue} 
                        name="email"
                        required
                    />
                    
                    {/* Password Input */}
                    <input 
                        className="
                            w-full p-3 text-white bg-white/10 rounded-lg 
                            border border-transparent focus:border-cyan-400 outline-none
                            placeholder-blue-200 transition duration-200 font-medium
                        " 
                        type="password" 
                        placeholder="Password" 
                        value={input.password} 
                        onChange={setValue} 
                        name="password"
                        required
                    />

                    {/* Error Display */}
                    {error && (
                        <p className="text-sm text-red-400 text-center font-semibold mt-2">
                            {error}
                        </p>
                    )}

                    {/* Submit Button (High-Contrast CTA) */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="
                            bg-cyan-500 text-gray-900 font-bold 
                            py-3 mt-4 rounded-full shadow-lg shadow-cyan-500/50 
                            hover:bg-cyan-400 transition duration-200 text-lg 
                            uppercase tracking-wider disabled:bg-gray-600 disabled:shadow-none
                        "
                    >
                        {isSubmitting ? "AUTHENTICATING..." : "SIGN IN"}
                    </button>
                </form>
                
                {/* Registration Link */}
                <div className="text-center mt-6 text-sm">
                    <span className="text-gray-300">New user? </span>
                    <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition duration-200">
                        Create an Account
                    </Link>
                </div>

            </div>
        </div>
    )
}