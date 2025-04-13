import React, { useState } from 'react';

export default function Reservations() {
    const [formData, setFormData] = useState({
        timeSlot: '',
        guests: 1,
        customerName: '',
        email: '',
        phoneNumber: '',
        newsletter_signup: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: formData.customerName,
                    email_address: formData.email,
                    phone_number: formData.phoneNumber,
                    number_of_guests: formData.guests,
                    time_slot: formData.timeSlot,  // optional if using later
                    newsletter_signup: formData.newsletter_signup,
                }),
            });
            const result = await response.json();
            console.log('Reservation submitted:', result);
            alert('Reservation submitted!');
        } catch (error) {
            console.error('Error submitting reservation:', error);
            alert('Something went wrong!');
        }
    };

    // Generate time slots for the next 7 days
    const generateTimeSlots = () => {
        const slots = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Add time slots for each day (11:00 AM to 9:00 PM, hourly)
            for (let hour = 11; hour <= 21; hour++) {
                const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const value = `${date.toISOString().split('T')[0]}T${hour < 10 ? '0' + hour : hour}:00`;
                slots.push({ label: `${dateString}, ${timeString}`, value });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="container py-4 px-3 mx-auto">
            <h1>Reservations</h1>
            
            <div className="row mt-4">
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Make a Reservation</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="timeSlot" className="form-label">Time Slot</label>
                                    <select 
                                        id="timeSlot"
                                        name="timeSlot"
                                        className="form-select" 
                                        value={formData.timeSlot}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a time</option>
                                        {timeSlots.map((slot, index) => (
                                            <option key={index} value={slot.value}>
                                                {slot.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="guests" className="form-label">Number of Guests</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="guests"
                                        name="guests"
                                        min="1" 
                                        max="10"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="customerName" className="form-label">Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="customerName"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3"></div>
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id="newsletter_signup"
                                        name="newsletter_signup"
                                        checked={formData.newsletter_signup}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="newsletter_signup">
                                        Sign up for the newsletter
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-primary">Submit Reservation</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
