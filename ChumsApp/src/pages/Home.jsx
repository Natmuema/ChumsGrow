import React from 'react';
import { ArrowRight, TrendingUp, BookOpen, Target, BarChart3, Users, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/heroImage.jpg';

const Home = () => {
  const learningPosts = [
    {
      id: 1,
      title: "Understanding Risk vs Return",
      excerpt: "Learn how to balance risk and potential returns in your investment portfolio for optimal growth.",
      readTime: "5 min read",
      category: "Basics"
    },
    {
      id: 2,
      title: "Diversification Strategies",
      excerpt: "Discover proven techniques to spread risk across different asset classes and sectors.",
      readTime: "7 min read",
      category: "Strategy"
    },
    {
      id: 3,
      title: "Market Timing vs Time in Market",
      excerpt: "Why staying invested long-term often beats trying to time the market perfectly.",
      readTime: "6 min read",
      category: "Psychology"
    }
  ];

  const opportunities = [
    {
      name: "Tech Growth Fund",
      return: "12.5%",
      risk: "Medium",
      type: "Mutual Fund"
    },
    {
      name: "Stable Income Bonds", 
      return: "6.2%",
      risk: "Low",
      type: "Bonds"
    },
    {
      name: "Emerging Markets ETF",
      return: "18.3%",
      risk: "High", 
      type: "ETF"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Investment Background"
            className="object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
              Your Gateway to <span className="text-primary">Smarter</span> Investing
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up">
              AI-powered insights. Expert-backed recommendations. All designed to grow your wealth confidently.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link
                to="/risk-profiler"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center space-x-2 shadow-primary"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/learning-hub"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-200">Investment Options</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">12.5%</div>
                <div className="text-sm text-gray-200">Avg. Returns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose ChumsGrow?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven investment strategies to help you achieve your financial goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze market trends and provide personalized investment recommendations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-secondary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Management</h3>
              <p className="text-gray-600">
                Comprehensive risk assessment tools to match investments with your comfort level.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-900 bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Access to professional insights and educational resources from investment experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Hub Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Investment Learning Hub</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expand your knowledge with our comprehensive guides and expert insights on smart investing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {learningPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary bg-opacity-10 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-primary font-medium">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/learning-hub"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors inline-flex items-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>View All Articles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Investment Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover curated investment options tailored to different risk profiles and financial goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{opportunity.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    opportunity.risk === 'Low' ? 'bg-green-100 text-green-800' :
                    opportunity.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {opportunity.risk} Risk
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-semibold text-primary">{opportunity.return}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{opportunity.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/opportunities"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors inline-flex items-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>Explore All Opportunities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take our quick risk assessment to get personalized investment recommendations powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/risk-profiler"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Start Risk Assessment</span>
            </Link>
            <Link
              to="/auth"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;