import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="space-y-12 p-4 sm:p-8">
            
            {/* 1. Header Section */}
            <header className="text-center pb-4 border-b border-white/10">
                <h1 className="text-5xl font-extrabold text-white mb-2 tracking-wider">
                    About CMS
                </h1>
                <h3 className="text-xl font-light text-cyan-400">
                    The Smart Way to Split, Track, and Settle Expenses.
                </h3>
            </header>

            {/* 2. Core Value Proposition */}
            <section className="max-w-4xl mx-auto text-center space-y-4">
                <p className="text-lg text-gray-300 leading-relaxed">
                    CMS (Client Money Splitter) was built on the belief that shared finances shouldn't lead to stress or awkward conversations. We provide a clean, transparent, and automated platform for managing group expenses—whether you're splitting rent with roommates, tracking a travel budget, or managing project funds.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed font-semibold text-cyan-300">
                    Our goal is simple: ensure everyone pays their fair share, effortlessly.
                </p>
            </section>

            {/* 3. How It Works Section */}
            <section className="space-y-8 pt-6">
                <h2 className="text-4xl font-bold text-white text-center pb-4 border-b border-cyan-500/30">
                    How It Works
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Step 1: Create */}
                    <div className="bg-white/5 p-6 rounded-xl border border-cyan-500/20 shadow-lg space-y-3">
                        <div className="text-3xl font-extrabold text-cyan-400">01. Create</div>
                        <h4 className="text-xl font-semibold text-white">Log & Split Expenses</h4>
                        <p className="text-gray-400 text-base">
                            Quickly enter a new expense and specify who paid and who owes. Our system handles complex splits, making sure the math is always correct.
                        </p>
                    </div>

                    {/* Step 2: Track */}
                    <div className="bg-white/5 p-6 rounded-xl border border-cyan-500/20 shadow-lg space-y-3">
                        <div className="text-3xl font-extrabold text-cyan-400">02. Track</div>
                        <h4 className="text-xl font-semibold text-white">See Real-Time Balances</h4>
                        <p className="text-gray-400 text-base">
                            The dashboard updates instantly. View your net balance, total owed, and who needs to pay you back, all in one transparent view.
                        </p>
                    </div>

                    {/* Step 3: Settle */}
                    <div className="bg-white/5 p-6 rounded-xl border border-cyan-500/20 shadow-lg space-y-3">
                        <div className="text-3xl font-extrabold text-cyan-400">03. Settle</div>
                        <h4 className="text-xl font-semibold text-white">Resolve Debts Easily</h4>
                        <p className="text-gray-400 text-base">
                            When payments are made, simply mark them as settled. CMS keeps the history clean and calculates the remaining minimum transactions needed.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Footer-like Call to Action */}
            <footer className="pt-10 border-t border-white/10 text-center space-y-5">
                <h3 className="text-2xl font-bold text-white">
                    Ready to end money stress?
                </h3>
                <p className="text-lg text-gray-400">
                    Join thousands of users who track their shared finances with professional ease.
                </p>
                
                <Link
                    to="/register"
                    className="
                        inline-block mt-4 
                        bg-cyan-500 text-gray-900 
                        font-bold py-3 px-8 
                        rounded-full shadow-lg shadow-cyan-500/50 
                        hover:bg-cyan-400 transition duration-200 text-base 
                        uppercase tracking-wider
                    "
                >
                    Register Now - It's Free
                </Link>
            </footer>

        </div>
    );
}