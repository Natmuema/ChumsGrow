import React from 'react'
import heroBg from '../assets/heroImage.jpg'
import { ArrowRight, Sparkles, Shield, LineChart, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../utils/blogPosts'

const Home = () => {
  return (
   <section className="bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      <div className="relative h-[80vh] sm:h-[85vh] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Background"
            className="object-cover object-center w-full h-full "
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
           Your Gateway to Smarter Investing
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-2xl">
            AI-powered insights. Expert-backed recommendations. All designed to grow your wealth confidently.
          </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/risk-profiler"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/opportunities"
            className="border-2 border-white/70 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            Explore Opportunities
          </Link>
        </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-green-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Investment Options</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-blue-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Bank-grade</div>
            <div className="text-sm text-gray-600">Security & Privacy</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <LineChart className="w-5 h-5 text-yellow-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">10%</div>
            <div className="text-sm text-gray-600">Avg. Returns</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-purple-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Learning Hub</div>
            <div className="text-sm text-gray-600">Guides & Tips</div>
          </div>
        </div>

        {/* Latest from Learning Hub */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest from Learning Hub</h2>
            <Link to="/learning-hub" className="text-green-700 font-semibold hover:underline inline-flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map(post => (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{post.category}</span>
                  <h3 className="mt-2 font-semibold text-gray-900 leading-tight">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                  <Link to="/learning-hub" className="mt-3 inline-flex items-center text-sm text-green-700 hover:underline">Read more<ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home