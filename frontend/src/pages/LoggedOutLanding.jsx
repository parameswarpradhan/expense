import React from 'react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter'; 

export default function LoggedOutLanding() {
    
    const rotatingWords = [
        'SPLIT', 
        'MANAGE', 
        'TRACK', 
        'SETTLE'
    ];

    return (
        <div className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center font-sans text-slate-900 overflow-hidden">
            
            {/* 1. PROFESSIONAL BACKGROUND: Subtle Dot Grid */}
            <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            
            {/* Optional: A very subtle gradient at the top */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none"></div>

            {/* 2. MAIN CONTAINER */}
            <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">

                {/* --- HERO TEXT SECTION --- */}
                <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
                    
                    {/* Small Pill Label */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Simple Expense Tracking</span>
                    </div>

                    {/* H1 Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                        The fair way to <br />
                        <span className="text-cyan-600">
                            <Typewriter
                                words={rotatingWords}
                                loop={true}
                                cursor
                                cursorStyle='|'
                                typeSpeed={80}
                                deleteSpeed={50}
                                delaySpeed={2000}
                            />
                        </span>
                        <span> expenses.</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                        Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-row gap-4 justify-center pt-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-slate-900 rounded-lg hover:bg-slate-800 hover:shadow-md"
                        >
                            Sign Up Free
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-700 transition-all bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400"
                        >
                            Log In
                        </Link>
                    </div>
                </div>


                {/* --- 3. THE "MOCKUP" GRAPHIC (Pure CSS) --- */}
                <div className="w-full max-w-4xl mx-auto relative group">
                    
                    {/* The decorative glow behind the mockup */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    
                    {/* The "App Window" */}
                    <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                        
                        {/* Fake Browser Header */}
                        <div className="bg-slate-50 border-b border-slate-200 h-10 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        {/* Fake App Interface */}
                        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Col: Balance Card */}
                            <div className="space-y-4">
                                <div className="p-5 rounded-lg border border-slate-100 bg-slate-50/50">
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Total Balance</p>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-2xl font-bold text-slate-900">+4,500.00</span>
                                        <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">You are owed</span>
                                    </div>
                                </div>

                                {/* List of people (Indian Names) */}
                                <div className="space-y-3">
                                    {/* Person 1: Arjun */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-700">AK</div>
                                            <div className="text-sm font-medium text-slate-700">Arjun Kumar</div>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600 text-right">owes you 250.00</span>
                                    </div>
                                    
                                    {/* Person 2: Sneha */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">SR</div>
                                            <div className="text-sm font-medium text-slate-700">Sneha Roy</div>
                                        </div>
                                        <span className="text-sm font-bold text-orange-600 text-right">owes you 145.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Recent Activity */}
                            <div className="border-l border-slate-100 pl-0 md:pl-8 space-y-5">
                                <h3 className="text-sm font-bold text-slate-900">Recent Expenses</h3>
                                
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                    {/* Item 1 */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                                        <p className="text-sm font-semibold text-slate-800">Weekend Biryani</p>
                                        <p className="text-xs text-slate-400 mt-1">You paid 1,200.00</p>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white"></div>
                                        <p className="text-sm font-semibold text-slate-800">Grocery Run</p>
                                        <p className="text-xs text-slate-400 mt-1">Arjun paid 450.00</p>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                                        <p className="text-sm font-semibold text-slate-800">WiFi Bill</p>
                                        <p className="text-xs text-slate-400 mt-1">Added by Sneha</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Trust Text */}
                <p className="mt-12 text-xs text-slate-400 font-medium tracking-wide uppercase">
                    Simple • Transparent • Secure
                </p>

            </div>
        </div>
    );
}