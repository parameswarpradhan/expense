import React from 'react';
import { Typewriter } from 'react-simple-typewriter'; 

export default function LoggedOutDashboard() {
    const rotatingWords = [
        'SPLIT bills', 
        'MANAGE group expenses', 
        'TRACK every rupee', 
        'END awkward money talks'
    ];

    return (
        <div className="logged-out-container"> 
            
            <header className="main-header">
                <h1 className="logo">CMS</h1> 
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
                <div className="auth-buttons">
                    <a href="/login" className="login-button">Login</a>
                    <a href="/register" className="register-button">Register</a>
                </div>
            </header>

            <main className="hero-section">
                
                <div className="welcome-card">
                    <h2 className="tagline">
                        Your Simple Solution to Shared Finances.
                    </h2>
                    
                    {/* Dynamic Typewriter Headline */}
                    <h1 className="main-headline">
                        <Typewriter
                            words={rotatingWords}
                            loop={0} 
                            cursor
                            cursorStyle='_'
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        /> 
                        
                        <span className="static-text"> — The easy way.</span>
                    </h1>
                    
                    {/* Attractive & Professional Content */}
                    <p className="description-text">
                        Stop stressing over shared payments. Our app helps you manage and track every group expense, 
                        from weekly meals to epic travel costs, ensuring everyone pays their fair share.
                    </p>

                    <a href="/register" className="primary-cta-button split-expense-style">
                        Get Started in Seconds
                    </a>

                </div>
            </main>
        </div>
    );
}