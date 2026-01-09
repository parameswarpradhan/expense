import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

export default function Register() {
    const navigate = useNavigate();
    const [rInput, setRInput] = useState({ 
        username: "", 
        email: "", 
        password: "", 
        balance: "" 
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setRValue = (e) => {
        setRInput((currData) => {
            return { ...currData, [e.target.name]: e.target.value }
        })
    }
    
    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        const payload = { 
            ...rInput, 
            balance: parseFloat(rInput.balance) || 0 
        };

        try {
            const response = await fetch("http://localhost:8080/registerUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            const result = await response.json();

            if (response.ok) {
                console.log("Registration success:", result);
                
                navigate("/login"); 
            } else {
                
                setError(result.message || "Registration failed. Please try a different email.");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("Could not connect to the server. Please check your network.");
        } finally {
            setIsSubmitting(false);
        }

        setRInput({
            username: "", email: "", password: "", balance: ""
        });
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            
            <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-xl shadow-2xl border border-white/10">
                
                {/* Header Section */}
                <h1 className="text-3xl font-extrabold text-white mb-1 text-center">
                    Create Account
                </h1>
                <h3 className="text-base font-light text-cyan-400/80 mb-6 pb-2 border-b border-white/10 text-center">
                    Start managing your expenses for free.
                </h3>

                <form onSubmit={submit} className="flex flex-col space-y-4" action="#">
                    
                    {/* Username Input */}
                    <input 
                        className="
                            w-full p-3 text-white bg-white/10 rounded-lg 
                            border border-transparent focus:border-cyan-400 outline-none
                            placeholder-blue-200 transition duration-200 font-medium
                        " 
                        type="text" 
                        placeholder="Username" 
                        value={rInput.username} 
                        onChange={setRValue} 
                        name="username" 
                        required
                    />

                    {/* Email Input */}
                    <input 
                        className="
                           w-full p-3 text-white bg-white/10 rounded-lg 
                            border border-transparent focus:border-cyan-400 outline-none
                            placeholder-blue-200 transition duration-200 font-medium
                        " 
                        type="email" 
                        placeholder="Email Address" 
                        value={rInput.email} 
                        onChange={setRValue} 
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
                        placeholder="Secure Password" 
                        value={rInput.password} 
                        onChange={setRValue} 
                        name="password" 
                        required
                    />

                    {/* Initial Balance Input */}
                    <input 
                        className="
                            w-full p-3 text-white bg-white/10 rounded-lg 
                            border border-transparent focus:border-cyan-400 outline-none
                            placeholder-blue-200 transition duration-200 font-medium
                        " 
                        type="number" 
                        placeholder="Initial Balance" 
                        value={rInput.balance} 
                        onChange={setRValue} 
                        name="balance" 
                        min="0"
                    />

                    {/* Error Display */}
                    {error && (
                        <p className="text-sm text-red-400 text-center font-semibold pt-1">
                            {error}
                        </p>
                    )}

                    {/* Submit Button (Primary CTA) */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="
                            bg-cyan-500 text-gray-900 font-bold 
                            py-3 mt-4 rounded-lg
                            hover:bg-cyan-400 transition duration-200 text-base 
                            uppercase tracking-widest disabled:bg-gray-700 disabled:text-gray-400
                        "
                    >
                        {isSubmitting ? "CREATING ACCOUNT..." : "REGISTER"}
                    </button>
                </form>
                
                {/* Login Link (Subtle Footer) */}
                <div className="text-center mt-6 text-xs border-t border-white/10 pt-4">
                    <span className="text-gray-400">Already registered? </span>
                    <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-200">
                        Sign In Here
                    </Link>
                </div>

            </div>
        </div>
    )
}