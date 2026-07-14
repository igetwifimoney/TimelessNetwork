'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, Package, DollarSign, Percent, Search } from 'lucide-react'

type Status = 'testing' | 'winner' | 'killed' | 'researching'

interface Product {
  id: string
  name: string
  supplier: string
  buyPrice: number
  sellPrice: number
  status: Status
  notes: string
  createdAt: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  researching: {
    label: 'Researching',
    color: 'text-yellow-400',
    bg: 'rgba(234,179,8,0.1)',
    icon: <Search className="w-3 h-3" />,
  },
  testing: {
    label: 'Testing',
    color: 'text-blue-400',
    bg: 'rgba(168,85,247,0.1)',
    icon: <TrendingUp className="w-3 h-3" />,
  },
  winner: {
    label: 'Winner 🏆',
    color: 'text-green-400',
    bg: 'rgba(34,197,94,0.1)',
    icon: <TrendingUp className="w-3 h-3" />,
  },
  killed: {
    label: 'Killed',
    color: 'text-red-400',
    bg: 'rgba(239,68,68,0.1)',
    icon: <TrendingDown className="w-3 h-3" />,
  },
}

const EMPTY: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  supplier: '',
  buyPrice: 0,
  sellPrice: 0,
  status: 'researching',
  notes: '',
}

function margin(buy: number, sell: number): number {
  if (!sell || sell <= 0) return 0
  return Math.round(((sell - buy) / sell) * 100)
}

function profit(buy: number, sell: number): number {
  return +(sell - buy).toFixed(2)
}

export default function TrackerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [editId, setEditId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [search, setSearch] = useState('')

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeless_products')
      if (saved) setProducts(JSON.parse(saved))
    } catch {}
  }, [])

  function save(updated: Product[]) {
    setProducts(updated)
    localStorage.setItem('timeless_products', JSON.stringify(updated))
  }

  function addOrUpdate() {
    if (!form.name.trim()) return

    if (editId) {
      save(products.map(p => p.id === editId ? { ...p, ...form } : p))
      setEditId(null)
    } else {
      const newProduct: Product = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      save([newProduct, ...products])
    }
    setForm({ ...EMPTY })
    setShowForm(false)
  }

  function remove(id: string) {
    save(products.filter(p => p.id !== id))
  }

  function startEdit(product: Product) {
    setForm({
      name: product.name,
      supplier: product.supplier,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      status: product.status,
      notes: product.notes,
    })
    setEditId(product.id)
    setShowForm(true)
  }

  function cycleStatus(id: string) {
    const statuses: Status[] = ['researching', 'testing', 'winner', 'killed']
    save(products.map(p => {
      if (p.id !== id) return p
      const idx = statuses.indexOf(p.status)
      return { ...p, status: statuses[(idx + 1) % statuses.length] }
    }))
  }

  const filtered = products
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase()))

  const winners = products.filter(p => p.status === 'winner').length
  const testing = products.filter(p => p.status === 'testing').length
  const avgMargin = products.length
    ? Math.round(products.reduce((sum, p) => sum + margin(p.buyPrice, p.sellPrice), 0) / products.length)
    : 0

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">Product Tracker</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track products from research → winner → scale</p>
          </div>
          <button
            onClick={() => { setForm({ ...EMPTY }); setEditId(null); setShowForm(true) }}
            className="btn-premium flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-400">{winners}</div>
            <div className="text-xs text-gray-500 mt-0.5">Winners</div>
          </div>
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#a855f7]">{testing}</div>
            <div className="text-xs text-gray-500 mt-0.5">In Testing</div>
          </div>
          <div className="card rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-white">{avgMargin}%</div>
            <div className="text-xs text-gray-500 mt-0.5">Avg Margin</div>
          </div>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="card rounded-2xl p-5 mb-6" style={{ border: '1px solid rgba(168,85,247,0.15)' }}>
            <h3 className="font-bold text-sm mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. LED Makeup Mirror"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Supplier</label>
                <input
                  value={form.supplier}
                  onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}
                  placeholder="e.g. Amazon, Alibaba, Faire"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Buy Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.buyPrice || ''}
                  onChange={e => setForm(f => ({ ...f, buyPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Sell Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellPrice || ''}
                  onChange={e => setForm(f => ({ ...f, sellPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white outline-none focus:border-white/20 transition-colors"
                >
                  <option value="researching">Researching</option>
                  <option value="testing">Testing</option>
                  <option value="winner">Winner</option>
                  <option value="killed">Killed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                <input
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any notes..."
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            {/* Margin preview */}
            {(form.buyPrice > 0 || form.sellPrice > 0) && (
              <div className="mt-3 p-3 rounded-xl flex gap-4 text-sm" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-gray-500">Profit: <span className="text-white font-bold">${profit(form.buyPrice, form.sellPrice)}</span></span>
                <span className="text-gray-500">Margin: <span className={`font-bold ${margin(form.buyPrice, form.sellPrice) >= 40 ? 'text-green-400' : margin(form.buyPrice, form.sellPrice) >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>{margin(form.buyPrice, form.sellPrice)}%</span></span>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={addOrUpdate} className="btn-premium px-4 py-2 rounded-xl text-sm font-bold">
                {editId ? 'Update' : 'Add Product'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm({ ...EMPTY }) }}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 transition-colors hover:text-white"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white/4 border border-white/6 text-white placeholder-gray-600 outline-none focus:border-white/15 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {(['all', 'researching', 'testing', 'winner', 'killed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0"
                style={filter === s
                  ? { background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">
              {products.length === 0
                ? 'No products yet. Add your first one to start tracking.'
                : 'No products match your filter.'
              }
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => {
              const m = margin(p.buyPrice, p.sellPrice)
              const prof = profit(p.buyPrice, p.sellPrice)
              const sc = STATUS_CONFIG[p.status]
              return (
                <div key={p.id} className="card rounded-2xl p-4 group"
                  style={{ border: p.status === 'winner' ? '1px solid rgba(34,197,94,0.12)' : undefined }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{p.name}</span>
                        {p.supplier && <span className="text-xs text-gray-600">· {p.supplier}</span>}
                        {/* Status badge — click to cycle */}
                        <button
                          onClick={() => cycleStatus(p.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all hover:opacity-80"
                          style={{ background: sc.bg, color: sc.color.replace('text-', '') }}
                          title="Click to change status"
                        >
                          {sc.icon}
                          <span className={sc.color}>{sc.label}</span>
                        </button>
                      </div>
                      {p.notes && <div className="text-xs text-gray-500 mt-1">{p.notes}</div>}
                    </div>

                    {/* Financials */}
                    <div className="flex items-center gap-4 flex-shrink-0 text-right">
                      {p.sellPrice > 0 && (
                        <>
                          <div>
                            <div className="text-xs text-gray-600">Profit</div>
                            <div className="text-sm font-bold text-white">${prof}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Margin</div>
                            <div className={`text-sm font-bold ${m >= 40 ? 'text-green-400' : m >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {m}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Sell</div>
                            <div className="text-sm font-bold text-white">${p.sellPrice}</div>
                          </div>
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => remove(p.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:text-red-400 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
