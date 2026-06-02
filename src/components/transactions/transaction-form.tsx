'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().refine((v) => !isNaN(Number(v.replace(',', '.'))) && Number(v.replace(',', '.')) > 0, {
    message: 'Valor inválido',
  }),
  description: z.string().min(1, 'Descrição obrigatória').max(100),
  category: z.string().min(1, 'Categoria obrigatória'),
  date: z.string().min(1, 'Data obrigatória'),
})

type FormData = z.infer<typeof schema>

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction
}

export function TransactionForm({ open, onClose, onSuccess, transaction }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!transaction

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: transaction?.type ?? 'expense',
      amount: transaction ? String(transaction.amount) : '',
      description: transaction?.description ?? '',
      category: transaction?.category ?? '',
      date: transaction?.date ?? new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type')
  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(data: FormData) {
    setLoading(true)
    const supabase = createClient()
    const amount = parseFloat(data.amount.replace(',', '.'))

    if (isEditing) {
      const { error } = await supabase
        .from('transactions')
        .update({ type: data.type, amount, description: data.description, category: data.category, date: data.date })
        .eq('id', transaction.id)
      if (error) {
        toast.error('Erro ao atualizar transação')
        setLoading(false)
        return
      }
      toast.success('Transação atualizada!')
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: data.type,
        amount,
        description: data.description,
        category: data.category,
        date: data.date,
      })
      if (error) {
        toast.error('Erro ao criar transação')
        setLoading(false)
        return
      }
      toast.success('Transação criada!')
    }

    reset()
    setLoading(false)
    onSuccess()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setValue('type', 'income'); setValue('category', '') }}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedType === 'income'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => { setValue('type', 'expense'); setValue('category', '') }}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedType === 'expense'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Despesa
            </button>
          </div>

          <div className="space-y-1.5">
            <Label>Valor (R$)</Label>
            <Input placeholder="0,00" {...register('amount')} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input placeholder="Ex: Supermercado" {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select
              defaultValue={transaction?.category}
              onValueChange={(v) => setValue('category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
