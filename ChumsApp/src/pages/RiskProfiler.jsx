import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  DollarSign, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Calculator, 
  PieChart, 
  BarChart3, 
  Info, 
  ChevronRight, 
  LogOut, 
  Lock,
  MessageCircle,
  Send,
  Bot,
  User as UserIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { fetchWithAuth } from '../utils/api'; 
import { useAuth } from '../components/AuthContext';

const RiskProfiler = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    monthly_income: '',
    investment_amount: '',
    risk_tolerance: '',
    investment_timeline: '',
    financial_goals: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const chatMessagesRef = useRef(null);

  // Initialize chatbot when recommendations are shown
  useEffect(() => {
    if (step === 3 && recommendations.length > 0) {
      setShowChatbot(true);
      setChatMessages([
        {
          type: 'bot',
          message: `Hello ${user?.full_name || user?.username}! 👋 I'm your AI investment advisor. I've analyzed your profile and generated personalized recommendations. Do you have any questions about your investment portfolio or need clarification on any of the recommendations?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [step, recommendations, user]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the Risk Profiler. Please sign in to continue with your investment assessment.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!profile.age || profile.age < 18 || profile.age > 100) {
      errors.age = 'Age must be between 18 and 100';
    }
    
    if (!profile.monthly_income || profile.monthly_income < 1000) {
      errors.monthly_income = 'Monthly income must be at least KSh 1,000';
    }
    
    if (!profile.investment_amount || profile.investment_amount < 1000) {
      errors.investment_amount = 'Investment amount must be at least KSh 1,000';
    }
    
    if (profile.investment_amount > profile.monthly_income * 12) {
      errors.investment_amount = 'Investment amount seems too high compared to annual income';
    }
    
    if (!profile.risk_tolerance) {
      errors.risk_tolerance = 'Please select your risk tolerance';
    }
    
    if (!profile.investment_timeline) {
      errors.investment_timeline = 'Please select your investment timeline';
    }
    
    if (!profile.financial_goals || profile.financial_goals.length < 10) {
      errors.financial_goals = 'Please provide more details about your financial goals (at least 10 characters)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // First try AI-powered recommendations
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/risk-profile/', {
        method: 'POST',
        body: JSON.stringify({
          ...profile,
          age: parseInt(profile.age),
          monthly_income: parseFloat(profile.monthly_income),
          investment_amount: parseFloat(profile.investment_amount),
          investment_timeline: parseInt(profile.investment_timeline)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Fallback to backup recommendations
        console.log('AI recommendations failed, using backup');
        generateBackupRecommendations();
        return;
      }

      setRecommendations(data.recommendations || []);
      setStep(3);
    } catch (err) {
      console.log('Error with AI recommendations, using backup:', err);
      generateBackupRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const generateBackupRecommendations = () => {
    // Backup recommendation logic
    const amount = parseFloat(profile.investment_amount);
    const riskLevel = profile.risk_tolerance;
    const timeline = parseInt(profile.investment_timeline);
    
    let backupRecs = [];
    
    if (riskLevel === 'conservative') {
      backupRecs = [
        {
          investment: {
            name: "Government Treasury Bills",
            type: "bonds",
            risk_level: "conservative",
            expected_return: 12.5,
            min_investment: 100000,
            liquidity: "high",
            local_description: "Hizi ni mikopo ya serikali ya Kenya. Ni salama sana."
          },
          recommended_amount: amount * 0.4,
          reasoning: "Safe government-backed investment suitable for conservative investors.",
          confidence_score: 0.9
        },
        {
          investment: {
            name: "Fixed Deposit Account",
            type: "fixed_deposit",
            risk_level: "conservative",
            expected_return: 10.0,
            min_investment: 50000,
            liquidity: "medium",
            local_description: "Akaunti ya amana katika benki. Pesa zinakua pole pole."
          },
          recommended_amount: amount * 0.3,
          reasoning: "Stable returns with capital protection.",
          confidence_score: 0.85
        },
        {
          investment: {
            name: "SACCO Savings",
            type: "money_market",
            risk_level: "conservative",
            expected_return: 8.5,
            min_investment: 5000,
            liquidity: "high",
            local_description: "Kuweka pesa katika SACCO. Ni salama na una dividends."
          },
          recommended_amount: amount * 0.3,
          reasoning: "Community-based savings with good returns and high liquidity.",
          confidence_score: 0.8
        }
      ];
    } else if (riskLevel === 'moderate') {
      backupRecs = [
        {
          investment: {
            name: "NSE Stock Market ETF",
            type: "stocks",
            risk_level: "moderate",
            expected_return: 15.0,
            min_investment: 50000,
            liquidity: "high",
            local_description: "Kununua hisa za makampuni mengi pamoja. Ni soko la NSE."
          },
          recommended_amount: amount * 0.4,
          reasoning: "Diversified exposure to Kenyan stock market with professional management.",
          confidence_score: 0.8
        },
        {
          investment: {
            name: "Corporate Bonds",
            type: "bonds",
            risk_level: "moderate",
            expected_return: 14.0,
            min_investment: 100000,
            liquidity: "medium",
            local_description: "Mkopo kwa makampuni makubwa kama Safaricom."
          },
          recommended_amount: amount * 0.35,
          reasoning: "Higher yields than government bonds with acceptable risk.",
          confidence_score: 0.75
        },
        {
          investment: {
            name: "Real Estate Investment Trust",
            type: "real_estate",
            risk_level: "moderate",
            expected_return: 12.0,
            min_investment: 25000,
            liquidity: "medium",
            local_description: "Uwekezaji wa mali isiyohamishika bila kununua nyumba mzima."
          },
          recommended_amount: amount * 0.25,
          reasoning: "Exposure to real estate market without direct property ownership.",
          confidence_score: 0.8
        }
      ];
    } else { // aggressive
      backupRecs = [
        {
          investment: {
            name: "Growth Stocks Portfolio",
            type: "stocks",
            risk_level: "aggressive",
            expected_return: 20.0,
            min_investment: 25000,
            liquidity: "high",
            local_description: "Hisa za makampuni yanayokua haraka kama tech companies."
          },
          recommended_amount: amount * 0.5,
          reasoning: "High growth potential for long-term wealth building.",
          confidence_score: 0.7
        },
        {
          investment: {
            name: "Business Investment",
            type: "business",
            risk_level: "aggressive",
            expected_return: 25.0,
            min_investment: 100000,
            liquidity: "low",
            local_description: "Kuanzisha au kushiriki katika biashara."
          },
          recommended_amount: amount * 0.3,
          reasoning: "Highest potential returns through entrepreneurial ventures.",
          confidence_score: 0.6
        },
        {
          investment: {
            name: "Agricultural Investment",
            type: "agriculture",
            risk_level: "aggressive",
            expected_return: 18.0,
            min_investment: 50000,
            liquidity: "low",
            local_description: "Uwekezaji katika kilimo au mifugo."
          },
          recommended_amount: amount * 0.2,
          reasoning: "Strong agricultural sector in Kenya with good returns.",
          confidence_score: 0.75
        }
      ];
    }
    
    setRecommendations(backupRecs);
    setStep(3);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      type: 'user',
      message: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Try to get AI response
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.message,
          context: {
            recommendations: recommendations,
            profile: profile
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.response) {
        const botMessage = {
          type: 'bot',
          message: data.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback response
        generateFallbackResponse(userMessage.message);
      }
    } catch (err) {
      console.log('Chat API error, using fallback:', err);
      generateFallbackResponse(userMessage.message);
    } finally {
      setChatLoading(false);
    }
  };

  const generateFallbackResponse = (userInput) => {
    let response = "";
    const input = userInput.toLowerCase();

    if (input.includes('risk') || input.includes('hatari')) {
      response = `Based on your ${profile.risk_tolerance} risk tolerance, I've recommended investments that match your comfort level. ${profile.risk_tolerance === 'conservative' ? 'Your portfolio focuses on capital preservation with steady returns.' : profile.risk_tolerance === 'moderate' ? 'Your portfolio balances growth potential with stability.' : 'Your portfolio is designed for maximum growth potential over the long term.'}`;
    } else if (input.includes('return') || input.includes('profit') || input.includes('faida')) {
      const avgReturn = recommendations.length > 0 ? 
        (recommendations.reduce((sum, rec) => sum + parseFloat(rec.investment.expected_return), 0) / recommendations.length).toFixed(1) : 
        '0';
      response = `Your portfolio has an average expected return of ${avgReturn}% per year. Remember, these are projections and actual returns may vary based on market conditions.`;
    } else if (input.includes('amount') || input.includes('kiasi') || input.includes('money')) {
      const totalRecommended = recommendations.reduce((sum, rec) => sum + parseFloat(rec.recommended_amount || 0), 0);
      response = `I've allocated KSh ${totalRecommended.toLocaleString()} of your KSh ${parseFloat(profile.investment_amount).toLocaleString()} across ${recommendations.length} different investments for optimal diversification.`;
    } else if (input.includes('timeline') || input.includes('time') || input.includes('muda')) {
      response = `Your ${profile.investment_timeline} month investment timeline is perfect for the recommended portfolio. This gives enough time for your investments to grow while maintaining the right balance of risk and return.`;
    } else if (input.includes('safe') || input.includes('security') || input.includes('usalama')) {
      response = "All recommended investments are from reputable institutions in Kenya. Government bonds and bank deposits are backed by the government, while other investments are from well-established companies. Remember to only invest what you can afford to lose.";
    } else if (input.includes('start') || input.includes('begin') || input.includes('anza')) {
      response = "To start investing: 1) Choose which recommendation to begin with 2) Contact the respective institution 3) Complete their account opening process 4) Transfer your funds 5) Monitor your investments regularly. I recommend starting with the highest-confidence recommendations first.";
    } else {
      response = `Thank you for your question about "${userInput}". As your AI advisor, I'm here to help clarify any aspects of your investment recommendations. Feel free to ask about risk levels, expected returns, investment amounts, or how to get started with any of the recommended investments.`;
    }

    const botMessage = {
      type: 'bot',
      message: response,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, botMessage]);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'conservative': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'aggressive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInvestmentTypeIcon = (type) => {
    switch (type) {
      case 'stocks': return '📈';
      case 'bonds': return '📊';
      case 'real_estate': return '🏠';
      case 'money_market': return '💰';
      case 'mutual_funds': return '🎯';
      case 'fixed_deposit': return '🏦';
      case 'business': return '💼';
      case 'agriculture': return '🌾';
      case 'digital_assets': return '💻';
      default: return '📋';
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

  const calculateTotalRecommendedAmount = () => {
    return recommendations.reduce((total, rec) => total + parseFloat(rec.recommended_amount || 0), 0);
  };

  const calculateProjectedReturns = () => {
    return recommendations.map(rec => ({
      ...rec,
      projectedReturn: (parseFloat(rec.recommended_amount) * parseFloat(rec.investment.expected_return)) / 100
    }));
  };

  // --- Step 1: Welcome Screen ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Welcome, {user?.full_name || user?.username}!
                </h2>
                <p className="text-sm text-secondary opacity-80">Ready to grow your wealth?</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-primary hover:text-green-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-20 rounded-full mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-primary mb-4">AI Risk Profiler</h1>
           
            <p className="text-lg text-gray-700 opacity-90 max-w-2xl mx-auto">
              Discover personalized investment opportunities powered by AI. 
              Get intelligent recommendations starting from as little as KSh 1,000.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[{
              icon: <TrendingUp className="w-12 h-12 text-primary" />,
              title: 'AI-Powered Recommendations',
              subtitle: 'Mapendekezo yanayoongozwa na AI',
              desc: 'Get personalized investment advice based on your unique financial profile and goals'
            }, {
              icon: <Shield className="w-12 h-12 text-blue-900" />,
              title: 'Risk Assessment',
              subtitle: 'Tathmini ya hatari ya kibinafsi',
              desc: 'Comprehensive risk analysis to match investments with your comfort level'
            }, {
              icon: <Target className="w-12 h-12 text-secondary" />,
              title: 'AI Chat Support',
              subtitle: 'Msaada wa AI baada ya mapendekezo',
              desc: 'Interactive AI chatbot to answer questions about your personalized recommendations'
            }].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gray-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 font-medium">{feature.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-primary text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Start Your AI-Powered Investment Journey?</h2>
              <p className="opacity-90">Take the first step towards smarter investing with our quick and easy AI assessment.</p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What you'll get:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3" />
                      <span>AI-generated personalized investment recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3" />
                      <span>Intelligent risk assessment and portfolio allocation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3" />
                      <span>Expected returns and timeline analysis</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3" />
                      <span>Interactive AI chatbot for instant answers</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Takes only 3-5 minutes to complete the AI assessment
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Start AI Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Step 2: Enhanced Questionnaire ---
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back - Rudi Nyuma
          </button>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="gradient-primary text-white p-6">
              <h1 className="text-3xl font-bold mb-2">AI Investment Profile Assessment</h1>
          
              <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(profile).filter(v => v).length / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Age (Umri) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="e.g., 25"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      validationErrors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    min="18"
                    max="100"
                  />
                  {validationErrors.age && (
                    <p className="text-sm text-red-600">{validationErrors.age}</p>
                  )}
                </div>

                {/* Monthly Income */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Monthly Income - KSh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={profile.monthly_income}
                    onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                    placeholder="e.g., 50,000"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      validationErrors.monthly_income ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    min="1000"
                  />
                  {validationErrors.monthly_income && (
                    <p className="text-sm text-red-600">{validationErrors.monthly_income}</p>
                  )}
                  <p className="text-sm text-gray-500">Kipato chako cha mwezi</p>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Available Investment Amount - KSh <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={profile.investment_amount}
                  onChange={(e) => handleInputChange('investment_amount', e.target.value)}
                  placeholder="e.g., 100,000"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    validationErrors.investment_amount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  min="1000"
                />
                {validationErrors.investment_amount && (
                  <p className="text-sm text-red-600">{validationErrors.investment_amount}</p>
                )}
                <p className="text-sm text-gray-500">Pesa unazoweza kuweka kwa uwekezaji sasa hivi</p>
              </div>

              {/* Risk Tolerance */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Risk Tolerance - Uvumilivu wa Hatari <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'conservative', label: 'Conservative - Makini', desc: 'Low risk, stable returns' },
                    { value: 'moderate', label: 'Moderate - Wastani', desc: 'Medium risk, balanced returns' },
                    { value: 'aggressive', label: 'Aggressive - Mkali', desc: 'High risk, high potential returns' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={option.value}
                        name="risk_tolerance"
                        value={option.value}
                        checked={profile.risk_tolerance === option.value}
                        onChange={(e) => handleInputChange('risk_tolerance', e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.desc}</div>
                      </label>
                    </div>
                  ))}
                </div>
                {validationErrors.risk_tolerance && (
                  <p className="text-sm text-red-600">{validationErrors.risk_tolerance}</p>
                )}
              </div>

              {/* Investment Timeline */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Investment Timeline - Muda wa Uwekezaji <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.investment_timeline}
                  onChange={(e) => handleInputChange('investment_timeline', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    validationErrors.investment_timeline ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your investment timeline</option>
                  <option value="6">6 months - 1 year - Short term (Muda mfupi)</option>
                  <option value="12">1 year - 5 years - Medium term (Muda wa wastani)</option>
                  <option value="24">5 years - 10 years - Long term (Muda mrefu)</option>
                  <option value="36">10 years - 20 years - Very long term (Muda mrefu sana)</option>
                  <option value="60">20+ years - Lifetime horizon (Maisha yote)</option>
                </select>
                {validationErrors.investment_timeline && (
                  <p className="text-sm text-red-600">{validationErrors.investment_timeline}</p>
                )}
              </div>

              {/* Financial Goals */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Financial Goals - Malengo ya Kifedha <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={profile.financial_goals}
                  onChange={(e) => handleInputChange('financial_goals', e.target.value)}
                  placeholder="e.g., Save for a house deposit, children's education, retirement, start a business..."
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    validationErrors.financial_goals ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  rows="4"
                />
                {validationErrors.financial_goals && (
                  <p className="text-sm text-red-600">{validationErrors.financial_goals}</p>
                )}
                <p className="text-sm text-gray-500">Eleza malengo yako ya kifedha kwa undani</p>
              </div>

              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gradient-primary text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      AI Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Get AI Recommendations
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Step 3: Enhanced Recommendations with AI Chatbot ---
  if (step === 3) {
    const totalRecommended = calculateTotalRecommendedAmount();
    const projectedReturns = calculateProjectedReturns();
    const totalProjectedReturn = projectedReturns.reduce((sum, item) => sum + item.projectedReturn, 0);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setStep(2)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Assessment
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your AI Investment Recommendations</h1>
            <p className="text-lg text-gray-600">Mapendekezo Yako ya Uwekezaji ya AI</p>
            <p className="text-sm text-primary font-medium mt-2">AI Profile Analysis Complete ✓</p>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Investment Profile Summary</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-gray-600">Investment Amount</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(profile.investment_amount)}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-600">Risk Level</p>
                <p className="text-xl font-bold text-blue-700 capitalize">{profile.risk_tolerance}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium text-gray-600">Timeline</p>
                <p className="text-xl font-bold text-purple-700">{profile.investment_timeline} months</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-medium text-gray-600">Projected Annual Return</p>
                <p className="text-xl font-bold text-orange-700">{formatCurrency(totalProjectedReturn)}</p>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">AI Portfolio Overview</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Recommended</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalRecommended)}</p>
                <p className="text-sm text-gray-500">
                  {((totalRecommended / profile.investment_amount) * 100).toFixed(1)}% of available funds
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Number of Investments</p>
                <p className="text-2xl font-bold text-slate-900">{recommendations.length}</p>
                <p className="text-sm text-gray-500">AI Diversified portfolio</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Expected Return</p>
                <p className="text-2xl font-bold text-orange-700">
                  {recommendations.length > 0 
                    ? (recommendations.reduce((sum, rec) => sum + parseFloat(rec.investment.expected_return), 0) / recommendations.length).toFixed(1)
                    : '0'
                  }%
                </p>
                <p className="text-sm text-gray-500">Annual percentage</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-6 mb-8">
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recommendations Available</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't generate recommendations at this time. Please try again or contact support.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{getInvestmentTypeIcon(rec.investment.type)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{rec.investment.name}</h3>
                          <p className="text-gray-500 capitalize">{rec.investment.type.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-400">{rec.investment.local_description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(rec.investment.risk_level)}`}>
                          {rec.investment.risk_level.toUpperCase()} RISK
                        </span>
                        {rec.confidence_score && (
                          <p className="text-sm text-gray-500 mt-1">
                            AI Confidence: {(rec.confidence_score * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Recommended Amount</p>
                        <p className="text-lg font-bold text-primary">
                          KSh {rec.recommended_amount?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Expected Return</p>
                        <p className="text-lg font-bold text-blue-600">
                          {rec.investment.expected_return}% p.a.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Min Investment</p>
                        <p className="text-lg font-bold text-gray-800">
                          KSh {rec.investment.min_investment?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Liquidity</p>
                        <p className="text-lg font-bold text-gray-800 capitalize">
                          {rec.investment.liquidity}
                        </p>
                      </div>
                    </div>

                    {rec.reasoning && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2">AI Analysis:</h4>
                        <p className="text-blue-800">{rec.reasoning}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          {rec.investment.risk_level} risk
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {rec.investment.expected_return}% return
                        </span>
                      </div>
                      <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center">
                        Invest Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Chatbot */}
          {showChatbot && (
            <div className={`fixed ${chatMinimized ? 'bottom-4 right-4 w-80 h-16' : 'bottom-4 right-4 w-96 h-96'} bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 z-50`}>
              {/* Chat Header */}
              <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold">AI Investment Advisor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChatMinimized(!chatMinimized)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {chatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setShowChatbot(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {!chatMinimized && (
                <>
                  {/* Chat Messages */}
                  <div 
                    ref={chatMessagesRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 h-64"
                  >
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {msg.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            {msg.type === 'user' && <UserIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 max-w-xs px-3 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4" />
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <p className="text-sm">AI is thinking...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your recommendations..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        disabled={chatLoading}
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Show chatbot button if hidden */}
          {!showChatbot && (
            <button
              onClick={() => setShowChatbot(true)}
              className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-colors z-50"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default RiskProfiler;