import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="relative w-full min-h-screen bg-white font-sans text-slate-900">
            
            {/* 1. BACKGROUND: Consistent Dot Grid */}
            <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                
                {/* 2. Header */}
                <header className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="py-1 px-3 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Our Mission
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                        
                    </h1>
                    <h3 className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        The smart, transparent way to <span className="text-cyan-600">manage shared expenses.</span>
                    </h3>
                </header>

                {/* 3. Intro Text */}
                <section className="mb-16 text-center">
                    <p className="text-lg text-slate-600 leading-8 mb-6">
                        <strong className="text-slate-900">CMS (Client Money Splitter)</strong> was built to eliminate the friction of shared finances. Whether you are splitting rent with flatmates, managing a travel budget, or handling project funds, we provide a uniform platform to track every rupee.
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                        Our goal is simple: ensure everyone pays their fair share, effortlessly.
                    </p>
                </section>

                {/* 4. "How It Works" Grid - AESTHETIC UPDATE */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Card 1: Create (Cyan Theme) */}
                        <div className="bg-cyan-50/50 border border-cyan-100 p-6 rounded-2xl hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-100 transition-all duration-200 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl font-bold text-cyan-200 group-hover:text-cyan-300 transition-colors">01</div>
                                <div className="p-2 bg-white rounded-lg text-cyan-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Create</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Log an expense in seconds. Select who paid and who was involved. We handle the math.
                            </p>
                        </div>

                        {/* Card 2: Track (Indigo Theme) */}
                        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl font-bold text-indigo-200 group-hover:text-indigo-300 transition-colors">02</div>
                                <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Track</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Balances update instantly. See exactly who owes you and what you owe others in real-time.
                            </p>
                        </div>

                        {/* Card 3: Settle (Emerald Theme) */}
                        <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 transition-all duration-200 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl font-bold text-emerald-200 group-hover:text-emerald-300 transition-colors">03</div>
                                <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Settle</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Clear your debts with a single click. We keep a history of all settlements for transparency.
                            </p>
                        </div>

                    </div>
                </section>

                {/* 5. Footer CTA */}
                <footer className="text-center border-t border-slate-200 pt-12">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        Ready to get started?
                    </h3>
                    <p className="text-slate-500 mb-8">
                        Join thousands of users managing their finances today.
                    </p>
                    
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all bg-slate-900 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Register for Free
                    </Link>
                </footer>

            </div>
        </div>
    );
}