import React from 'react';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-700 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">ChumsGrow</h3>
                <p className="text-sm text-gray-500">Your Path to Smarter Investments</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md">
              Empowering individuals to make informed investment decisions through AI-powered insights and personalized recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/home" className="text-gray-600 hover:text-green-700 transition-colors">Home</a></li>
              <li><a href="/risk-profiler" className="text-gray-600 hover:text-green-700 transition-colors">Risk Profiler</a></li>
              <li><a href="/learning-hub" className="text-gray-600 hover:text-green-700 transition-colors">Learning Hub</a></li>
              <li><a href="/opportunities" className="text-gray-600 hover:text-green-700 transition-colors">Opportunities</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <div className="space-y-2 text-gray-600">
              <p>support@chumsgrow.com</p>
              <p>+254 700 000 000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 ChumsGrow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;