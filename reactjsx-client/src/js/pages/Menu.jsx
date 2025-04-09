import React, { useState, useEffect } from 'react';
import ApiService from '../services/api-service';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const data = await ApiService.getMenu();
                setMenuItems(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError(`${err.message}. Make sure the Flask server is running on port 5000.`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMenu();
    }, [retryCount]);
    
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setRetryCount(prev => prev + 1);
    };
    
    // Group menu items by category
    const groupedMenu = menuItems.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
    
    // Define category order
    const categoryOrder = ["Starters", "Main Courses", "Desserts", "Beverages"];
    
    // Sort categories according to defined order
    const sortedCategories = Object.keys(groupedMenu).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        
        // If both categories are in our predefined order, sort by that order
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only one category is in our predefined order, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // For categories not in our predefined list, sort alphabetically
        return a.localeCompare(b);
    });
    
    if (loading) return (
        <div className="container text-center my-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading menu items...</p>
        </div>
    );
    
    if (error) return (
        <div className="container my-5">
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Connection Error</h4>
                <p>{error}</p>
                <hr />
                <button 
                    className="btn btn-primary" 
                    onClick={handleRetry}
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">Our Menu</h1>
            
            {menuItems.length === 0 ? (
                <div className="alert alert-info">No menu items available.</div>
            ) : (
                sortedCategories.map(category => (
                    <div key={category} className="mb-5">
                        <h2 className="menu-category">{category}</h2>
                        <hr className="mb-4" />
                        
                        <div className="row">
                            {groupedMenu[category].map(item => (
                                <div key={item.id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text">{item.description}</p>
                                            <p className="card-text fw-bold">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Menu;
