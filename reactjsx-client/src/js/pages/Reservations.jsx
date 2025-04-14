import React, { useState } from 'react';

import ApiService from '../services/api-service';
// This line imports the module api-service.jsx from the services directory
// and assigns its default export to the variable ApiService. The file
// api-service.jsx defines one or more functions for interacting with the
// Flask backend API, such as POST or GET requests.

// Define the React component for Reservations in such a way that other files
// can import and use this component without needing to know its internal name
export default function Reservations() {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phoneNumber: '',
        guests: 1,
        timeSlot: '',
        newsletter_signup: false // If the newsletter signup box is not checked off, the value False is returned
                                 // If the newsletter signup box is checked off by the user, the value True is returned
    });
    
    // Add states to manage success and error messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form updates in React for all input types 
    const handleChange = (e) => {
        const { name, // Extract properties from the event target
                value, // The string input value for text, email, number, select, etc.
                type, // Type of input (e.g., checkbox, text, number)
                checked // Boolean for checkbox state (True if checked, False otherwise)
              } = e.target;
        setFormData(prevState => ({  // Update the form's state
            ...prevState, // Copies the previous state using spread syntax
            [name]: type === 'checkbox' ? checked : value // Dynamically set the property matching the name to 'checked' if it's a checkbox, 'value' otherwise.
        }));
        
        // Clear any existing messages when user starts typing again
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the web browser's default form submission behavior which would reload the page
        
        // Clear any existing messages
        setSuccessMessage('');
        setErrorMessage('');
        
        try {
            const result = await ApiService.submitReservation({ // Calls a method from the custom ApiService module to send a POST request to the Flask API (api/reservations)
                                                                // Sends the data collected in formData, mapping React form state to the expected keys on the backend
                customer_name: formData.customerName, // Example: John Doe
                email_address: formData.email, // Example: john.doe@email.com
                phone_number: formData.phoneNumber, // Example: 123-456-7890
                number_of_guests: formData.guests, // Example: 2
                time_slot: formData.timeSlot, // Example submission: 2025-04-14T11:00
                newsletter_signup: formData.newsletter_signup
            });
            
            console.log('Reservation submitted:', result); // Logs the result returned by the backend
            
            // Display success message
            setSuccessMessage(`Reservation confirmed! Your table number is ${result.table_number}.`);
            
            // Reset form to initial values
            setFormData({
                customerName: '',
                email: '',
                phoneNumber: '',
                guests: 1,
                timeSlot: '',
                newsletter_signup: false
            });
            
        } catch (error) {
            console.error('Error submitting reservation:', error);
            setErrorMessage('Something went wrong with your reservation. Please try again.');
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
                    {/* Success message */}
                    {successMessage && (
                        <div className="alert alert-success mb-4" role="alert">
                            {successMessage}
                        </div>
                    )}
                    
                    {/* Error message */}
                    {errorMessage && (
                        <div className="alert alert-danger mb-4" role="alert">
                            {errorMessage}
                        </div>
                    )}
                
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
                                        autoComplete="name"
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
                                        autoComplete="email"
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
                                        autoComplete="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3 form-check">
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
