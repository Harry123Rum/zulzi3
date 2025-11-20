import React from 'react';
import Navbar from '../Components/Navbar'; 
import Footer from '../Components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
            {/* Navbar selalu di atas */}
            <Navbar />

            {/* Konten Halaman (Pemesanan, dll) akan masuk di sini */}
            <main className="flex-grow pt-24 px-6 max-w-7xl mx-auto w-full">
                {children}
            </main>

            {/* Footer selalu di bawah */}
            <Footer />
        </div>
    );
};

export default MainLayout;