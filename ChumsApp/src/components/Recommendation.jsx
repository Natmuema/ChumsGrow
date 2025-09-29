import {React, useState} from 'react'
import { ChevronRight, ChevronLeft, TrendingUp, Shield, AlertTriangle, Target, User, Coins, Clock, Brain, Bot, Sparkles, MessageCircle, Lightbulb, TrendingDown } from 'lucide-react';



const Recommendation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [riskProfile, setRiskProfile] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
 

  {/*Questions */}
  const questions = [
    {
      id:'age',
      title: 'Umri wako ni ngapi?',
      subtitle: 'What is your age?',
      icon: <User className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 5, label: '18-25', desc: 'Young professional'},
        {value: 4, label: '26-35', desc: 'Early career'},
        {value: 3, label: '36-45', desc: 'Mid-career'},
        {value: 2, label: '46-55', desc: 'Pre-retirement'},
        {value: 1, label: '55+', desc: 'Near/in retirement'}
      ]
    },

    {
      id: 'income',
      title: 'Mapato yako ya kila mwezi ni kiasi gani?',
      subtitle: 'What is your monthly income?',
      icon: <Coins className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: 'Chini ya Ksh 20,000', desc: 'Entry-level income'},
        {value: 2, label: 'Ksh 20,000 - Ksh 50,000', desc: 'Lower-middle income'},
        {value: 3, label: 'Ksh 50,000 - Ksh 100,000', desc: 'Middle income'},
        {value: 4, label: 'Ksh 100,000 - Ksh 200,000', desc: 'Upper-middle income'},
        {value: 5, label: 'Zaidi ya Ksh 200,000', desc: 'High income'}
      ]
    },

    {
      id: 'experience',
      title: 'Una uzoefu gani katika uwekezaji?',
      subtitle: 'What is your investment experience?',
      icon: <Brain className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: 'Hakuna uzoefu', desc: 'No investment experience'},
        {value: 2, label: 'Msingi - nimewahi weka fedha kwa benki', desc: 'Basic savings experience'},
        {value: 3, label: 'Kawaida - nimewahi nunua shares', desc: 'Some experience with stocks/bonds'},
        {value: 4, label: 'Mtaalamu - naelewa masoko', desc: 'Experienced in multiple asset classes'},
        {value: 5, label: 'Mtaalamu wa juu', desc: 'Professional investor or advisor'}
      ]
    },

    {
      id: 'timeline',
      title: 'Unapanga kuwekeza kwa muda gani?',
      subtitle: 'When do you want to achieve your investment goals?',
      icon: <Clock className='w-6 h-6' />,
      type: 'radio',
      options: [
        {value: 1, label: 'Mwaka 1 hadi 2', desc: 'Very short-term goals'},
        {value: 2, label: 'Mwaka 3 hadi 5', desc: 'Short-term goals'},
        {value: 3, label: 'Mwaka 5 hadi 10', desc: 'Medium-term goals'},
        {value: 4, label: 'Miaka 10 hadi 20', desc: 'Long-term goals'},
        {value: 5, label: 'Zaidi ya Mwaka 20', desc: 'Very long-term goals'}
      ]
    },

    {
      id: 'goal',
      title: 'Lengo lako kuu la uwekezaji ni nini?',
      subtitle: 'What is your primary investment goal?',
      icon: <Target className='w-6 h-6' />,
      type: 'radio',
       options: [
        { value: 2, label: 'Kuokoa fedha kwa usalama', desc: 'Capital preservation' },
        { value: 3, label: 'Kupata kipato kidogo', desc: 'Regular income' },
        { value: 4, label: 'Kuongeza mali polepole', desc: 'Steady growth' },
        { value: 5, label: 'Kuongeza mali haraka', desc: 'Aggressive growth' },
        { value: 1, label: 'Kuandaa staafu', desc: 'Retirement planning' }
      ]
    },

     {
      id: 'risk_tolerance',
      title: 'Uwekezaji wako ukipoteza 20% ya thamani mwaka mmoja, utafanya nini?',
      subtitle: 'If your investment loses 20% in one year, what would you do?',
      icon: <AlertTriangle className="w-6 h-6" />,
      type: 'radio',
      options: [
        { value: 1, label: 'Nitauza mara moja', desc: 'Sell immediately' },
        { value: 2, label: 'Nitauza sehemu', desc: 'Sell some portion' },
        { value: 3, label: 'Nitasubiri hali ibadilike', desc: 'Wait and see' },
        { value: 4, label: 'Sitafanya kitu', desc: 'Do nothing' },
        { value: 5, label: 'Nitaongeza uwekezaji', desc: 'Invest more' }
      ]
    },

    {
      id: 'emergency_fund',
      title: 'Una akiba ya dharura ya miezi mingapi?',
      subtitle: 'How many months of emergency funds do you have?',
      icon: <Shield className="w-6 h-6" />,
      type: 'radio',
      options: [
        { value: 1, label: 'Hakuna', desc: 'No emergency fund' },
        { value: 2, label: 'Mwezi 1-2', desc: '1-2 months' },
        { value: 3, label: 'Miezi 3-4', desc: '3-4 months' },
        { value: 4, label: 'Miezi 5-6', desc: '5-6 months' },
        { value: 5, label: 'Zaidi ya miezi 6', desc: '6+ months' }
      ]
    }
  ]

{/*OpenAI Integration */}
    // AI-powered insights generation
  const generateAIInsights = async (profile, userResponses) => {
    setIsGeneratingInsights(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [];
    
    // Analyze user profile and generate personalized insights
    const ageGroup = getAgeGroup(userResponses.age);
    const incomeLevel = getIncomeLevel(userResponses.income);
    const experienceLevel = getExperienceLevel(userResponses.experience);
    
    // Age-based insights
    if (userResponses.age >= 4) {
      insights.push({
        type: 'opportunity',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Time Advantage',
        message: `At your age, you have 20-30+ years to invest. This is your biggest advantage! Consider aggressive growth strategies.`,
        swahili: 'Umri wako ni faida kubwa - una muda mrefu wa kuwekezaji!'
      });
    }
    
    // Income-based insights
    if (userResponses.income <= 2) {
      insights.push({
        type: 'strategy',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Smart Start Strategy',
        message: `Start with Ksh 1,000-2,000 monthly. Consider M-Shwari, KCB Goal Saver, or Equity Afia for low-minimum investments.`,
        swahili: 'Anza kidogo lakini kwa uongozi - hata Ksh 1,000 inaweza kuongoza!'
      });
    }
    
    // Experience-based insights
    if (userResponses.experience <= 2) {
      insights.push({
        type: 'education',
        icon: <Brain className="w-5 h-5" />,
        title: 'Learning Path',
        message: `Start with simple investments like money market funds. Learn about NSE through apps like Haba or CDSCs.`,
        swahili: 'Jifunze kwanza - tumia apps kama Haba kupata elimu ya masoko!'
      });
    }
    
    // Emergency fund insights
    if (userResponses.emergency_fund <= 2) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Emergency Fund Priority',
        message: `Build 3-6 months emergency fund first using high-yield savings like M-Shwari Lock Savings before investing.`,
        swahili: 'Weka akiba ya dharura kwanza kabla ya kuwekezaji - ni muhimu sana!'
      });
    }
    
    // Risk-specific insights
    if (profile.type === 'Conservative') {
      insights.push({
        type: 'recommendation',
        icon: <Shield className="w-5 h-5" />,
        title: 'Safe Growth Options',
        message: `Consider Treasury Bills (minimum Ksh 100,000) or Money Market Funds like CIC or Britam for safer returns.`,
        swahili: 'Chagua njia za usalama - Treasury Bills au Money Market Funds!'
      });
    } else if (profile.type === 'Aggressive') {
      insights.push({
        type: 'opportunity',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Growth Potential',
        message: `You can handle volatility! Consider tech stocks, growth funds, or even cryptocurrency (max 5% of portfolio).`,
        swahili: 'Unaweza kushinda hatari - fikiria stocks za teknolojia!'
      });
    }
    
    // Market-specific insights
    insights.push({
      type: 'market',
      icon: <TrendingDown className="w-5 h-5" />,
      title: 'NSE Opportunity',
      message: `NSE is currently undervalued. Consider blue-chip stocks like Safaricom (SCOM), EABL, or KCB Group.`,
      swahili: 'NSE ina fursa sasa - angalia Safaricom, EABL, au KCB!'
    });
    
    setAiInsights(insights);
    setIsGeneratingInsights(false);
  };

  const getAgeGroup = (ageValue) => {
    const ageMap = {5: '18-25', 4: '26-35', 3: '36-45', 2: '46-55', 1: '55+'};
    return ageMap[ageValue] || 'Unknown';
  };

  const getIncomeLevel = (incomeValue) => {
    const incomeMap = {1: 'Low', 2: 'Lower-Mid', 3: 'Middle', 4: 'Upper-Mid', 5: 'High'};
    return incomeMap[incomeValue] || 'Unknown';
  };

  const getExperienceLevel = (expValue) => {
    const expMap = {1: 'Beginner', 2: 'Basic', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert'};
    return expMap[expValue] || 'Unknown';
  };

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateRiskProfile = () => {
    const scores = Object.values(responses);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    let profile = {};
    
    if (percentage <= 30) {
      profile = {
        type: 'Conservative',
        swahili: 'Mwenye Tahadhari',
        score: percentage,
        description: 'You prefer safety and stability over high returns',
        swahiliDesc: 'Unapendelea usalama na uthabiti kuliko faida kubwa',
        color: 'bg-green-500',
        recommendations: [
          'Government bonds (Treasury bills)',
          'Money Market Funds (CIC, Britam)',
          'Fixed deposits (KCB, Equity)',
          'Sacco savings (Kenya Police, Stima)'
        ]
      };
    } else if (percentage <= 50) {
      profile = {
        type: 'Moderate Conservative',
        swahili: 'Mwenye Tahadhari Kiasi',
        score: percentage,
        description: 'You want some growth but with limited risk',
        swahiliDesc: 'Unataka ukuaji lakini kwa hatari ndogo',
        color: 'bg-blue-500',
        recommendations: [
          'Balanced funds (Old Mutual, CIC)',
          'Corporate bonds (Safaricom, KCB)',
          'Blue-chip stocks (SCOM, EABL)',
          'REITs (Fahari I-REIT)'
        ]
      };
    } else if (percentage <= 70) {
      profile = {
        type: 'Moderate',
        swahili: 'Mwenye Uwiano',
        score: percentage,
        description: 'You balance risk and return for steady growth',
        swahiliDesc: 'Unaweza uwiano wa hatari na faida kwa ukuaji',
        color: 'bg-yellow-500',
        recommendations: [
          'Equity funds (Zimele, ICEA Lion)',
          'Mixed asset funds (Cytonn, Britam)',
          'NSE stocks (KCB, Equity, Co-op)',
          'Unit trusts (CIC, Old Mutual)'
        ]
      };
    } else if (percentage <= 85) {
      profile = {
        type: 'Moderate Aggressive',
        swahili: 'Mwenye Ujasiri Kiasi',
        score: percentage,
        description: 'You seek higher returns and accept higher risk',
        swahiliDesc: 'Unataka faida kubwa na unakubali hatari kubwa',
        color: 'bg-orange-500',
        recommendations: [
          'Growth equity funds (Zimele Equity)',
          'Small-cap stocks (Kurwitu, WPP)',
          'Tech stocks (Safaricom, Sanlam)',
          'Emerging market funds'
        ]
      };
    } else {
      profile = {
        type: 'Aggressive',
        swahili: 'Mwenye Ujasiri Mkuu',
        score: percentage,
        description: 'You prioritize maximum growth despite high risk',
        swahiliDesc: 'Unataka ukuaji mkubwa licha ya hatari kubwa',
        color: 'bg-red-500',
        recommendations: [
          'Growth stocks (Tech, Banking)',
          'Sector-specific funds',
          'International markets (EGX, JSE)',
          'Cryptocurrency (max 5% portfolio)'
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
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = generateAIResponse(message, riskProfile, responses);
    const aiMsg = { type: 'ai', message: aiResponse, timestamp: new Date() };
    
    setChatMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const generateAIResponse = (userMsg, profile, userResponses) => {
    const msg = userMsg.toLowerCase();
    
    if (msg.includes('safaricom') || msg.includes('scom')) {
      return "Safaricom (SCOM) is Kenya's largest telecom and fintech company. It's a blue-chip stock with consistent dividends. Current trading around Ksh 25-30. Good for moderate to aggressive portfolios. Consider buying on dips below Ksh 25.";
    }
    
    if (msg.includes('start') || msg.includes('begin')) {
      return `Based on your ${profile.swahili} profile, start with Ksh 5,000-10,000. I recommend opening a CDS account first, then try Money Market Funds like CIC or Britam. Start small and learn!`;
    }
    
    if (msg.includes('emergency') || msg.includes('dharura')) {
      return "Emergency funds should be 3-6 months of expenses in easily accessible accounts. Try M-Shwari Lock Savings, KCB Goal Saver, or Equity Eazzy Banking. Don't invest emergency funds in volatile assets!";
    }
    
    if (msg.includes('nse') || msg.includes('stocks')) {
      return "NSE has great opportunities! For beginners: Safaricom, EABL, KCB Group. For growth: Equity Group, Co-op Bank. Use apps like Haba or CDSCs for easy trading. Start with blue-chips!";
    }
    
    if (msg.includes('risk') || msg.includes('hatari')) {
      return `Your risk profile shows you're ${profile.type}. This means you should focus on ${profile.recommendations[0]} and ${profile.recommendations[1]}. Remember: higher risk = higher potential returns, but also higher potential losses!`;
    }
    
    return `Great question! Based on your ${profile.swahili} profile and ${getIncomeLevel(userResponses.income)} income level, I'd recommend focusing on ${profile.recommendations[0]}. Would you like specific steps to get started?`;
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

  if (riskProfile) {
    return (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Results */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white mb-4">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {riskProfile.swahili}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {riskProfile.type}
              </p>
              <div className="bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="h-4 rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${riskProfile.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                Risk Score: {riskProfile.score.toFixed(1)}%
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profile Description
              </h3>
              <p className="text-gray-700 mb-2">{riskProfile.description}</p>
              <p className="text-gray-500 italic">{riskProfile.swahiliDesc}</p>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Investments
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {riskProfile.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-primary transition-colors"
                  >
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Next Steps
              </h3>
              <ul className="text-sm text-gray-700 list-disc pl-6 space-y-1">
                <li>Start with Ksh 5,000 minimum investment</li>
                <li>Open CDS account for NSE trading</li>
                <li>Download investment apps (Haba, M-Shwari)</li>
                <li>Build emergency fund first</li>
                <li>Diversify across multiple asset classes</li>
              </ul>
            </div>

            <button
              onClick={restart}
              className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Take Assessment Again
            </button>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          {/*Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Bot className="w-6 h-6 text-secondary mr-2" />
              <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
              <Sparkles className="w-4 h-4 text-accent ml-2" />
            </div>

            {isGeneratingInsights ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-2"></div>
                <p className="text-gray-500">Analyzing your profile...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary bg-gray-50 p-4 rounded-r-lg"
                  >
                    <div className="flex">
                      <div className="text-primary mr-3">
                        {insight.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-700 mb-1">{insight.message}</p>
                        <p className="text-xs text-gray-500 italic">
                          {insight.swahili}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Chat */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div
              onClick={() => setAiChatOpen(!aiChatOpen)}
              className="bg-gradient-to-r from-secondary to-accent text-white p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Ask AI Advisor</span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    aiChatOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            {aiChatOpen && (
              <div className="p-4">
                <div className="h-64 overflow-y-auto mb-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">Ask me anything about investing in Kenya!</p>
                      <p className="text-sm mt-1">Try: "How do I start?", "Tell me about Safaricom", "What's my risk?"</p>
                    </div>
                  )}

                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex mb-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.type === "user"
                            ? "bg-secondary text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
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
                    onKeyPress={(e) => e.key === "Enter" && handleAIChat(userMessage)}
                    placeholder="Ask about investments..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAIChat(userMessage)}
                    className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-lg transition-colors"
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
 );
}

  const currentQuestion = questions[currentStep];
  const isAnswered = responses[currentQuestion.id] !== undefined;



 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl shadow-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-accent text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
             Investment Risk Profiler
              </h1>
           
            </div>
            <div className="rounded-full p-3 bg-white bg-opacity-20">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="rounded-full h-2 bg-white bg-opacity-20">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-white"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 text-white text-opacity-80">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="rounded-full p-3 mr-4 bg-accent bg-opacity-10">
              <div className="text-accent">{currentQuestion.icon}</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-900">
                {currentQuestion.subtitle}
              </h2>
              <p className="text-sm text-gray-500">
                {currentQuestion.title}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  handleResponse(currentQuestion.id, option.value)
                }
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  responses[currentQuestion.id] === option.value
                    ? "border-primary bg-primary bg-opacity-5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">
                      {option.desc}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      responses[currentQuestion.id] === option.value
                        ? "border-primary bg-primary"
                        : "border-gray-300"
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
        <div className="p-6 flex justify-between bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!isAnswered}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              isAnswered
                ? "bg-primary text-white hover:bg-secondary"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === questions.length - 1
              ? "Get Results"
              : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default Recommendation