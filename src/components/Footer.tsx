import { Heart, MapPin, Phone, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="opacity-80 hover:opacity-100 transition-opacity">Pet Care Guides</Link></li>
              <li><Link to="/forum" className="opacity-80 hover:opacity-100 transition-opacity">Community Forum</Link></li>
              <li><Link to="/shop" className="opacity-80 hover:opacity-100 transition-opacity">Pet Resources</Link></li>
              <li><Link to="/blog" className="opacity-80 hover:opacity-100 transition-opacity">Success Stories</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Pet Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="opacity-80 hover:opacity-100 transition-opacity">Dogs</Link></li>
              <li><Link to="/shop" className="opacity-80 hover:opacity-100 transition-opacity">Cats</Link></li>
              <li><Link to="/shop" className="opacity-80 hover:opacity-100 transition-opacity">Birds</Link></li>
              <li><Link to="/shop" className="opacity-80 hover:opacity-100 transition-opacity">Pet Equipment</Link></li>
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
                <a className="opacity-80 hover:opacity-100 transition-opacity" href="tel:+35796336767">
                  +357 96 336767
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a className="opacity-80 hover:opacity-100 transition-opacity" href="mailto:info@cyprus-pets.com">
                  info@cyprus-pets.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Affiliate Partners */}
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
          
          <div className="text-center space-y-4">
            <p className="text-xs opacity-60">
              © 2024 Cyprus Pets. All rights reserved.
            </p>
            
            {/* Enhanced FTC-Compliant Affiliate Disclosure */}
            <div className="bg-orange-100/10 border border-orange-200/20 rounded-lg p-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-4 h-4 mr-2 text-orange-300" />
                <h5 className="font-semibold text-sm text-orange-200">Affiliate Disclosure</h5>
              </div>
              <p className="text-xs opacity-85 leading-relaxed text-left">
                <strong>Important Notice:</strong> Cyprus Pets participates in affiliate marketing programs including Amazon Associates, Chewy Affiliate Program, PetSmart Affiliate Program, and other pet-related affiliate networks. When you click on product links and make a purchase, we may earn a commission at no additional cost to you. These commissions help us maintain our free resources and continue providing valuable pet care information to the Cyprus community.
                <br /><br />
                <strong>Our Promise:</strong> All product recommendations are based on thorough research, genuine experience, and what we believe will benefit pet owners in Cyprus. We only recommend products we would use for our own pets. Commission earnings never influence our honest reviews and recommendations.
                <br /><br />
                <strong>Compliance:</strong> This website complies with FTC guidelines regarding affiliate marketing disclosures. For questions about our affiliate relationships, contact us at info@cyprus-pets.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
