import { Heart, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">CyprusPets</h3>
                <p className="text-xs opacity-80">Cyprus Pet Marketplace</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecting pet lovers across Cyprus. Find your perfect companion or give a loving pet a new home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Browse Pets</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Post an Ad</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Pet Care Tips</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Success Stories</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
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
                <span className="opacity-80">+357 99 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="opacity-80">info@cypruspets.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> for Cyprus pet lovers
          </p>
          <p className="text-xs opacity-60 mt-2">
            © 2024 CyprusPets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;