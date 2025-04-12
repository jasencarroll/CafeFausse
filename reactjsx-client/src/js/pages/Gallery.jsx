import React, { useState } from 'react';

// Import images directly (you'll need to create or copy these files)
// You may use any image format (.jpg, .png, .webp)
import interiorImage from '../../../public/images/gallery-cafe-interior.webp'
import steakImage from '../../../public/images/gallery-ribeye-steak.webp';
import eventImage from '../../../public/images/gallery-special-event.webp';

export default function Gallery() {
    // Use imported images directly
    const galleryImages = {
        interior: [
            { id: 1, src: interiorImage, alt: 'Main dining area', title: 'Our elegant main dining space' },
        ],
        dishes: [
            { id: 4, src: steakImage, alt: 'Signature dish', title: 'Our award-winning signature dish' },
        ],
        events: [
            { id: 7, src: eventImage, alt: 'Main dining hall during event', title: 'Our Main Dining Hall for events' },
        ]
    };

    const awards = [
        { id: 1, title: 'Culinary Excellence Award', year: '2022' },
        { id: 2, title: 'Restaurant of the Year', year: '2023' },
        { id: 3, title: 'Best Fine Dining Experience – Foodie Magazine', year: '2023' }
    ];

    const reviews = [
        { id: 1, text: '"Exceptional ambiance and unforgettable flavors."', source: 'Gourmet Review' },
        { id: 2, text: '"A must-visit restaurant for food enthusiasts."', source: 'The Daily Bite' }
    ];

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
        <div className="container py-5">
            <h1 className="display-4 text-center mb-5">Our Gallery</h1>
            
            {/* Gallery Sections */}
            {renderGallerySection('The Interior Ambiance of the Restaurant', galleryImages.interior)}
            {renderGallerySection('Dishes from the Menu', galleryImages.dishes)}
            {renderGallerySection('Special Events and Behind-the-Scenes', galleryImages.events)}
            
            {/* Awards Section */}
            <div className="my-5">
                <h2 className="mb-4 text-center">Awards & Recognition</h2>
                <div className="card mb-4">
                    <div className="card-body">
                        <h3 className="card-title h5">Awards:</h3>
                        <ul className="list-group list-group-flush">
                            {awards.map(award => (
                                <li key={award.id} className="list-group-item">
                                    <strong>{award.title}</strong> – {award.year}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Reviews Section */}
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title h5">Customer Reviews:</h3>
                        {reviews.map(review => (
                            <blockquote key={review.id} className="blockquote mb-0 mt-3">
                                <p>{review.text}</p>
                                <footer className="blockquote-footer">
                                    <cite title="Source">{review.source}</cite>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </div>
            
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
