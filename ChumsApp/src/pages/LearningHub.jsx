import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Calendar, ArrowRight, TrendingUp, DollarSign, PieChart, BarChart3, Target, BookOpen } from 'lucide-react';

const Learninghub = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: "Complete Guide to T-Bills in Kenya: How to Earn 15%+ Returns",
      description: "Master Treasury Bills investing in Kenya - from application process to maximizing returns. Perfect for conservative investors seeking guaranteed returns.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      category: "Beginner Basics",
      readTime: "8 min read",
      level: "Beginner"
    },
    {
      id: 2,
      title: "NSE Stock Analysis: Top 5 Dividend Champions for 2024",
      description: "Deep dive into Kenya's most reliable dividend-paying stocks. Technical analysis, fundamentals, and future prospects covered.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      category: "Advanced Topics",
      readTime: "12 min read",
      level: "Advanced"
    },
    {
      id: 3,
      title: "SACCO vs Bank vs Money Market: Where Should You Invest?",
      description: "Comprehensive comparison of investment vehicles in Kenya. Real returns, risks, and strategies for different investor profiles.",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop",
      category: "Intermediate Guides",
      readTime: "10 min read",
      level: "Intermediate"
    },
    {
      id: 4,
      title: "AI-Powered Portfolio Optimization for Kenyan Investors",
      description: "How artificial intelligence can help you build and maintain the perfect investment portfolio based on your risk profile and goals.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      category: "AI & Data-Driven Insights",
      readTime: "15 min read",
      level: "Intermediate"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen, count: 127 },
    { id: 'beginner', name: 'Beginner Basics', icon: Target, count: 34 },
    { id: 'intermediate', name: 'Intermediate Guides', icon: BarChart3, count: 28 },
    { id: 'advanced', name: 'Advanced Topics', icon: TrendingUp, count: 22 },
    { id: 'ai-insights', name: 'AI & Data Insights', icon: PieChart, count: 18 },
    { id: 'practical', name: 'Practical Guides', icon: DollarSign, count: 25 }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: "What is Investing? Complete Guide for Kenyan Beginners",
      excerpt: "Start your investment journey with this comprehensive guide covering basics, terminology, and first steps in the Kenyan market.",
      author: "Sarah Wanjiku",
      category: "Beginner Basics",
      date: "Dec 15th '24",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop",
      featured: true,
      level: "Beginner",
      views: "12.5K"

    },
    {
      id: 2,
      title: "How to Evaluate SACCOs Before Investing Your Money",
      author: "David Kimani",
      category: "Practical Guides",
      date: "Dec 12th '24",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop",
      level: "Beginner",
      views: "8.2K"
      
    },
    {
      id: 3,
      title: "REITs in Kenya: Your Gateway to Real Estate Investing",
      author: "Grace Mutindi",
      category: "Intermediate Guides",
      date: "Dec 10th '24",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=300&h=200&fit=crop",
      level: "Intermediate",
      views: "15.7K"
    },
    {
      id: 4,
      title: "Tax-Smart Investing Strategies for Kenyan Professionals",
      author: "Michael Ochieng",
      category: "Advanced Topics",
      date: "Dec 8th '24",
      readTime: "13 min read",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop",
      level: "Advanced",
      views: "6.9K"
    }
  ];

  const trendingPosts = [
    { 
      id: 5, 
      title: "Step-by-Step: How to Buy T-Bills Through Your Phone", 
      author: "Financial Advisor Team", 
      rank: 1,
      category: "Practical Guides",
      views: "25.3K"
    },
    { 
      id: 6, 
      title: "Best SACCOs in Kenya 2024: Interest Rates Compared", 
      author: "Investment Research", 
      rank: 2,
      category: "Beginner Basics",
      views: "18.9K"
    },
    { 
      id: 7, 
      title: "NSE Market Analysis: December 2024 Outlook", 
      author: "Market Analysts", 
      rank: 3,
      category: "Advanced Topics",
      views: "16.4K"
    },
    { 
      id: 8, 
      title: "Emergency Fund vs Investment: Finding the Right Balance", 
      author: "Personal Finance Expert", 
      rank: 4,
      category: "Intermediate Guides",
      views: "14.1K"
    },
    { 
      id: 9, 
      title: "AI Risk Profiling: Match Your Personality to Investments", 
      author: "Tech Team", 
      rank: 5,
      category: "AI & Data-Driven Insights",
      views: "11.8K"
    }
  ];

  const additionalPosts = [
    {
      id: 5,
      title: "Understanding Risk Levels: Conservative vs Moderate vs Aggressive",
      author: "Risk Management Team",
      category: "Beginner Basics",
      date: "Dec 5th '24",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=200&fit=crop",
      level: "Beginner",
      views: "9.3K"
    },
    {
      id: 6,
      title: "Agriculture Investment in Kenya: Opportunities and Pitfalls",
      author: "Sector Specialist",
      category: "Intermediate Guides",
      date: "Dec 3rd '24",
      readTime: "14 min read",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
      level: "Intermediate",
      views: "7.8K"
    },
    {
      id: 7,
      title: "Money Market Funds vs Fixed Deposits: Which Wins?",
      author: "Product Comparison Team",
      category: "Intermediate Guides",
      date: "Nov 30th '24",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
      level: "Intermediate",
      views: "13.2K"
    },
    {
      id: 8,
      title: "Common Investment Mistakes Kenyan Beginners Make",
      author: "Education Team",
      category: "Beginner Basics",
      date: "Nov 28th '24",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop",
      level: "Beginner",
      views: "21.4K"
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const PostCard = ({ post, size = 'medium' }) => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };

    return (
      <Link to={`/blog/${post.id}`}>
        <article className={`group cursor-pointer ${size === 'large' ? 'mb-8' : 'mb-6'} bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}>
        {post.image && (
          <div className="relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                size === 'large' ? 'h-64' : 'h-48'
              }`}
            />
            <div className="absolute top-4 left-4">
              {post.level && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(post.level)}`}>
                  {post.level}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className="px-2 py-1 bg-primary bg-opacity-10 text-white rounded text-xs font-medium">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {post.date}
            </span>
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>

          <h3 className={`font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 mb-3 ${sizeClasses[size]} ${size === 'large' ? 'text-xl' : ''} leading-tight`}>
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={14} />
              <span>By {post.author}</span>
            </div>
            {post.views && (
              <span className="text-xs text-gray-400">{post.views} views</span>
            )}
          </div>
        </div>
        </article>
      </Link>
    );
  };

  const TrendingItem = ({ post }) => (
    <Link to={`/blog/${post.id}`}>
      <li className="group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
            {post.rank}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200 mb-2 text-sm leading-tight">
              {post.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">By {post.author}</span>
              <span className="text-xs text-gray-400">{post.views}</span>
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {post.category}
            </span>
          </div>
        </div>
      </li>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="relative h-96 md:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                        {slide.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(slide.level)}`}>
                        {slide.level}
                      </span>
                      <span className="text-sm text-gray-300">{slide.readTime}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                    <Link to={`/blog/${slide.id}`}>
                      <button className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg">
                        Read Article
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 border border-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 border border-white/20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={16} />
                  {category.name}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Featured Post */}
            <div className="lg:col-span-4">
              <PostCard post={featuredPosts[0]} size="large" />
            </div>

            {/* Secondary Posts */}
            <div className="lg:col-span-5">
              <div className="grid gap-6">
                {featuredPosts.slice(1, 4).map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <div className="flex gap-4 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                      <div className="flex-shrink-0 w-32">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <span className="px-2 py-0.5 bg-white bg-opacity-10 text-primary rounded">
                            {post.category}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 hover:text-primary cursor-pointer transition-colors duration-200 mb-1 leading-tight">
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {post.author}</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sticky top-24 border border-primary border-opacity-20">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-primary" size={20} />
                  <h3 className="text-xl font-bold text-gray-900">Trending This Week</h3>
                </div>
                <ul className="space-y-1">
                  {trendingPosts.map((post) => (
                    <TrendingItem key={post.id} post={post} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Investment Education Hub</h2>
                <p className="text-gray-600">Master investing in Kenya with expert insights and practical guides</p>
              </div>
              <button className="text-primary hover:text-secondary font-semibold flex items-center gap-1">
                View All Articles
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {additionalPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Learninghub;