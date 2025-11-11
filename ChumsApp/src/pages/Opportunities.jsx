import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Star,
  Eye,
  BarChart3,
  Loader2
} from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Simulate loading and set fallback data
    setTimeout(() => {
      setOpportunities(fallbackOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const fallbackOpportunities = [
    {
      id: 1,
      name: "Safaricom PLC",
      category: "Stocks",
      risk_level: "moderate",
      expected_return: 15.2,
      min_investment: 1000,
      current_price: 45.50,
      description: "Kenya's leading telecommunications company with strong dividend history and growth in fintech.",
      rating: 4.5,
      market_cap: "1.8T KES",
      dividend_yield: 6.2,
      tags: ["Telecom", "Blue Chip", "Dividend"]
    },
    {
      id: 2,
      name: "Equity Bank Group",
      category: "Stocks", 
      risk_level: "moderate",
      expected_return: 14.8,
      min_investment: 500,
      current_price: 52.75,
      description: "Leading commercial bank in East Africa with strong regional presence and digital banking services.",
      rating: 4.3,
      market_cap: "200B KES",
      dividend_yield: 8.5,
      tags: ["Banking", "Regional", "Digital"]
    },
    {
      id: 3,
      name: "Kenya Government Bonds",
      category: "Bonds",
      risk_level: "conservative", 
      expected_return: 12.5,
      min_investment: 50000,
      current_price: 100.00,
      description: "Government-backed treasury bonds with guaranteed returns and regular interest payments.",
      rating: 5.0,
      market_cap: "2.5T KES",
      dividend_yield: 12.5,
      tags: ["Government", "Safe", "Fixed Income"]
    },
    {
      id: 4,
      name: "Money Market Fund",
      category: "Money Market",
      risk_level: "conservative",
      expected_return: 8.5,
      min_investment: 5000,
      current_price: 10.00,
      description: "Low-risk fund investing in short-term government securities and bank deposits.",
      rating: 4.6,
      market_cap: "15B KES",
      dividend_yield: 8.5,
      tags: ["Low Risk", "Liquid", "Short Term"]
    }
  ];

  const categories = ['All', 'Stocks', 'Bonds', 'Money Market'];
  
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'aggressive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Investment Opportunities</h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover curated investment options in the Kenyan market. From blue-chip stocks to government bonds, 
            find opportunities that match your risk profile and financial goals.
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="text-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredOpportunities.length} Investment Opportunities Found
            </h2>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <div 
                  key={opportunity.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {opportunity.name}
                        </h3>
                        <p className="text-sm text-gray-500">{opportunity.category}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{opportunity.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.risk_level)}`}>
                        {opportunity.risk_level.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expected Return</p>
                        <p className="font-bold text-primary">{opportunity.expected_return}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Price</p>
                        <p className="font-bold text-gray-900">KSh {opportunity.current_price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Min Investment</p>
                        <p className="font-bold text-gray-900">{formatCurrency(opportunity.min_investment)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                        <p className="font-bold text-gray-900">{opportunity.market_cap}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {opportunity.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center text-sm font-medium">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Invest Now
                      </button>
                      <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Insights</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed about the latest trends and opportunities in the Kenyan investment market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">NSE Performance</h3>
              <p className="text-gray-600">
                The Nairobi Securities Exchange has shown steady growth with increased foreign investment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Government Securities</h3>
              <p className="text-gray-600">
                Treasury bonds continue to offer attractive yields with government backing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sector Analysis</h3>
              <p className="text-gray-600">
                Banking and telecommunications sectors lead market performance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Opportunities;