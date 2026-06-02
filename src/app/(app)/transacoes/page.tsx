'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionType, ALL_CATEGORIES } from '@/types'
import { getCurrentMonthYear, getMonthName } from '@/lib/utils'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

export default function TransacoesPage() {
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  const [type, setType] = useState<TransactionType | 'all'>('all')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    let query = supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (type !== 'all') query = query.eq('type', type)
    if (category !== 'all') query = query.eq('category', category)

    const { data } = await query
    setTransactions(data ?? [])
    setLoading(false)
  }, [month, year, type, category])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const filtered = search.trim()
    ? transactions.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    : transactions

  function clearFilters() {
    setMonth(currentMonth)
    setYear(currentYear)
    setType('all')
    setCategory('all')
    setSearch('')
  }

  const hasFilters = month !== currentMonth || year !== currentYear || type !== 'all' || category !== 'all' || search

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {filtered.length} transaç{filtered.length !== 1 ? 'ões' : 'ão'}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nova transação
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Month */}
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)} className="capitalize">
                  {getMonthName(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type */}
          <Select value={type} onValueChange={(v) => setType(v as TransactionType | 'all')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {ALL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por descrição ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {hasFilters && (
            <Button variant="outline" size="icon" onClick={clearFilters} title="Limpar filtros">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="p-1">
            <TransactionList transactions={filtered} onRefresh={fetchTransactions} />
          </div>
        )}
      </div>

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
