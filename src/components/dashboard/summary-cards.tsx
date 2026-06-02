import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
}

export function SummaryCards({ totalIncome, totalExpenses }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-0 shadow-sm bg-emerald-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-emerald-700">Receitas</span>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-red-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-red-700">Despesas</span>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>

      <Card className={`border-0 shadow-sm ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo</span>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <Wallet className={`h-4 w-4 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {formatCurrency(balance)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
