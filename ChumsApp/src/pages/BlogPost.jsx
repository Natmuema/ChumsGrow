import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, User, Share2, BookOpen, TrendingUp } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample blog posts data (in a real app, this would come from an API)
  const allPosts = [
    {
      id: 1,
      title: "Understanding Investment Risk: A Complete Guide for Beginners",
      excerpt: "Learn how to assess and manage investment risk effectively to build a strong portfolio that aligns with your financial goals.",
      content: `
        <div class="prose max-w-none">
          <p class="text-lg font-medium text-gray-700 mb-6">Investment risk is one of the most crucial concepts every investor must understand. Whether you're just starting your investment journey or looking to refine your strategy, understanding risk can make the difference between success and failure in the financial markets.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">What is Investment Risk?</h2>
          <p class="mb-6">Investment risk refers to the possibility that an investment's actual returns will differ from expected returns. This includes the possibility of losing some or all of the original investment. Risk is inherent in all investments, but understanding and managing it is key to successful investing.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Types of Investment Risk</h2>
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-xl font-semibold text-primary mb-3">1. Market Risk</h3>
            <p class="mb-4">The risk that the entire market will decline, affecting most investments regardless of their individual performance.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">2. Credit Risk</h3>
            <p class="mb-4">The risk that a borrower will default on their obligations, particularly relevant for bonds and fixed-income investments.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">3. Liquidity Risk</h3>
            <p class="mb-4">The risk that you won't be able to sell an investment quickly without affecting its price significantly.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">4. Inflation Risk</h3>
            <p>The risk that inflation will erode the purchasing power of your investment returns over time.</p>
          </div>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Risk Management Strategies</h2>
          <ul class="list-disc list-inside mb-6 space-y-2">
            <li><strong>Diversification:</strong> Spread your investments across different asset classes, sectors, and geographic regions.</li>
            <li><strong>Asset Allocation:</strong> Balance your portfolio between stocks, bonds, and other investments based on your risk tolerance.</li>
            <li><strong>Regular Review:</strong> Periodically assess and rebalance your portfolio to maintain your desired risk level.</li>
            <li><strong>Emergency Fund:</strong> Keep 3-6 months of expenses in a liquid emergency fund before investing.</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Assessing Your Risk Tolerance</h2>
          <p class="mb-6">Your risk tolerance depends on several factors:</p>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-primary mb-2">Time Horizon</h4>
              <p class="text-sm">Longer investment periods generally allow for higher risk tolerance.</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-primary mb-2">Financial Goals</h4>
              <p class="text-sm">Your objectives should align with your risk-taking capacity.</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-primary mb-2">Age & Income</h4>
              <p class="text-sm">Younger investors with stable income can typically take more risk.</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-primary mb-2">Emotional Comfort</h4>
              <p class="text-sm">Your ability to handle market volatility without panic selling.</p>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Conclusion</h2>
          <p class="mb-6">Understanding investment risk is not about avoiding it entirely – it's about taking calculated risks that align with your financial goals and comfort level. Remember, higher potential returns typically come with higher risk, but with proper knowledge and strategy, you can build a portfolio that balances growth potential with acceptable risk levels.</p>
          
          <div class="bg-primary text-white p-6 rounded-lg mt-8">
            <h3 class="text-xl font-bold mb-3">Ready to Start Investing?</h3>
            <p class="mb-4">Use our risk profiler tool to assess your risk tolerance and get personalized investment recommendations.</p>
            <button class="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Take Risk Assessment
            </button>
          </div>
        </div>
      `,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      category: "Risk Management",
      author: "Kalondu Chirwa",
      date: "Sep 15th '25",
      readTime: "8 min read",
      views: "2.5K",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Market Trends 2024: Key Opportunities for Smart Investors",
      excerpt: "Discover the emerging market trends and investment opportunities that could shape your portfolio's performance in 2024.",
      content: `
        <div class="prose max-w-none">
          <p class="text-lg font-medium text-gray-700 mb-6">As we navigate through 2024, the investment landscape continues to evolve with new opportunities and challenges. Understanding current market trends is crucial for making informed investment decisions.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Key Market Trends for 2024</h2>
          
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-xl font-semibold text-primary mb-3">1. Artificial Intelligence Revolution</h3>
            <p class="mb-4">AI continues to transform industries, creating investment opportunities in AI-focused companies, semiconductors, and automation technologies.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">2. Sustainable Investing Growth</h3>
            <p class="mb-4">ESG (Environmental, Social, Governance) investments are gaining momentum as investors seek sustainable returns.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">3. Emerging Markets Recovery</h3>
            <p>Developing economies are showing signs of recovery, presenting opportunities for diversified global portfolios.</p>
          </div>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Investment Strategies for 2024</h2>
          <p class="mb-6">Based on current market conditions, here are key strategies to consider:</p>
          
          <ul class="list-disc list-inside mb-6 space-y-2">
            <li><strong>Technology Focus:</strong> Continue investing in innovative tech companies with strong fundamentals.</li>
            <li><strong>Dividend Aristocrats:</strong> Companies with consistent dividend growth provide stability in uncertain times.</li>
            <li><strong>International Diversification:</strong> Look beyond domestic markets for growth opportunities.</li>
            <li><strong>Alternative Investments:</strong> Consider REITs, commodities, and other alternative asset classes.</li>
          </ul>
          
          <div class="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-bold text-primary mb-3">Risk Considerations</h3>
            <p>While opportunities abound, investors should be aware of potential risks including inflation concerns, geopolitical tensions, and market volatility.</p>
          </div>
        </div>
      `,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      category: "Market Analysis",
      author: "Michael Kamau",
      date: "Sep 10th '25",
      readTime: "12 min read",
      views: "3.1K",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Building Your First Investment Portfolio: Step-by-Step Guide",
      excerpt: "A comprehensive guide to creating a diversified investment portfolio that matches your risk tolerance and financial objectives.",
      content: `
        <div class="prose max-w-none">
          <p class="text-lg font-medium text-gray-700 mb-6">Creating your first investment portfolio can seem overwhelming, but with the right approach and knowledge, you can build a solid foundation for long-term wealth growth.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Step 1: Define Your Goals</h2>
          <p class="mb-6">Before investing, clearly define what you want to achieve. Are you saving for retirement, a house, or building wealth? Your goals will determine your investment strategy.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Step 2: Assess Your Risk Tolerance</h2>
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg text-center">
              <h4 class="font-semibold text-primary mb-2">Conservative</h4>
              <p class="text-sm">Lower risk, stable returns</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg text-center">
              <h4 class="font-semibold text-primary mb-2">Moderate</h4>
              <p class="text-sm">Balanced risk and return</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg text-center">
              <h4 class="font-semibold text-primary mb-2">Aggressive</h4>
              <p class="text-sm">Higher risk, higher potential returns</p>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Step 3: Choose Your Asset Allocation</h2>
          <p class="mb-6">A common rule of thumb is to subtract your age from 100 to determine your stock allocation percentage. The remainder should be in bonds and other fixed-income investments.</p>
          
          <div class="bg-primary text-white p-6 rounded-lg mt-8">
            <h3 class="text-xl font-bold mb-3">Start Building Today</h3>
            <p class="mb-4">Ready to create your personalized investment portfolio? Use our portfolio builder tool to get started.</p>
            <button class="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Build My Portfolio
            </button>
          </div>
        </div>
      `,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
      category: "Portfolio Building",
      author: "Jennifer Muthoni",
      date: "Dec 8th '24",
      readTime: "10 min read",
      views: "1.8K",
      level: "Beginner"
    },
    {
      id: 4,
      title: "The Psychology of Investing: Overcoming Emotional Decisions",
      excerpt: "Learn how to recognize and overcome common psychological biases that can negatively impact your investment decisions.",
      content: `
        <div class="prose max-w-none">
          <p class="text-lg font-medium text-gray-700 mb-6">Successful investing isn't just about numbers and analysis – it's also about understanding and managing your emotions and psychological biases.</p>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Common Investment Biases</h2>
          
          <div class="space-y-6 mb-8">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-primary mb-3">Loss Aversion</h3>
              <p>The tendency to feel losses more acutely than equivalent gains, leading to poor selling decisions.</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-primary mb-3">Confirmation Bias</h3>
              <p>Seeking information that confirms existing beliefs while ignoring contradictory evidence.</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-primary mb-3">Herd Mentality</h3>
              <p>Following the crowd instead of making independent, rational investment decisions.</p>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-primary mt-8 mb-4">Strategies to Overcome Emotional Investing</h2>
          <ul class="list-disc list-inside mb-6 space-y-2">
            <li><strong>Create a Written Plan:</strong> Document your investment strategy and stick to it.</li>
            <li><strong>Automate Investments:</strong> Use dollar-cost averaging to remove emotion from timing decisions.</li>
            <li><strong>Regular Review:</strong> Set specific times to review your portfolio, not daily.</li>
            <li><strong>Diversify:</strong> Reduce emotional attachment to individual investments.</li>
          </ul>
        </div>
      `,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      category: "Investment Psychology",
      author: "Thompson",
      date: "Sep 5th '24",
      readTime: "6 min read",
      views: "2.2K",
      level: "Intermediate"
    }
  ];

  useEffect(() => {
    // Simulate loading and finding the post
    setLoading(true);
    const foundPost = allPosts.find(p => p.id === parseInt(id));
    
    if (foundPost) {
      setPost(foundPost);
      // Get related posts (same category, excluding current post)
      const related = allPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
    
    setLoading(false);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link 
            to="/learning-hub"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
          >
            Back to Learning Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-blue-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Learning Hub
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary opacity-80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white text-primary rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.level && (
                <span className="px-3 py-1 bg-blue-900 text-white rounded-full text-sm font-medium">
                  {post.level}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-6 text-gray-200">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{post.author}</h3>
                  <p className="text-gray-500 text-sm">Investment Expert</p>
                </div>
              </div>
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
            
            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            <div className="flex items-center gap-2 mt-12 pt-8 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Tags:</span>
              <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                {post.category}
              </span>
              {post.level && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {post.level}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-8 text-center">Related Articles</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="px-2 py-1 bg-primary text-white rounded text-xs font-medium">
                          {relatedPost.category}
                        </span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      
                      <h3 className="font-bold text-primary group-hover:text-blue-900 transition-colors duration-200 mb-2 leading-tight">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {relatedPost.author}</span>
                        <span>{relatedPost.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  to="/learning-hub"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors inline-flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  View All Articles
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;

