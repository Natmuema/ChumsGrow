import React from 'react'
import heroBg from '../assets/heroImage.jpg'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
   <section className="bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-16">
      <div className="relative h-screen text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Background"
            className="object-cover object-center w-full h-full "
          />
          
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <h1 className="text-5xl font-bold leading-tight mb-4">
           Your Gateway to Smarter Investing
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            AI-powered insights. Expert-backed recommendations. All designed to grow your wealth confidently.
          </p>
        <div className="flex flex-col sm:flex-row gap-4">
      {/* See Your Potential */}
      <Link
        to="/potential"
        className="bg-green-800 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
      >
        <span>See Your Potential</span>
        <ArrowRight className="h-5 w-5" />
      </Link>

      {/* Take Risk Assessment */}
      <Link
        to="/opportunities"
        className="border-2 border--700 text-white-700 px-8 py-4 rounded-lg font-semibold hover:bg-transparent transition-colors flex items-center justify-center"
      >
        Opportunities
      </Link>
    </div>
        </div>
      </div>

         {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Investment Options</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10%</div>
                <div className="text-sm text-gray-600">Avg. Returns</div>
              </div>
            </div>
    </section>
  )
}

export default Home