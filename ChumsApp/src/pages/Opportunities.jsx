import React, { useEffect, useState } from 'react'
import { TrendingUp, Filter, Search, ArrowRight, Layers, CheckCircle, AlertCircle } from 'lucide-react'
import { fetchWithAuth } from '../utils/api'

const Opportunities = () => {
  const [investmentTypes, setInvestmentTypes] = useState([])
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState('all')

  // Fallback data if backend returns nothing or user isn't authenticated
  const defaultTypes = [
    { type: 'money_market', name: 'Money Market', description: 'Short-term, low-risk funds' },
    { type: 'stocks', name: 'Stocks', description: 'NSE listed equities' },
    { type: 'bonds', name: 'Bonds', description: 'Government and corporate bonds' },
    { type: 'mutual_funds', name: 'Mutual Funds', description: 'Professionally managed funds' },
    { type: 'real_estate', name: 'Real Estate', description: 'REITs and property funds' },
    { type: 'fixed_deposit', name: 'Fixed Deposit', description: 'Bank fixed-term deposits' }
  ]

  const defaultInvestments = [
    {
      id: 1,
      name: 'CIC Money Market Fund',
      type: 'money_market',
      type_display: 'Soko la Fedha',
      minimum_amount: 1000,
      expected_return: 8.2,
      risk_level: 'conservative',
      risk_level_display: 'Conservative'
    },
    {
      id: 2,
      name: 'NSE Blue-Chip Basket',
      type: 'stocks',
      type_display: 'Hisa za Kampuni',
      minimum_amount: 5000,
      expected_return: 16.0,
      risk_level: 'moderate',
      risk_level_display: 'Moderate'
    },
    {
      id: 3,
      name: 'Balanced Mutual Fund',
      type: 'mutual_funds',
      type_display: 'Mfuko wa Uongozi',
      minimum_amount: 2000,
      expected_return: 12.5,
      risk_level: 'moderate',
      risk_level_display: 'Moderate'
    },
    {
      id: 4,
      name: 'Kenya Government Bond (T-Bond)',
      type: 'bonds',
      type_display: 'Dhamana',
      minimum_amount: 50000,
      expected_return: 13.5,
      risk_level: 'conservative',
      risk_level_display: 'Conservative'
    },
    {
      id: 5,
      name: 'Fahari I-REIT',
      type: 'real_estate',
      type_display: 'Mali Isiyohamishika',
      minimum_amount: 10000,
      expected_return: 11.0,
      risk_level: 'moderate',
      risk_level_display: 'Moderate'
    },
    {
      id: 6,
      name: 'Fixed Deposit (Tier 1 Bank)',
      type: 'fixed_deposit',
      type_display: 'Amana ya Muda',
      minimum_amount: 5000,
      expected_return: 9.0,
      risk_level: 'conservative',
      risk_level_display: 'Conservative'
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [typesRes, invRes] = await Promise.all([
          fetchWithAuth('http://127.0.0.1:8000/api/investment-types/'),
          fetchWithAuth('http://127.0.0.1:8000/api/investments/')
        ])

        const typesJson = await typesRes.json()
        const invJson = await invRes.json()

        const types = (typesJson && typesJson.investment_types) ? typesJson.investment_types : []
        const invs = (invJson && invJson.investments) ? invJson.investments : []

        setInvestmentTypes(types.length ? types : defaultTypes)
        setInvestments(invs.length ? invs : defaultInvestments)
      } catch (e) {
        // Use fallback data on error
        setInvestmentTypes(defaultTypes)
        setInvestments(defaultInvestments)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filtered = investments.filter(inv => {
    const matchesType = activeType === 'all' || inv.type === activeType
    const matchesQuery = query.trim().length === 0 || inv.name.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Investment Opportunities</h1>
          </div>
          <p className="text-blue-200 max-w-2xl">
            Explore curated opportunities across asset classes. Filter by type and search to find what fits your profile.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-primary p-4 mb-6 reveal">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full outline-none text-gray-700"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveType('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${activeType==='all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              {investmentTypes.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setActiveType(t.type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeType===t.type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-primary p-6 border border-gray-200">
                <div className="skeleton skeleton-text lg mb-3" style={{ width: '70%' }}></div>
                <div className="skeleton skeleton-text sm mb-4" style={{ width: '40%' }}></div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="skeleton skeleton-text lg" style={{ height: '2.5rem' }}></div>
                  <div className="skeleton skeleton-text lg" style={{ height: '2.5rem' }}></div>
                </div>
                <div className="skeleton skeleton-text" style={{ height: '2.5rem' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {filtered.map((inv) => (
              <div key={inv.id} className="bg-white rounded-xl shadow-primary p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-primary">{inv.name}</h3>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-white">{inv.risk_level_display}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 min-h-10">{inv.type_display}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">Minimum</div>
                    <div className="font-semibold text-gray-800">KSh {parseFloat(inv.minimum_amount).toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">Expected Return</div>
                    <div className="font-semibold text-gray-800">{parseFloat(inv.expected_return).toFixed(1)}% p.a.</div>
                  </div>
                </div>
                <button className="w-full bg-primary hover:bg-blue-900 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-600 col-span-full">
                No opportunities match your filters.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Opportunities