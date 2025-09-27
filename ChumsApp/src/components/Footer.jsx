import React from 'react';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">ChumsGrow</h2>
                <p className="text-xs text-gray-500">Your Path to Smarter Investments</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Empowering investors with AI-powered insights and personalized recommendations for smarter financial decisions.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors text-primary">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors text-primary">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/risk-profiler" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Risk Profiler
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Market Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Investment Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Market Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-600 text-sm">support@chumsgrow.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-600 text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-600 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="font-medium text-primary mb-2">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-l-lg text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-2 md:mb-0">
              © {currentYear} ChumsGrow. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                Cookie Policy
              </a>
              <button
                onClick={scrollToTop}
                className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors text-primary"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
