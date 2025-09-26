import { Heart, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Pet Care Guides</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Community Forum</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Pet Resources</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Success Stories</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Pet Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Dogs</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cats</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Birds</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Pet Equipment</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="opacity-80">Cyprus</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+35796336767" className="opacity-80 hover:opacity-100 transition-opacity">
                  +357 96 336767
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@cyprus-pets.com" className="opacity-80 hover:opacity-100 transition-opacity">
                  info@cyprus-pets.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Affiliate Banner */}
          <div>
            <h4 className="font-semibold mb-4">Our Partners</h4>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <img 
                src="/src/assets/hero-pets-cyprus.jpg" 
                alt="Cyprus Pets Community" 
                className="w-full h-16 object-cover rounded mb-2"
              />
              <p className="text-xs opacity-75">Trusted Pet Resources</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="text-center mb-4">
            <p className="text-sm opacity-80 flex items-center justify-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> for Cyprus pet lovers
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs opacity-60">
              © 2024 Cyprus Pets. All rights reserved.
            </p>
            
            <div className="bg-orange-100/10 rounded-lg p-3 max-w-4xl mx-auto">
              <p className="text-xs opacity-75 leading-relaxed">
                <strong>Affiliate Disclosure:</strong> Cyprus Pets is a participant in the Amazon Services LLC Associates Program and other affiliate programs. We may earn commissions from qualifying purchases made through our links. This helps us maintain our free pet care resources for the Cyprus community. All recommendations are based on our genuine experience and research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
