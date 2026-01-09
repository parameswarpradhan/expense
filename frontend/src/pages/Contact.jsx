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
        <div className="flex flex-col items-center justify-center h-full p-4">
            
            <div className="w-full max-w-lg p-8 bg-white/5 backdrop-blur-md rounded-xl shadow-2xl border border-white/10">
                
                {/* Header Section */}
                <h1 className="text-3xl font-extrabold text-white mb-1 text-center">
                    Get In Touch
                </h1>
                <h3 className="text-base font-light text-cyan-400/80 mb-6 pb-2 border-b border-white/10 text-center">
                    We'd love to hear from you. Send us a message.
                </h3>

                {/* Success Message */}
                {isSubmitted ? (
                    <div className="p-6 bg-green-500/20 text-green-300 border border-green-500 rounded-lg text-center font-semibold">
                        Thank you for your message! We will be in touch shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        
                        {/* Name Input */}
                        <input 
                            className="
                                w-full p-3 text-white bg-gray-800 rounded-md
                                border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none
                                placeholder-gray-400 transition duration-200 font-normal
                            " 
                            type="text" 
                            placeholder="Your Name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        {/* Email Input */}
                        <input 
                            className="
                                w-full p-3 text-white bg-gray-800 rounded-md
                                border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none
                                placeholder-gray-400 transition duration-200 font-normal
                            " 
                            type="email" 
                            placeholder="Email Address" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* Message Textarea */}
                        <textarea 
                            className="
                                w-full p-3 text-white bg-gray-800 rounded-md h-32 resize-none
                                border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none
                                placeholder-gray-400 transition duration-200 font-normal
                            " 
                            placeholder="Your Message" 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        {/* Submit Button */}
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
                            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                        </button>
                    </form>
                )}
                
                {/* Contact Info Footer (Minimalist) */}
                <div className="text-center mt-8 text-sm border-t border-white/10 pt-4">
                    <p className="text-gray-400 font-medium">
                        For immediate support: <span className="text-cyan-400">support@cms.com</span>
                    </p>
                    <p className="text-gray-500 mt-1">
                        We aim to respond within 24 hours.
                    </p>
                </div>

            </div>
        </div>
    );
}