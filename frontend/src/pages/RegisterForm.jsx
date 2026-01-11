import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    balance: 0
  });

  const [saving, setSaving] = useState(false);

  const setValue = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      return alert("All fields required");
    }

    try {
      setSaving(true);

      const res = await fetch("http://localhost:8080/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        return alert("Register failed");
      }

      // Simple alert without emojis
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Register error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full bg-white font-sans text-slate-900">
      
      {/* --- LEFT SIDE: Functional Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
        
        <div className="max-w-md w-full mx-auto">
            {/* Minimal Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                    Create Account
                </h1>
                <p className="text-slate-500">
                    Enter your details below to get started.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="flex flex-col gap-5">
                
                {/* Username */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                    <input
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                        placeholder="username"
                        name="username"
                        value={form.username}
                        onChange={setValue}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                    <input
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                        placeholder="name@company.com"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={setValue}
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                    <input
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={setValue}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-6 w-full bg-slate-900 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70"
                >
                    {saving ? "Creating..." : "Sign Up"}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                <span className="mr-2">Already have an account?</span>
                <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                    Log in
                </Link>
            </div>
        </div>
      </div>


      {/* --- RIGHT SIDE: Abstract Connection Graphic --- */}
      {/* Visualizes 'Grouping' without using money symbols */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative flex-col items-center justify-center border-l border-slate-200">
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* The Graphic: A Central Hub connecting to nodes */}
        <div className="relative z-10 w-64 h-64">
            
            {/* Connecting Lines (CSS) */}
            <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-slate-300 -translate-x-1/2 -translate-y-1/2 rotate-0"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-slate-300 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-slate-300 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-slate-300 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>

            {/* Center Node (The Group) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center z-20">
                <div className="w-8 h-8 rounded-full bg-slate-900"></div>
            </div>

            {/* Satellite Nodes (The Members) */}
            {/* Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm"></div>
            {/* Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm"></div>
            {/* Left */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm"></div>
            {/* Right */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm"></div>
        </div>

        {/* Simple Caption */}
        <div className="mt-12 text-center max-w-xs">
            <h3 className="text-slate-900 font-semibold mb-2">Group Management</h3>
            <p className="text-slate-500 text-sm">Organize shared expenses efficiently.</p>
        </div>

      </div>
    </div>
  );
}