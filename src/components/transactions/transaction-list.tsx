'use client'

import { useState } from 'react'
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TransactionForm } from './transaction-form'
import { DeleteDialog } from './delete-dialog'

interface TransactionListProps {
  transactions: Transaction[]
  onRefresh: () => void
}

export function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ArrowUpCircle className="h-7 w-7 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">Nenhuma transação encontrada</p>
        <p className="text-gray-400 text-sm mt-1">Ajuste os filtros ou adicione uma nova transação</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(t.date)}</TableCell>
                <TableCell>
                  <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditTarget(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteTarget(t)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {t.type === 'income'
                ? <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                : <ArrowDownCircle className="h-5 w-5 text-red-600" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{t.description}</p>
              <p className="text-xs text-gray-400">{t.category} · {formatDate(t.date)}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <div className="flex gap-1">
                <button onClick={() => setEditTarget(t)} className="text-gray-400 hover:text-gray-600">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(t)} className="text-red-300 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editTarget && (
        <TransactionForm
          open={!!editTarget}
          transaction={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={onRefresh}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          open={!!deleteTarget}
          transactionId={deleteTarget.id}
          description={deleteTarget.description}
          onClose={() => setDeleteTarget(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  )
}
