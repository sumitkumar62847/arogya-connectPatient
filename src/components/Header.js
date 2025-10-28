import {HeartPulse,Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

useEffect(() => {


  if (window.google && window.google.translate) {

    new window.google.translate.TranslateElement(
      { pageLanguage: "en" },
      "google_translate_element"
    );
  }
  }, []);


  return (
    <header className="bg-white w-full shadow-md sticky top-0 z-50">
      <nav className="container w-full mx-auto px-6 py-3 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-3">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Arogya Connect</h1>
            <p className="text-xs text-gray-500">Your Health, our track</p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <a href="#problem" className="text-gray-600 font-medium hover:text-blue-600">Challenges</a>
          <a href="#solution" className="text-gray-600 font-medium hover:text-blue-600">Our Solution</a>
          <a href="#about" className="text-gray-600 font-medium hover:text-blue-600">About</a>
          <a href="#faq" className="text-gray-600 font-medium hover:text-blue-600">FAQ</a>
          <Link
            to="/login"
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Register / login
          </Link>       
          <div className="border h-[40px] overflow-hidden" id="google_translate_element"></div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6 text-gray-700" />
            </button>
        </div>
      </nav>

      {/* --- Mobile Sidebar --- */}
      {isSidebarOpen && (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar Content */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                <div className="flex flex-col p-5 space-y-4">
                    <a href="#problem" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsSidebarOpen(false)}>Challenges</a>
                    <a href="#solution" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsSidebarOpen(false)}>Our Solution</a>
                    <a href="#about" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsSidebarOpen(false)}>About</a>
                    <a href="#faq" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsSidebarOpen(false)}>FAQ</a>
                    <div className="border-t pt-4">
                         <div className="border h-[40px] overflow-hidden" id="google_translate_element"></div>
                        <Link to="/login" className="w-full text-center bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm" onClick={() => setIsSidebarOpen(false)}>
                            Register / Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
      )}
    </header>
  );
};