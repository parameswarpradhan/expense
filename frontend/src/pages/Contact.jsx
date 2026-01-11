import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
       
        console.log("Contact form submitted:", formData);

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
            
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] w-full bg-white font-sans text-slate-900">
            
            {/* --- LEFT SIDE: The Form --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
                
                <div className="max-w-md w-full mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
                            Support
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                            Get in Touch
                        </h1>
                        <p className="text-slate-500 leading-relaxed">
                            We'd love to hear from you. Fill out the form below and our team will respond shortly.
                        </p>
                    </div>

                    {/* Success Message */}
                    {isSubmitted ? (
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center text-center animate-fade-in">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-emerald-900">Message Sent!</h3>
                            <p className="text-sm text-emerald-700 mt-1">Thank you. We will be in touch within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            
                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                                <input 
                                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                    type="text" 
                                    placeholder="e.g. Rahul Sharma" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input 
                                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                    type="email" 
                                    placeholder="name@company.com" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                                <textarea 
                                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-lg h-32 resize-none outline-none border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
                                    placeholder="How can we help you?" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="mt-4 w-full bg-slate-900 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : "Send Message"}
                            </button>
                        </form>
                    )}
                    
                    {/* Direct Contact Info */}
                    <div className="mt-10 pt-6 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Direct Support</p>
                        <a href="mailto:support@cms.com" className="flex items-center gap-2 text-slate-700 font-medium hover:text-cyan-600 transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            support@cms.com
                        </a>
                    </div>

                </div>
            </div>

            {/* --- RIGHT SIDE: Abstract "Communication" Graphic --- */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative flex-col items-center justify-center border-l border-slate-200">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* The Graphic: Abstract Message Card */}
                <div className="relative z-10 w-80">
                    
                    {/* Decorative Elements around the card */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-cyan-100 rounded-full blur-xl opacity-60"></div>
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-100 rounded-full blur-xl opacity-60"></div>

                    {/* Main Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                        
                        {/* Header of the fake message */}
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <div className="h-2.5 w-24 bg-slate-200 rounded-full mb-2"></div>
                                <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>

                        {/* Body of the fake message */}
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                        </div>

                        {/* Button of the fake message */}
                        <div className="mt-6 flex justify-end">
                             <div className="h-8 w-24 bg-slate-900 rounded-lg flex items-center justify-center">
                                <div className="h-2 w-12 bg-slate-600 rounded-full"></div>
                             </div>
                        </div>
                    </div>

                    {/* Floating "Sent" Bubble behind */}
                    <div className="absolute top-1/2 -right-8 bg-cyan-50 border border-cyan-100 p-3 rounded-xl shadow-lg transform rotate-[5deg]">
                         <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>

                </div>

                {/* Caption */}
                <div className="mt-12 text-center max-w-xs">
                    <h3 className="text-slate-900 font-semibold mb-2">We're here to help</h3>
                    <p className="text-slate-500 text-sm">Reach out for inquiries, support, or feedback.</p>
                </div>

            </div>
        </div>
    );
}