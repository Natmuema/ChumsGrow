import React, { useMemo, useState } from 'react'
import { blogPosts } from '../utils/blogPosts'
import { Search, Calendar, Clock, Tag, Bookmark, ArrowRight } from 'lucide-react'

const LearningHub = () => {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map(p => p.category))
    return ['All', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    return blogPosts.filter(p => {
      const matchesQuery = `${p.title} ${p.excerpt} ${p.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
      const matchesCat = activeCategory === 'All' || p.category === activeCategory
      return matchesQuery && matchesCat
    })
  }, [query, activeCategory])

  const featured = blogPosts[0]
  const others = filtered.filter(p => p.id !== featured.id)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600 mt-2">Actionable, Kenya-focused investing guides and insights.</p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, e.g., money market, NSE..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap ${activeCategory === cat ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-2xl group border border-gray-200">
            <img src={featured.image} alt={featured.title} className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{featured.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{featured.readTime}</span>
                <span className="inline-flex items-center gap-1"><Tag className="w-4 h-4" />{featured.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{featured.title}</h2>
              <p className="text-gray-600 mb-4">{featured.excerpt}</p>
              <a href="#" className="inline-flex items-center text-green-700 font-semibold hover:underline">Read article<ArrowRight className="w-4 h-4 ml-1" /></a>
            </div>
          </div>

          {/* Sidebar: Popular / Newsletter */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Popular topics</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(blogPosts.flatMap(p => p.tags || []))].slice(0,10).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Free weekly newsletter</h3>
              <p className="text-sm text-gray-600 mb-3">Kenya market insights and practical investing tips.</p>
              <div className="flex gap-2">
                <input placeholder="Enter your email" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" />
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map(post => (
            <article key={post.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative">
                <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
                <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white">
                  <Bookmark className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-gray-900 leading-snug">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{post.category}</span>
                  <a href="#" className="text-sm text-green-700 hover:underline inline-flex items-center">Read<ArrowRight className="w-3.5 h-3.5 ml-1" /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearningHub