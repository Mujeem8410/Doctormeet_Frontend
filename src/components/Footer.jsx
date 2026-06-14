import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-700 mt-52
    ">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">DocMeet</h3>
                <p className="text-gray-500 text-xs">Your Health, Our Priority</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-xs leading-relaxed max-w-2xl">
              India's most trusted platform for doctor appointments and healthcare services. 
              We connect patients with verified healthcare professionals.
            </p>
          </div>

          {/* Contact & Trust */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">📧</span>
              <div>
                <p className="text-gray-500 text-xs">Email Support</p>
                <p className="text-gray-700 text-xs font-medium">support@docmeet.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">🕒</span>
              <div>
                <p className="text-gray-500 text-xs">Available</p>
                <p className="text-gray-700 text-xs font-medium">24/7 Support</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex space-x-3 pt-1">
              <div className="flex items-center space-x-1 text-green-500">
                <span className="text-xs">🛡️</span>
                <span className="text-xs">Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-500">
                <span className="text-xs">✅</span>
                <span className="text-xs">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-500 text-xs text-center md:text-left">
              <p>&copy; 2024 DocMeet Healthcare Services. All rights reserved.</p>
            </div>

            {/* Essential Links Only */}
            <div className="flex space-x-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;