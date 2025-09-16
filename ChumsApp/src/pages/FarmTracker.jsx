import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  Leaf,
  QrCode,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api/farmtrack';

const FarmTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/dashboard/stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Farm-to-Market Tracker Dashboard</h1>
        <p className="text-green-100">Blockchain-powered supply chain transparency with fair farmer payments</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Active Farmers"
              value={stats?.total_farmers || 0}
              subtitle="Verified farmers on platform"
              color="bg-blue-500"
            />
            <StatCard
              icon={Package}
              title="Total Produce"
              value={stats?.total_produce || 0}
              subtitle="Registered products"
              color="bg-purple-500"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`KES ${stats?.total_revenue || 0}`}
              subtitle="Farmer payments processed"
              color="bg-green-500"
            />
            <StatCard
              icon={Leaf}
              title="Carbon Credits"
              value={stats?.carbon_credits_issued || 0}
              subtitle="Credits issued to farmers"
              color="bg-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Active Shipments
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">In Transit</span>
                  <span className="text-2xl font-bold text-blue-600">{stats?.active_shipments || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Verified Produce</span>
                  <span className="text-2xl font-bold text-green-600">{stats?.verified_produce || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Sustainability Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Eco-Friendly Produce</span>
                  <span className="text-lg font-bold text-green-600">
                    {stats?.eco_friendly_percentage?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.eco_friendly_percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Percentage of produce certified as organic or eco-friendly
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveTab('farmers')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Users className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg">Farmer Management</h3>
              <p className="text-gray-600 text-sm mt-1">Register and manage farmers</p>
            </button>

            <button
              onClick={() => setActiveTab('produce')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Package className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg">Produce Tracking</h3>
              <p className="text-gray-600 text-sm mt-1">Track produce from farm to market</p>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <QrCode className="w-12 h-12 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg">Verify Authenticity</h3>
              <p className="text-gray-600 text-sm mt-1">Scan QR codes to verify products</p>
            </button>
          </div>
        </>
      )}
    </div>
  );

  const tabContent = {
    dashboard: renderDashboard(),
    farmers: <FarmerManagement />,
    produce: <ProduceTracking />,
    verify: <ProductVerification />,
    transactions: <TransactionHistory />,
    carbon: <CarbonCredits />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h2 className="text-xl font-bold text-gray-800">FarmTrack DLT</h2>
              <nav className="flex space-x-4">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'farmers', label: 'Farmers', icon: Users },
                  { id: 'produce', label: 'Produce', icon: Package },
                  { id: 'verify', label: 'Verify', icon: QrCode },
                  { id: 'transactions', label: 'Payments', icon: DollarSign },
                  { id: 'carbon', label: 'Carbon Credits', icon: Leaf }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

// Farmer Management Component
const FarmerManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/farmers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarmers(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      setLoading(false);
    }
  };

  const FarmerRegistrationForm = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      farm_name: '',
      location: '',
      phone_number: '',
      mpesa_number: '',
      eco_practices: []
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${API_URL}/register/`, formData);
        if (response.data.success) {
          alert('Farmer registered successfully!');
          setShowRegisterForm(false);
          fetchFarmers();
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6">Register New Farmer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                className="px-4 py-2 border rounded-lg"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-2 border rounded-lg"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border rounded-lg"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Farm Name"
                className="px-4 py-2 border rounded-lg"
                value={formData.farm_name}
                onChange={(e) => setFormData({...formData, farm_name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-2 border rounded-lg"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-2 border rounded-lg"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                className="px-4 py-2 border rounded-lg"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="px-4 py-2 border rounded-lg"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="M-Pesa Number"
                className="px-4 py-2 border rounded-lg col-span-2"
                value={formData.mpesa_number}
                onChange={(e) => setFormData({...formData, mpesa_number: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Register Farmer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Farmer Management</h2>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          Register New Farmer
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <div key={farmer.farmer_id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{farmer.farm_name}</h3>
                  <p className="text-gray-600 text-sm">{farmer.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  farmer.certification_status === 'verified' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {farmer.certification_status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{farmer.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">M-Pesa:</span>
                  <span>{farmer.mpesa_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbon Credits:</span>
                  <span className="font-semibold text-green-600">{farmer.carbon_credits_earned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Produce:</span>
                  <span className="font-semibold">{farmer.active_produce_count || 0}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between">
                <button className="text-blue-600 hover:text-blue-700 text-sm">View Details</button>
                <button className="text-green-600 hover:text-green-700 text-sm">Create Blockchain Account</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRegisterForm && <FarmerRegistrationForm />}
    </div>
  );
};

// Produce Tracking Component
const ProduceTracking = () => {
  const [produce, setProduce] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduce();
  }, []);

  const fetchProduce = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/produce/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduce(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching produce:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'registered': 'bg-blue-100 text-blue-700',
      'in_transit': 'bg-yellow-100 text-yellow-700',
      'at_market': 'bg-purple-100 text-purple-700',
      'sold': 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produce Tracking</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Package className="w-5 h-5" />
          Register New Produce
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {produce.map((item) => (
            <div key={item.produce_id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm">by {item.farmer_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p className="font-semibold">{item.quantity} {item.unit}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Quality</p>
                  <p className="font-semibold">Grade {item.quality_grade}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Price/Unit</p>
                  <p className="font-semibold">KES {item.price_per_unit}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Harvest Date</p>
                  <p className="font-semibold">{new Date(item.harvest_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {item.organic_certified && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Organic
                  </span>
                )}
                {item.pesticide_free && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Pesticide Free
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  Eco Score: <span className="font-semibold text-green-600">{item.eco_score}/100</span>
                </span>
              </div>

              {item.last_location && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Last seen at: <span className="font-medium">{item.last_location.location}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.last_location.timestamp).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProduce(item)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  View Journey
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Add Tracking Point
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <QrCode className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Verification Component
const ProductVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify/`, {
        produce_id: verificationCode,
        verification_method: 'manual_code'
      });
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Verification failed. Please check the code and try again.'
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Verify Product Authenticity</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Product Code or Scan QR
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter product ID or scan QR code"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                onClick={handleVerification}
                disabled={loading || !verificationCode}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Verify
              </button>
            </div>
          </div>

          {verificationResult && (
            <div className={`rounded-xl p-6 ${
              verificationResult.authentic 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                {verificationResult.authentic ? (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    verificationResult.authentic ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.message}
                  </h3>
                  
                  {verificationResult.produce && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Product Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Product:</span>
                            <span className="ml-2 font-medium">{verificationResult.produce.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quality:</span>
                            <span className="ml-2 font-medium">Grade {verificationResult.produce.quality_grade}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{verificationResult.produce.quantity} {verificationResult.produce.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Harvest Date:</span>
                            <span className="ml-2 font-medium">{new Date(verificationResult.produce.harvest_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {verificationResult.farmer && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Farmer Information</h4>
                          <div className="text-sm">
                            <p><span className="text-gray-600">Farm:</span> <span className="font-medium">{verificationResult.farmer.farm_name}</span></p>
                            <p><span className="text-gray-600">Location:</span> <span className="font-medium">{verificationResult.farmer.location}</span></p>
                            <p><span className="text-gray-600">Certification:</span> <span className="font-medium capitalize">{verificationResult.farmer.certification_status}</span></p>
                          </div>
                        </div>
                      )}

                      {verificationResult.journey && verificationResult.journey.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Supply Chain Journey</h4>
                          <div className="space-y-2">
                            {verificationResult.journey.map((point, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <div className="flex-1">
                                  <span className="font-medium">{point.location_name}</span>
                                  <span className="text-gray-500 ml-2">
                                    {new Date(point.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Transaction History Component
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/transactions/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Transactions</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.farmer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.produce_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {transaction.final_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.payment_method.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.payment_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Carbon Credits Component
const CarbonCredits = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch carbon credits data
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Carbon Credits Program</h2>
        <p className="text-green-100">Rewarding farmers for eco-friendly practices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Leaf className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Total Credits Issued</h3>
          <p className="text-3xl font-bold text-green-600">1,250</p>
          <p className="text-gray-600 text-sm mt-2">Across all farmers</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Award className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Credits Value</h3>
          <p className="text-3xl font-bold text-blue-600">$12,500</p>
          <p className="text-gray-600 text-sm mt-2">Total value generated</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Active Programs</h3>
          <p className="text-3xl font-bold text-purple-600">6</p>
          <p className="text-gray-600 text-sm mt-2">Sustainability initiatives</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Eligible Practices for Carbon Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Organic Farming', credits: '10 credits/hectare', icon: '🌾' },
            { name: 'Water Conservation', credits: '5 credits/1000L saved', icon: '💧' },
            { name: 'Renewable Energy', credits: '15 credits/kW installed', icon: '⚡' },
            { name: 'Reforestation', credits: '20 credits/100 trees', icon: '🌳' },
            { name: 'Soil Management', credits: '8 credits/hectare', icon: '🌱' },
            { name: 'Waste Reduction', credits: '3 credits/ton reduced', icon: '♻️' }
          ].map((practice, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-3xl">{practice.icon}</span>
              <div>
                <h4 className="font-medium">{practice.name}</h4>
                <p className="text-sm text-gray-600">{practice.credits}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmTracker;