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
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, var(--color-background-light), var(--color-background))",
      padding: "1rem",
    }}
  >
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        {/* Main Results */}
        <div style={{ gridColumn: "span 2" }}>
          <div
            style={{
              backgroundColor: "var(--color-background)",
              borderRadius: "1rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "50%",
                  backgroundColor: `var(${riskProfile.color})`,
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                <TrendingUp style={{ width: "2.5rem", height: "2.5rem" }} />
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-text-dark)", marginBottom: "0.5rem" }}>
                {riskProfile.swahili}
              </h1>
              <p style={{ fontSize: "1.25rem", color: "var(--color-text-light)", marginBottom: "1rem" }}>
                {riskProfile.type}
              </p>
              <div
                style={{
                  backgroundColor: "var(--color-background-light)",
                  borderRadius: "9999px",
                  height: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    height: "1rem",
                    borderRadius: "9999px",
                    backgroundColor: `var(${riskProfile.color})`,
                    width: `${riskProfile.score}%`,
                    transition: "width 1s ease",
                  }}
                ></div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)" }}>
                Risk Score: {riskProfile.score.toFixed(1)}%
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "0.5rem" }}>
                Profile Description
              </h3>
              <p style={{ color: "var(--color-text)" }}>{riskProfile.description}</p>
              <p style={{ color: "var(--color-text-light)", fontStyle: "italic" }}>{riskProfile.swahiliDesc}</p>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "600", color: "var(--color-text-dark)", marginBottom: "1rem" }}>
                Recommended Investments
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {riskProfile.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "var(--color-background-light)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "600", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                Next Steps
              </h3>
              <ul style={{ fontSize: "0.875rem", color: "var(--color-primary-text)", listStyleType: "disc", paddingLeft: "1.5rem" }}>
                <li>Start with Ksh 5,000 minimum investment</li>
                <li>Open CDS account for NSE trading</li>
                <li>Download investment apps (Haba, M-Shwari)</li>
                <li>Build emergency fund first</li>
                <li>Diversify across multiple asset classes</li>
              </ul>
            </div>

            <button
              onClick={restart}
              style={{
                width: "100%",
                backgroundColor: "var(--color-success)",
                color: "white",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Take Assessment Again
            </button>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/*Insights */}
          <div
            style={{
              backgroundColor: "var(--color-background)",
              borderRadius: "1rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <Bot style={{ width: "1.5rem", height: "1.5rem", color: "var(--color-secondary)", marginRight: "0.5rem" }} />
              <h3 style={{ fontWeight: "bold", color: "var(--color-text-dark)" }}>Insights</h3>
              <Sparkles style={{ width: "1rem", height: "1rem", color: "var(--color-accent)", marginLeft: "0.5rem" }} />
            </div>

            {isGeneratingInsights ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div
                  style={{
                    border: "4px solid var(--color-secondary)",
                    borderRadius: "50%",
                    width: "2rem",
                    height: "2rem",
                    borderBottomColor: "transparent",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto",
                  }}
                ></div>
                <span style={{ color: "var(--color-text-light)", marginTop: "0.5rem", display: "block" }}>
                  Analyzing your profile...
                </span>
              </div>
            ) : (
              <div>
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      borderLeft: `4px solid var(--color-${insight.type})`,
                      backgroundColor: `var(--color-${insight.type}-light)`,
                      padding: "1rem",
                      borderRadius: "0 0.5rem 0.5rem 0",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div style={{ color: `var(--color-${insight.type})`, marginRight: "0.75rem" }}>
                        {insight.icon}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: "600", color: "var(--color-text-dark)" }}>{insight.title}</h4>
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text)" }}>{insight.message}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", fontStyle: "italic" }}>
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
          <div
            style={{
              backgroundColor: "var(--color-background)",
              borderRadius: "1rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setAiChatOpen(!aiChatOpen)}
              style={{
                background: "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                color: "white",
                padding: "1rem",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MessageCircle style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
                  <span>Ask AI Advisor</span>
                </div>
                <ChevronRight
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    transform: aiChatOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            </div>

            {aiChatOpen && (
              <div style={{ padding: "1rem" }}>
                <div style={{ height: "16rem", overflowY: "auto", marginBottom: "1rem" }}>
                  {chatMessages.length === 0 && (
                    <div style={{ textAlign: "center", color: "var(--color-text-light)", padding: "2rem" }}>
                      <Bot style={{ width: "3rem", height: "3rem", margin: "0 auto", color: "var(--color-text-light)" }} />
                      <p>Ask me anything about investing in Kenya!</p>
                      <p style={{ fontSize: "0.875rem" }}>Try: "How do I start?", "Tell me about Safaricom", "What's my risk?"</p>
                    </div>
                  )}

                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: msg.type === "user" ? "var(--color-secondary)" : "var(--color-background-light)",
                          color: msg.type === "user" ? "white" : "var(--color-text-dark)",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          maxWidth: "16rem",
                        }}
                      >
                        <p style={{ fontSize: "0.875rem" }}>{msg.message}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div
                        style={{
                          backgroundColor: "var(--color-background-light)",
                          color: "var(--color-text-dark)",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <div style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "var(--color-text-light)", borderRadius: "50%", animation: "bounce 0.6s infinite alternate" }}></div>
                          <div style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "var(--color-text-light)", borderRadius: "50%", animation: "bounce 0.6s infinite alternate 0.2s" }}></div>
                          <div style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "var(--color-text-light)", borderRadius: "50%", animation: "bounce 0.6s infinite alternate 0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAIChat(userMessage)}
                    placeholder="Ask about investments..."
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <button
                    onClick={() => handleAIChat(userMessage)}
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                    }}
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
  <div
    className="min-h-screen p-4"
    style={{
      background: "linear-gradient(to bottom right, var(--color-background), var(--color-accent))",
    }}
  >
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        {/* Header */}
        <div
          className="p-6"
          style={{
            background: "linear-gradient(to right, var(--color-primary), var(--color-accent))",
            color: "white",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
             Investment Risk Profiler
              </h1>
           
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="rounded-full h-2"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
                backgroundColor: "white",
              }}
            ></div>
          </div>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-light)" }}
          >
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div
              className="rounded-full p-3 mr-4"
              style={{ backgroundColor: "var(--color-accent)", opacity: 0.1 }}
            >
              {currentQuestion.icon}
            </div>
            <div>
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "var(--color-text-dark)" }}
              >
                {currentQuestion.subtitle}
              </h2>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-light)" }}
              >
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
                className="w-full text-left p-4 rounded-lg border-2 transition-all"
                style={{
                  borderColor:
                    responses[currentQuestion.id] === option.value
                      ? "var(--color-primary)"
                      : "var(--color-background)",
                  backgroundColor:
                    responses[currentQuestion.id] === option.value
                      ? "rgba(30, 58, 138, 0.05)"
                      : "transparent",
                  color: "var(--color-text-dark)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      {option.desc}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{
                      borderColor:
                        responses[currentQuestion.id] === option.value
                          ? "var(--color-primary)"
                          : "var(--color-text-light)",
                      backgroundColor:
                        responses[currentQuestion.id] === option.value
                          ? "var(--color-primary)"
                          : "transparent",
                    }}
                  >
                    {responses[currentQuestion.id] === option.value && (
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor: "white",
                          transform: "scale(0.5)",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div
          className="p-6 flex justify-between"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor:
                currentStep === 0 ? "#E5E7EB" : "var(--color-background)",
              color:
                currentStep === 0
                  ? "var(--color-text-light)"
                  : "var(--color-text-dark)",
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!isAnswered}
            className="flex items-center px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: isAnswered
                ? "var(--color-primary)"
                : "#E5E7EB",
              color: isAnswered ? "white" : "var(--color-text-light)",
              cursor: isAnswered ? "pointer" : "not-allowed",
            }}
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