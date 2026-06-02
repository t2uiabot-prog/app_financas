'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'
import { getCurrentMonthYear, getMonthName } from '@/lib/utils'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ExpensesChart } from '@/components/dashboard/expenses-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear()
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    setTransactions(data ?? [])
    setLoading(false)
  }, [month, year])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Visão geral das suas finanças</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month selector */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center capitalize">
              {getMonthName(month)} {year}
            </span>
            <button
              onClick={nextMonth}
              disabled={month === currentMonth && year === currentYear}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova transação
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensesChart transactions={transactions} />
            <RecentTransactions transactions={transactions} />
          </div>
        </>
      )}

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  )
}
