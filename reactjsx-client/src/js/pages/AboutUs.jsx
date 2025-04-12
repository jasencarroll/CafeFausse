import React, { useState } from 'react';

export default function AboutUs() {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        // Only validate if there's input
        if (value) {
            setIsValidEmail(validateEmail(value));
        } else {
            setIsValidEmail(true);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !isValidEmail) {
            setIsValidEmail(false);
            return;
        }
        
        // Here you would typically send the email to your backend
        console.log('Email submitted:', email);
        setIsSubmitted(true);
        setEmail('');
    };

    return (
        <div className="container py-4 px-3 mx-auto">
            <h1>About Café Fausse</h1>
            <p>Founded in 2010 by <strong>Chef Antonio Rossi</strong> and restaurateur <strong>Maria Lopez</strong>, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.</p>
            
            <p><strong>Chef Antonio Rossi</strong>  brings over two decades of culinary experience, with roots in the rolling hills of Tuscany and training from world-renowned culinary institutions. His passion lies in reinventing classic Italian dishes using locally sourced, seasonal ingredients. Antonio's culinary artistry has earned accolades across the fine dining world, and his dishes are celebrated not only for their exquisite taste but also their beautiful presentation.</p>

            <p><strong>Maria Lopez,</strong> a seasoned entrepreneur and hospitality expert, complements Antonio's creative vision with her sharp business acumen and dedication to service excellence. With a background in luxury hospitality management, Maria has crafted Café Fausse into more than just a restaurant—it's an experience. Her leadership ensures that every guest is welcomed with warmth and treated to impeccable service.</p>

            <p>Together, <strong>Antonio</strong> and <strong> Maria</strong> have created a space where elegance meets comfort, tradition embraces innovation, and every meal is a celebration. Their shared mission is to offer an unforgettable dining journey defined by quality, creativity, and heartfelt hospitality.</p>
            
            <div className="card mt-5 mb-4">
                <div className="card-body">
                    <h2 className="card-title h4">Join Our Mailing List</h2>
                    <p className="card-text">Subscribe to receive updates on special events, seasonal menus, and exclusive offers.</p>
                    
                    {isSubmitted ? (
                        <div className="alert alert-success" role="alert">
                            Thank you for subscribing to our newsletter!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-8">
                                <label htmlFor="emailSubscribe" className="visually-hidden">Email</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${!isValidEmail ? 'is-invalid' : ''}`}
                                    id="emailSubscribe" 
                                    placeholder="Your Email Address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                {!isValidEmail && 
                                    <div className="invalid-feedback">
                                        Please enter a valid email address.
                                    </div>
                                }
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-primary w-100">Subscribe</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
