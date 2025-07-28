import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Target, DollarSign, Clock, Users, ArrowLeft, CheckCircle, AlertCircle, Loader2, Calculator, PieChart, BarChart3, Info, ChevronRight, LogOut, Lock } from 'lucide-react';
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
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
              onClick={() => window.location.href = '/login'}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
      const response = await fetchWithAuth('http://localhost:8000/api/risk-profile/', {
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
        throw new Error(data.error || 'Failed to generate recommendations');
      }

      setRecommendations(data.recommendations || []);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Pole! Tumepata shida. Tafadhali jaribu tena baadaye.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
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

  const getRiskTooltip = (risk) => {
    switch (risk) {
      case 'conservative': return 'Low risk, stable returns. Good for capital preservation.';
      case 'moderate': return 'Medium risk, balanced returns. Good for steady growth.';
      case 'aggressive': return 'High risk, high potential returns. Good for long-term wealth building.';
      default: return '';
    }
  };

  // --- Step 1: Welcome Screen ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Welcome, {user?.full_name || user?.username}!
                </h2>
                <p className="text-sm text-gray-600">Ready to grow your wealth?</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-800 rounded-full mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Risk Profiler</h1>
           
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Discover personalized investment opportunities tailored for you. 
              Get AI-powered recommendations starting from as little as KSh 1,000.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[{
              icon: <TrendingUp className="w-12 h-12 text-green-700" />,
              title: 'AI-Powered Recommendations',
              subtitle: 'Mapendekezo yanayoongozwa na AI',
              desc: 'Get personalized investment advice based on your unique financial profile and goals'
            }, {
              icon: <Shield className="w-12 h-12 text-blue-900" />,
              title: 'Risk Assessment',
              subtitle: 'Tathmini ya hatari ya kibinafsi',
              desc: 'Comprehensive risk analysis to match investments with your comfort level'
            }, {
              icon: <Target className="w-12 h-12 text-green-900" />,
              title: 'Local Market Focus',
              subtitle: 'Uwekezaji unaofaa mazingira ya Kenya',
              desc: 'Investments specifically curated for the Kenyan market including NSE, SACCOs, and more'
            }].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-gray-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 font-medium">{feature.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Start Your Investment Journey?</h2>
              <p className="text-green-100">Tayari kuanza safari yako ya uwekezaji?</p>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What you'll get:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                      <span>Personalized investment recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                      <span>Risk assessment and portfolio allocation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                      <span>Expected returns and timeline analysis</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-700 mr-3" />
                      <span>Local market insights and opportunities</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Takes only 3-5 minutes to complete the assessment
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Start Assessment - Anza Tathmini
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back - Rudi Nyuma
          </button>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">Investment Profile Assessment</h1>
          
              <div className="mt-4 bg-white/20 rounded-full h-2">
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
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-500 transition-colors ${
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
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
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
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-500 transition-colors ${
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
                        className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
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
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-500 transition-colors ${
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
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-500 transition-colors ${
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
                  className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Get My Recommendations - Pata Mapendekezo
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

  // --- Step 3: Enhanced Recommendations ---
  if (step === 3) {
    const totalRecommended = calculateTotalRecommendedAmount();
    const projectedReturns = calculateProjectedReturns();
    const totalProjectedReturn = projectedReturns.reduce((sum, item) => sum + item.projectedReturn, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setStep(2)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Assessment
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Investment Recommendations</h1>
            <p className="text-lg text-gray-600">Mapendekezo Yako ya Uwekezaji</p>
            <p className="text-sm text-green-600 font-medium mt-2">Profile Analysis Complete ✓</p>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Investment Profile Summary</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium text-gray-600">Investment Amount</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(profile.investment_amount)}</p>
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
            <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Recommended</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalRecommended)}</p>
                <p className="text-sm text-gray-500">
                  {((totalRecommended / profile.investment_amount) * 100).toFixed(1)}% of available funds
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Number of Investments</p>
                <p className="text-2xl font-bold text-slate-900">{recommendations.length}</p>
                <p className="text-sm text-gray-500">Diversified portfolio</p>
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
          <div className="space-y-6">
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recommendations Available</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't generate recommendations at this time. Please try again or contact support.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
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
                            Confidence: {(rec.confidence_score * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Recommended Amount</p>
                        <p className="text-lg font-bold text-green-700">
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
                        <h4 className="font-semibold text-blue-900 mb-2">Why we recommend this:</h4>
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
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                        Invest Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default RiskProfiler;