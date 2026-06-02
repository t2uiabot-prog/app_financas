import Link from 'next/link'
import { ArrowUpCircle, ArrowDownCircle, ArrowRight } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 6)

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Últimas Transações</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs text-blue-600 hover:text-blue-700">
          <Link href="/transacoes">
            Ver todas <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Nenhuma transação ainda</p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {t.type === 'income'
                    ? <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                    : <ArrowDownCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">{t.category}</Badge>
                    <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                  </div>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
