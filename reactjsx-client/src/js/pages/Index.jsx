import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../../../public/images/home-cafe-fausse.webp'

export default function Index() {
    // Use imported images directly
    const galleryImages = {
        home: [
            { id: 1, src: homeImage, alt: 'home image', title: 'Our beautiful and extravagent Cafe!' },
        ],
    };

    // State for lightbox
    const [lightbox, setLightbox] = useState({
        isOpen: false,
        currentImage: null
    });

    // Open lightbox with selected image
    const openLightbox = (image) => {
        setLightbox({
            isOpen: true,
            currentImage: image
        });
    };

    // Close lightbox
    const closeLightbox = () => {
        setLightbox({
            isOpen: false,
            currentImage: null
        });
    };

    // Render gallery section with centered images
    const renderGallerySection = (title, images) => (
        <div className="mb-5">
            <h3 className="mb-4 text-center">{title}</h3>
            <div className="row justify-content-center">
                {images.map((image) => (
                    <div key={image.id} className="col-md-8 col-lg-6 mb-4">
                        <div className="card h-100">
                            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                                <img 
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="card-img-top" 
                                    onClick={() => openLightbox(image)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                />
                            </div>
                            <div className="card-body text-center">
                                <p className="card-text">{image.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container py-4 px-3 mx-auto text-center">
            <h1>Welcome to Café Fausse!</h1>
            {renderGallerySection('', galleryImages.home)}
            <p><strong>Address:</strong> 1234 Culinary Ave, Suite 100, Washington, DC 20002</p>
            <p><strong>Phone Number:</strong> (202) 555-4567</p>
            <Link to="/reservations" className="btn btn-primary mb-4">Book a Reservation</Link>
            
            {/* Lightbox Modal */}
            {lightbox.isOpen && lightbox.currentImage && (
                <div 
                    className="modal show d-block" 
                    tabIndex="-1" 
                    onClick={closeLightbox}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h5 className="modal-title">{lightbox.currentImage.title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeLightbox}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <img 
                                    src={lightbox.currentImage.src}
                                    alt={lightbox.currentImage.alt}
                                    className="img-fluid"
                                />
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={closeLightbox}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {lightbox.isOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}
