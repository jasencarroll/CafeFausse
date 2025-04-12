import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NaviBar from './components/navbar';
import Index from './pages/Index';
import Menu from './pages/menu';
import Reservations from './pages/reservations';
import AboutUs from './pages/Aboutus';
import Gallery from './pages/Gallery';



export default function App() {
    return (
        <main>
            {/* Get the NaviBar element and display it */}
            <NaviBar />
            {/* App Router: Connects different paths (routes) to different pages (views) */}
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="menu" element={<Menu />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="aboutus" element={<AboutUs />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="*" element={<Index />} />
            </Routes>
        </main>
    );
}