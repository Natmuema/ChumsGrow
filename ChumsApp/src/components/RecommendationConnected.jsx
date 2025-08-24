import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, Shield, AlertTriangle, Target, User, Coins, Clock, Brain, Bot, Sparkles, MessageCircle, Lightbulb, TrendingDown, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const RecommendationConnected = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [riskProfile, setRiskProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const questions = [
    {
      id: 'age',
      title: 'Umri wako ni ngapi?',
      subtitle: 'What is your age?',
      icon: <User className='w-6 h-6' />,
      type: 'number',
      placeholder: 'e.g., 25',
      min: 18,
      max: 100
    },
    {
      id: 'monthly_income',
      title: 'Mapato yako ya kila mwezi ni kiasi gani?',
      subtitle: 'What is your monthly income (KSh)?',
      icon: <Coins className='w-6 h-6' />,
      type: 'number',
      placeholder: 'e.g., 50000',
      min: 0
    },
    {
      id: 'investment_amount',
      title: 'Una pesa ngapi unayotaka kuwekeza?',
      subtitle: 'How much money do you want to invest (KSh)?',
      icon: <TrendingUp className='w-6 h-6' />,
      type: 'number',
      placeholder: 'e.g., 10000',
      min: 1000
    },
    {
      id: 'risk_tolerance',
      title: 'Unapendelea aina gani ya uwekezaji?',
      subtitle: 'What type of investment do you prefer?',
      icon: <AlertTriangle className="w-6 h-6" />,
      type: 'radio',
      options: [
        { value: 'conservative', label: 'Usalama mkuu - Hatari kidogo', desc: 'Conservative - Low risk' },
        { value: 'moderate', label: 'Uwiano - Hatari ya wastani', desc: 'Moderate - Medium risk' },
        { value: 'aggressive', label: 'Ukuaji mkuu - Hatari kubwa', desc: 'Aggressive - High risk' }
      ]
    },
    {
      id: 'investment_timeline',
      title: 'Unapanga kuwekeza kwa muda gani?',
      subtitle: 'How long do you plan to invest (months)?',
      icon: <Clock className='w-6 h-6' />,
      type: 'number',
      placeholder: 'e.g., 12 (for 1 year)',
      min: 1
    },
    {
      id: 'financial_goals',
      title: 'Malengo yako ya kifedha ni nini?',
      subtitle: 'What are your financial goals?',
      icon: <Target className='w-6 h-6' />,
      type: 'textarea',
      placeholder: 'e.g., Save for education, buy a house, retirement...'
    }
  ];

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitRiskProfile();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitRiskProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get JWT token from localStorage (assuming user is logged in)
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Please log in to create a risk profile');
      }

      const response = await fetch(`${API_BASE_URL}/risk-profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create risk profile');
      }

      setRiskProfile(data.profile);
      setRecommendations(data.recommendations || []);
      
    } catch (err) {
      setError(err.message);
      console.error('Error creating risk profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setFormData({});
    setRiskProfile(null);
    setRecommendations([]);
    setError(null);
  };

  // Show results page
  if (riskProfile) {
    return (
      <div className="min-h-screen p-4" style={{
        background: "linear-gradient(to bottom right, var(--color-background-light), var(--color-background))"
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white mb-4">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Your Investment Profile
              </h1>
              <p className="text-gray-600">
                Risk Tolerance: <span className="font-semibold capitalize">{riskProfile.risk_tolerance}</span>
              </p>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Profile Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Age:</span> {riskProfile.age} years</p>
                  <p><span className="font-medium">Monthly Income:</span> KSh {parseFloat(riskProfile.monthly_income).toLocaleString()}</p>
                  <p><span className="font-medium">Investment Amount:</span> KSh {parseFloat(riskProfile.investment_amount).toLocaleString()}</p>
                  <p><span className="font-medium">Timeline:</span> {riskProfile.investment_timeline} months</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Financial Goals</h3>
                <p className="text-sm text-gray-700">{riskProfile.financial_goals}</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Bot className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">AI-Generated Recommendations</h2>
                <Sparkles className="w-5 h-5 text-yellow-500 ml-2" />
              </div>
              
              {recommendations.length > 0 ? (
                <div className="grid gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {rec.investment.name}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {rec.investment.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2"><strong>Description:</strong></p>
                          <p className="text-sm">{rec.investment.description}</p>
                          <p className="text-sm text-gray-600 italic mt-2">{rec.investment.local_description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Recommended Amount:</strong> KSh {parseFloat(rec.recommended_amount).toLocaleString()}</p>
                          <p className="text-sm"><strong>Expected Return:</strong> {rec.investment.expected_return}% annually</p>
                          <p className="text-sm"><strong>Minimum Investment:</strong> KSh {parseFloat(rec.investment.minimum_amount).toLocaleString()}</p>
                          <p className="text-sm"><strong>Risk Level:</strong> {rec.investment.risk_level}</p>
                          <p className="text-sm"><strong>AI Confidence:</strong> {(parseFloat(rec.confidence_score) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm"><strong>AI Rationale:</strong></p>
                        <p className="text-sm text-gray-700 mt-1">{rec.ai_rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No recommendations generated yet. The AI service might be unavailable.</p>
                </div>
              )}
            </div>

            <button
              onClick={restart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create New Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Investment Profile</h2>
          <p className="text-gray-600">Our AI is analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  // Show form
  const currentQuestion = questions[currentStep];
  const isAnswered = formData[currentQuestion.id] !== undefined && formData[currentQuestion.id] !== '';

  return (
    <div className="min-h-screen p-4" style={{
      background: "linear-gradient(to bottom right, var(--color-background), var(--color-accent))"
    }}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">AI-Powered Risk Profiler</h1>
                <p className="text-blue-100">Get personalized investment recommendations</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Bot className="w-6 h-6" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="h-2 bg-white rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-blue-100">
              Question {currentStep + 1} of {questions.length}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Question Content */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                {currentQuestion.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {currentQuestion.subtitle}
                </h2>
                <p className="text-sm text-gray-600">{currentQuestion.title}</p>
              </div>
            </div>

            {/* Form Input */}
            <div className="mb-6">
              {currentQuestion.type === 'radio' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(currentQuestion.id, option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        formData[currentQuestion.id] === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData[currentQuestion.id] === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData[currentQuestion.id] === option.value && (
                            <div className="w-full h-full rounded-full bg-white transform scale-50" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : currentQuestion.type === 'textarea' ? (
                <textarea
                  value={formData[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  rows={4}
                />
              ) : (
                <input
                  type={currentQuestion.type}
                  value={formData[currentQuestion.id] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Get AI Recommendations' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationConnected;