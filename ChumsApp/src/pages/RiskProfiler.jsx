import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, Shield, AlertTriangle, Target, User, Coins, Clock, Brain, Bot, Sparkles, MessageCircle, Lightbulb, TrendingDown, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { fetchWithAuth } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const RiskProfiler = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [riskProfile, setRiskProfile] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);

  // Questions for risk profiling
  const questions = [
    {
      id: 'age',
      title: 'What is your age group?',
      subtitle: 'Age affects your investment timeline and risk capacity',
      icon: <User className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 5, label: '18-25', desc: 'Young professional with long investment horizon'},
        {value: 4, label: '26-35', desc: 'Early career with growth potential'},
        {value: 3, label: '36-45', desc: 'Mid-career building wealth'},
        {value: 2, label: '46-55', desc: 'Pre-retirement planning'},
        {value: 1, label: '55+', desc: 'Near or in retirement'}
      ]
    },
    {
      id: 'income',
      title: 'What is your monthly income range?',
      subtitle: 'Income level determines your investment capacity',
      icon: <Coins className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: 'Below KSh 20,000', desc: 'Entry-level income'},
        {value: 2, label: 'KSh 20,000 - 50,000', desc: 'Lower-middle income'},
        {value: 3, label: 'KSh 50,000 - 100,000', desc: 'Middle income'},
        {value: 4, label: 'KSh 100,000 - 200,000', desc: 'Upper-middle income'},
        {value: 5, label: 'Above KSh 200,000', desc: 'High income'}
      ]
    },
    {
      id: 'experience',
      title: 'What is your investment experience?',
      subtitle: 'Experience level affects risk understanding',
      icon: <Brain className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: 'No experience', desc: 'New to investing'},
        {value: 2, label: 'Basic - savings accounts', desc: 'Basic savings experience'},
        {value: 3, label: 'Intermediate - stocks/bonds', desc: 'Some market experience'},
        {value: 4, label: 'Advanced - multiple assets', desc: 'Experienced across asset classes'},
        {value: 5, label: 'Expert level', desc: 'Professional or advanced investor'}
      ]
    },
    {
      id: 'timeline',
      title: 'When do you need your investment returns?',
      subtitle: 'Investment timeline affects risk tolerance',
      icon: <Clock className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: '1-2 years', desc: 'Very short-term goals'},
        {value: 2, label: '3-5 years', desc: 'Short-term goals'},
        {value: 3, label: '5-10 years', desc: 'Medium-term goals'},
        {value: 4, label: '10-20 years', desc: 'Long-term goals'},
        {value: 5, label: 'Over 20 years', desc: 'Very long-term goals'}
      ]
    },
    {
      id: 'goal',
      title: 'What is your primary investment goal?',
      subtitle: 'Your goal determines investment strategy',
      icon: <Target className='w-6 h-6' />,
      type: 'radio',
      options: [
        { value: 2, label: 'Preserve capital safely', desc: 'Capital preservation priority' },
        { value: 3, label: 'Generate regular income', desc: 'Steady income focus' },
        { value: 4, label: 'Grow wealth steadily', desc: 'Balanced growth approach' },
        { value: 5, label: 'Maximize growth potential', desc: 'Aggressive growth strategy' },
        { value: 1, label: 'Retirement planning', desc: 'Long-term retirement focus' }
      ]
    },
    {
      id: 'risk_tolerance',
      title: 'If your investment lost 20% in one year, what would you do?',
      subtitle: 'This measures your emotional risk tolerance',
      icon: <AlertTriangle className="w-6 h-6" />,
      type: 'radio',
      options: [
        { value: 1, label: 'Sell immediately', desc: 'Cannot handle volatility' },
        { value: 2, label: 'Sell some portion', desc: 'Reduce exposure' },
        { value: 3, label: 'Wait and monitor', desc: 'Cautious but patient' },
        { value: 4, label: 'Do nothing', desc: 'Stay the course' },
        { value: 5, label: 'Buy more', desc: 'See opportunity in downturns' }
      ]
    },
    {
      id: 'emergency_fund',
      title: 'How many months of emergency funds do you have?',
      subtitle: 'Emergency fund affects investment readiness',
      icon: <Shield className="w-6 h-6" />,
      type: 'radio',
      options: [
        { value: 1, label: 'None', desc: 'No emergency savings' },
        { value: 2, label: '1-2 months', desc: 'Minimal emergency fund' },
        { value: 3, label: '3-4 months', desc: 'Adequate emergency fund' },
        { value: 4, label: '5-6 months', desc: 'Good emergency fund' },
        { value: 5, label: '6+ months', desc: 'Excellent emergency fund' }
      ]
    }
  ];

  // AI-powered insights generation
  const generateAIInsights = async (profile, userResponses) => {
    setIsGeneratingInsights(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [];
    
    // Age-based insights
    if (userResponses.age >= 4) {
      insights.push({
        type: 'opportunity',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Time Advantage',
        message: `At your age, you have 20-30+ years to invest. This is your biggest advantage! Consider growth-oriented strategies to maximize compound returns.`,
        priority: 'high'
      });
    }
    
    // Income-based insights
    if (userResponses.income <= 2) {
      insights.push({
        type: 'strategy',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Smart Start Strategy',
        message: `Start with KSh 1,000-2,000 monthly. Consider low-minimum investments like M-Shwari, KCB Goal Saver, or money market funds.`,
        priority: 'high'
      });
    }
    
    // Experience-based insights
    if (userResponses.experience <= 2) {
      insights.push({
        type: 'education',
        icon: <Brain className="w-5 h-5" />,
        title: 'Learning Path Recommended',
        message: `Start with simple investments like money market funds. Use our Learning Hub to understand NSE basics and investment fundamentals.`,
        priority: 'medium'
      });
    }
    
    // Emergency fund insights
    if (userResponses.emergency_fund <= 2) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Emergency Fund Priority',
        message: `Build 3-6 months emergency fund first using high-yield savings before aggressive investing. This provides financial security.`,
        priority: 'critical'
      });
    }
    
    // Risk-specific insights
    if (profile.type === 'Conservative') {
      insights.push({
        type: 'recommendation',
        icon: <Shield className="w-5 h-5" />,
        title: 'Safe Growth Options',
        message: `Focus on Treasury Bills (minimum KSh 100,000), government bonds, and money market funds for stable returns with minimal risk.`,
        priority: 'medium'
      });
    } else if (profile.type === 'Aggressive') {
      insights.push({
        type: 'opportunity',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Growth Potential',
        message: `You can handle volatility! Consider growth stocks, equity funds, and even a small allocation to cryptocurrency (max 5% of portfolio).`,
        priority: 'medium'
      });
    }
    
    // Market-specific insights
    insights.push({
      type: 'market',
      icon: <TrendingDown className="w-5 h-5" />,
      title: 'NSE Opportunities',
      message: `Current NSE blue-chip stocks like Safaricom (SCOM), EABL, and KCB Group offer good value. Consider dollar-cost averaging.`,
      priority: 'low'
    });
    
    setAiInsights(insights);
    setIsGeneratingInsights(false);
  };

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Check for existing profile on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      checkExistingProfile();
    }
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/risk-profile/me/');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setExistingProfile(data);
          const convertedProfile = convertBackendProfile(data.profile, data.recommendations);
          setRiskProfile(convertedProfile);
        }
      }
    } catch (error) {
      console.error('Error checking existing profile:', error);
    }
  };

  const convertBackendProfile = (backendProfile, recommendations) => {
    const riskLevelMap = {
      'conservative': { type: 'Conservative', color: 'bg-green-500' },
      'moderate': { type: 'Moderate', color: 'bg-yellow-500' },
      'aggressive': { type: 'Aggressive', color: 'bg-red-500' }
    };
    
    const profile = riskLevelMap[backendProfile.risk_tolerance] || riskLevelMap.moderate;
    
    return {
      ...profile,
      score: 50,
      description: `You prefer ${backendProfile.risk_tolerance} investment strategies`,
      recommendations: recommendations.map(rec => rec.investment.name),
      backendRecommendations: recommendations,
      financialGoals: backendProfile.financial_goals,
      investmentAmount: backendProfile.investment_amount,
      monthlyIncome: backendProfile.monthly_income
    };
  };

  const calculateRiskProfile = async () => {
    if (!isAuthenticated()) {
      calculateLocalRiskProfile();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData = {
        age: getAgeFromResponse(responses.age),
        monthly_income: getIncomeFromResponse(responses.income),
        investment_amount: getInvestmentAmountFromResponse(responses.income),
        risk_tolerance: getRiskToleranceFromResponses(responses),
        investment_timeline: getTimelineFromResponse(responses.timeline),
        financial_goals: getGoalsFromResponse(responses.goal)
      };

      const url = existingProfile 
        ? 'http://127.0.0.1:8000/api/risk-profile/update/'
        : 'http://127.0.0.1:8000/api/risk-profile/';
      
      const method = existingProfile ? 'PUT' : 'POST';

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        const convertedProfile = convertBackendProfile(data.profile, data.recommendations);
        setRiskProfile(convertedProfile);
        generateAIInsights(convertedProfile, responses);
      } else {
        setError(data.error || 'Failed to create risk profile');
        calculateLocalRiskProfile();
      }
    } catch (error) {
      console.error('Error creating risk profile:', error);
      setError(error.message || 'An error occurred');
      calculateLocalRiskProfile();
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getAgeFromResponse = (ageValue) => {
    const ageMap = {5: 22, 4: 30, 3: 40, 2: 50, 1: 60};
    return ageMap[ageValue] || 30;
  };

  const getIncomeFromResponse = (incomeValue) => {
    const incomeMap = {1: 15000, 2: 35000, 3: 75000, 4: 150000, 5: 250000};
    return incomeMap[incomeValue] || 50000;
  };

  const getInvestmentAmountFromResponse = (incomeValue) => {
    const monthlyIncome = getIncomeFromResponse(incomeValue);
    return Math.round(monthlyIncome * 0.15);
  };

  const getRiskToleranceFromResponses = (responses) => {
    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 35) return 'conservative';
    if (percentage <= 65) return 'moderate';
    return 'aggressive';
  };

  const getTimelineFromResponse = (timelineValue) => {
    const timelineMap = {1: 12, 2: 36, 3: 84, 4: 180, 5: 240};
    return timelineMap[timelineValue] || 60;
  };

  const getGoalsFromResponse = (goalValue) => {
    const goalMap = {
      1: 'Retirement planning and long-term wealth preservation',
      2: 'Capital preservation with minimal risk',
      3: 'Regular income generation from investments',
      4: 'Steady growth with balanced risk',
      5: 'Aggressive growth and wealth accumulation'
    };
    return goalMap[goalValue] || 'General investment growth';
  };

  const calculateLocalRiskProfile = () => {
    const scores = Object.values(responses);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    let profile = {};
    
    if (percentage <= 30) {
      profile = {
        type: 'Conservative',
        score: percentage,
        description: 'You prefer safety and stability over high returns. Focus on capital preservation.',
        color: 'bg-green-500',
        recommendations: [
          'Treasury Bills (Government Bonds)',
          'Money Market Funds (CIC, Britam)',
          'Fixed Deposits (Banks)',
          'SACCO Savings'
        ]
      };
    } else if (percentage <= 50) {
      profile = {
        type: 'Moderate Conservative',
        score: percentage,
        description: 'You want some growth but with limited risk. Balanced approach preferred.',
        color: 'bg-blue-500',
        recommendations: [
          'Balanced Mutual Funds',
          'Corporate Bonds',
          'Blue-chip Stocks (SCOM, EABL)',
          'REITs (Fahari I-REIT)'
        ]
      };
    } else if (percentage <= 70) {
      profile = {
        type: 'Moderate',
        score: percentage,
        description: 'You balance risk and return for steady growth. Diversified portfolio suitable.',
        color: 'bg-yellow-500',
        recommendations: [
          'Equity Funds (Zimele, ICEA Lion)',
          'Mixed Asset Funds',
          'NSE Stocks (KCB, Equity, Co-op)',
          'Unit Trusts'
        ]
      };
    } else if (percentage <= 85) {
      profile = {
        type: 'Moderate Aggressive',
        score: percentage,
        description: 'You seek higher returns and accept higher risk. Growth-focused strategy.',
        color: 'bg-orange-500',
        recommendations: [
          'Growth Equity Funds',
          'Small-cap Stocks',
          'Technology Stocks',
          'Emerging Market Funds'
        ]
      };
    } else {
      profile = {
        type: 'Aggressive',
        score: percentage,
        description: 'You prioritize maximum growth despite high risk. High-growth investments suitable.',
        color: 'bg-red-500',
        recommendations: [
          'Growth Stocks (Tech, Banking)',
          'Sector-specific Funds',
          'International Markets',
          'Alternative Investments'
        ]
      };
    }

    setRiskProfile(profile);
    generateAIInsights(profile, responses);
  };

  const handleAIChat = async (message) => {
    if (!message.trim()) return;
    
    const userMsg = { type: 'user', message, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = generateAIResponse(message, riskProfile, responses);
    const aiMsg = { type: 'ai', message: aiResponse, timestamp: new Date() };
    
    setChatMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const generateAIResponse = (userMsg, profile, userResponses) => {
    const msg = userMsg.toLowerCase();
    
    if (msg.includes('safaricom') || msg.includes('scom')) {
      return "Safaricom (SCOM) is Kenya's largest telecom company and a blue-chip stock. It's currently trading around KSh 25-30 with consistent dividends. Good for moderate to aggressive portfolios. Consider buying on dips below KSh 25.";
    }
    
    if (msg.includes('start') || msg.includes('begin')) {
      return `Based on your ${profile.type} profile, I recommend starting with KSh 5,000-10,000. Open a CDS account first, then try money market funds. Start small and learn as you go!`;
    }
    
    if (msg.includes('emergency') || msg.includes('fund')) {
      return "Emergency funds should cover 3-6 months of expenses in easily accessible accounts. Try high-yield savings like M-Shwari Lock or KCB Goal Saver. Never invest emergency funds in volatile assets!";
    }
    
    if (msg.includes('nse') || msg.includes('stocks')) {
      return "NSE offers great opportunities! For beginners: Safaricom, EABL, KCB Group. For growth: Equity Group, Co-op Bank. Use platforms like Haba or CDSCs for trading. Always start with blue-chips!";
    }
    
    return `Great question! Based on your ${profile.type} profile, I'd recommend focusing on ${profile.recommendations[0]}. This aligns with your risk tolerance and investment goals. Would you like specific steps to get started?`;
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateRiskProfile();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setResponses({});
    setRiskProfile(null);
    setAiInsights([]);
    setChatMessages([]);
    setAiChatOpen(false);
  };

  const navigateToOpportunities = () => {
    navigate('/opportunities');
  };

  // Results view
  if (riskProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-4">Your Investment Risk Profile</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your responses, we've created a personalized investment profile with AI-powered recommendations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Results */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-primary p-8 mb-8">
                  {/* Profile Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full text-white mb-4">
                      <TrendingUp className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-2">{riskProfile.type}</h2>
                    <p className="text-gray-600 mb-4">{riskProfile.description}</p>
                    
                    {/* Risk Score Bar */}
                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${riskProfile.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">Risk Score: {riskProfile.score.toFixed(1)}%</p>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-6">Recommended Investments</h3>
                    {riskProfile.backendRecommendations ? (
                      <div className="grid gap-4">
                        {riskProfile.backendRecommendations.map((rec, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-lg font-semibold text-primary">{rec.investment.name}</h4>
                              <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {rec.investment.expected_return}% p.a.
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{rec.investment.description}</p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Recommended Amount: </span>
                                <span className="font-semibold text-primary">
                                  KSh {parseFloat(rec.recommended_amount).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Minimum Investment: </span>
                                <span className="font-semibold">
                                  KSh {parseFloat(rec.investment.minimum_amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {rec.ai_rationale && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <strong className="text-primary">AI Insight:</strong> {rec.ai_rationale}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {riskProfile.recommendations.map((rec, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-700 font-medium">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Next Steps */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-4">Next Steps</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <BookOpen className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold text-primary mb-2">Learn More</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Expand your investment knowledge with our educational resources.
                        </p>
                        <Link 
                          to="/learning-hub"
                          className="text-primary hover:text-blue-900 font-medium flex items-center"
                        >
                          Visit Learning Hub <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-6">
                        <Target className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold text-primary mb-2">Explore Opportunities</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Browse investment opportunities that match your risk profile.
                        </p>
                        <button 
                          onClick={navigateToOpportunities}
                          className="text-primary hover:text-blue-900 font-medium flex items-center"
                        >
                          View Opportunities <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={restart}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Retake Assessment
                    </button>
                    <button
                      onClick={navigateToOpportunities}
                      className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center"
                    >
                      View Investment Opportunities <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Insights Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-primary p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <Bot className="w-6 h-6 text-primary mr-2" />
                    <h3 className="text-xl font-bold text-primary">AI Insights</h3>
                    <Sparkles className="w-5 h-5 text-blue-900 ml-2" />
                  </div>

                  {isGeneratingInsights ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing your profile...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiInsights.map((insight, index) => {
                        const priorityColors = {
                          critical: 'border-red-500 bg-red-50',
                          high: 'border-orange-500 bg-orange-50',
                          medium: 'border-blue-500 bg-blue-50',
                          low: 'border-gray-500 bg-gray-50'
                        };
                        
                        return (
                          <div
                            key={index}
                            className={`border-l-4 p-4 rounded-r-lg ${priorityColors[insight.priority] || priorityColors.medium}`}
                          >
                            <div className="flex items-start">
                              <div className="text-primary mr-3 mt-1">
                                {insight.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-primary mb-1">{insight.title}</h4>
                                <p className="text-gray-600 text-sm">{insight.message}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* AI Chat */}
                <div className="bg-white rounded-xl shadow-primary overflow-hidden">
                  <div
                    onClick={() => setAiChatOpen(!aiChatOpen)}
                    className="bg-primary text-white p-4 cursor-pointer hover:bg-blue-900 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Ask AI Advisor</span>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transform transition-transform ${aiChatOpen ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>

                  {aiChatOpen && (
                    <div className="p-4">
                      <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-3">
                        {chatMessages.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="mb-2">Ask me anything about investing!</p>
                            <p className="text-xs">Try: "How do I start?", "Tell me about NSE", "What's my next step?"</p>
                          </div>
                        )}

                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                          >
                            <div
                              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                msg.type === 'user'
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAIChat(userMessage)}
                          placeholder="Ask about investments..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          onClick={() => handleAIChat(userMessage)}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question view
  const currentQuestion = questions[currentStep];
  const isAnswered = responses[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-primary overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">AI-Powered Risk Profiler</h1>
                  <p className="text-blue-200">Discover your personalized investment strategy</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Bot className="w-6 h-6" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-blue-200 text-sm mt-2">
                Question {currentStep + 1} of {questions.length}
              </p>
            </div>

            {/* Question Content */}
            <div className="p-8">
              {/* Authentication note */}
              {!isAuthenticated() && currentStep === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> You're using the risk profiler as a guest. 
                    <Link to="/auth" className="text-primary font-medium ml-1 hover:underline">
                      Sign in
                    </Link> to save your profile and get AI-powered investment recommendations.
                  </p>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}

              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  {currentQuestion.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-1">
                    {currentQuestion.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {currentQuestion.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleResponse(currentQuestion.id, option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      responses[currentQuestion.id] === option.value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          responses[currentQuestion.id] === option.value
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {responses[currentQuestion.id] === option.value && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 bg-gray-50 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={!isAnswered || loading}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                  isAnswered && !loading
                    ? 'bg-primary text-white hover:bg-blue-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === questions.length - 1 ? 'Get AI Results' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskProfiler;