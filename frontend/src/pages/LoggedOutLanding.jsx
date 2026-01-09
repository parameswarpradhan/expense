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
      
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8 space-y-7">
            
           
            <p className="text-lg font-medium uppercase tracking-widest text-cyan-300 mb-3">
                Expense Management, Evolved
            </p>
            
            <h1 className="
                text-3xl md:text-5xl font-bold tracking-tight 
                max-w-4xl leading-tight text-white // High-contrast white
            ">
                <Typewriter
                    words={rotatingWords}
                    loop={true}
                    cursor
                    cursorStyle='|'
                    typeSpeed={50}
                    deleteSpeed={30}
                    delaySpeed={1800}
                /> 
                <span className="text-cyan-400"> Group Finances.</span>
            </h1>

            
            <h2 className="text-lg font-normal text-gray-200 max-w-3xl pt-2">
                End the friction. Our platform provides instant, transparent visibility into who owes what, ensuring every shared payment is accounted for.
            </h2>
            
            <Link
                to="/register"
                className="
                    mt-8 
                    bg-cyan-500 text-gray-900 
                    font-bold py-3 px-8 
                    rounded-full shadow-2xl shadow-cyan-500/50 
                    hover:bg-cyan-400 transition duration-200 
                    text-base uppercase tracking-wider
                "
            >
                Get Started with CMS
            </Link>

            {/* 5. Login Link (Clear, secondary text) */}
            <div className="text-sm text-gray-300 pt-6">
                Already tracking? <Link to="/login" className="text-cyan-400 hover:underline font-medium">Log In</Link>
            </div>

        </div>
    );
}